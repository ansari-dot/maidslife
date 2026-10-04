import mongoose from 'mongoose';
import { Booking } from './booking.model.js';
import { Customer } from '../customers/customer.model.js';
import { Cleaner } from '../cleaners/cleaner.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { getPaginationOptions, getPaginationMeta } from '../../utils/pagination.js';
import { sendEmail } from '../../config/mailer.js';

import { Coupon } from '../coupons/coupon.model.js';

export class BookingService {
  static async createBooking(data) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const bookingRef = `ML-${Math.floor(1000 + Math.random() * 9000)}`;

      // Handle customer auto-creation/lookup
      let customerId = data.customer;
      let customerObj = null;
      
      if (customerId) {
        customerObj = await Customer.findById(customerId).session(session);
      }
      
      if (!customerId && data.customerPhone) {
        customerObj = await Customer.findOne({ phone: data.customerPhone }).session(session);
        if (!customerObj) {
          const createdCustomers = await Customer.create([{
            name: data.customerName || 'Guest Customer',
            phone: data.customerPhone,
            email: data.customerEmail || undefined,
          }], { session });
          customerObj = createdCustomers[0];
        }
        customerId = customerObj._id;
      }

      if (!customerId) {
        throw new ApiError(400, 'Customer details are required to create a booking');
      }

      // Handle coupon usage increment
      if (data.couponCode) {
        const updateData = { $inc: { usedCount: 1 } };
        const emailToPush = data.customerEmail || (customerObj && customerObj.email ? customerObj.email : null);
        
        if (emailToPush) {
          updateData.$addToSet = { usedByEmails: emailToPush.toLowerCase().trim() };
        }

        const coupon = await Coupon.findOneAndUpdate(
          { code: data.couponCode.toUpperCase(), isActive: true },
          updateData,
          { new: true, session }
        );
        if (!coupon) {
          throw new ApiError(400, 'Invalid or inactive coupon code');
        }
      }

      const initialTimeline = [
        {
          status: data.cleaner ? 'assigned' : 'pending_assignment',
          timestamp: new Date(),
          note: 'Booking created',
        },
      ];

      const createdBookings = await Booking.create([{
        ...data,
        customer: customerId,
        bookingRef,
        status: data.cleaner ? 'assigned' : 'pending_assignment',
        timeline: initialTimeline,
      }], { session });
      const booking = createdBookings[0];

      // Update customer totalBookings & lastBookingAt
      await Customer.findByIdAndUpdate(customerId, {
        $inc: { totalBookings: 1 },
        lastBookingAt: new Date(),
      }, { session });

      // If assigned cleaner, update cleaner activeBookingsCount
      if (data.cleaner) {
        await Cleaner.findByIdAndUpdate(data.cleaner, {
          $inc: { activeBookingsCount: 1 },
        }, { session });
      }

      await session.commitTransaction();
      session.endSession();

      return { booking };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  static async processZiinaWebhook(payload) {
    // Deprecated in favor of the Payments module webhook
    console.warn('Old processZiinaWebhook called, this should route to payments module.');
  }

  static async getAllBookings(query) {
    const { page, limit, skip, sort } = getPaginationOptions(query);
    const filter = {};

    if (query.status) {
      filter.status = query.status;
    }
    if (query.area) {
      filter.area = query.area;
    }
    if (query.customer) {
      filter.customer = query.customer;
    }
    if (query.email || query.customerEmail) {
      const targetEmail = (query.email || query.customerEmail).toLowerCase().trim();
      const matchedCustomer = await Customer.findOne({ email: { $regex: `^${targetEmail}$`, $options: 'i' } });
      if (matchedCustomer) {
        filter.$or = [
          { customer: matchedCustomer._id },
          { customerEmail: { $regex: targetEmail, $options: 'i' } }
        ];
      } else {
        filter.customerEmail = { $regex: targetEmail, $options: 'i' };
      }
    }
    if (query.cleaner) {
      filter.cleaner = query.cleaner;
    }
    if (query.search) {
      filter.$or = [
        { bookingRef: { $regex: query.search, $options: 'i' } },
        { area: { $regex: query.search, $options: 'i' } },
      ];
    }
    if (query.from && query.to) {
      filter.scheduledAt = {
        $gte: new Date(query.from),
        $lte: new Date(query.to),
      };
    }

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('customer', 'name phone email')
        .populate('service', 'name tagline startingPrice')

        .populate('addons', 'name price')
        .populate('cleaner', 'name phone avatarUrl status currentLocation')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Booking.countDocuments(filter),
    ]);

    return {
      bookings,
      meta: getPaginationMeta(total, page, limit),
    };
  }

  static async getBookingById(id) {
    const booking = await Booking.findById(id)
      .populate('customer', 'name phone email totalBookings')
      .populate('service', 'name tagline startingPrice')

      .populate('addons', 'name price')
      .populate('cleaner', 'name phone avatarUrl status rating completedJobs')
      .lean();

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }
    return booking;
  }

  static async updateBookingStatus(id, newStatus, note = '') {
    const booking = await Booking.findById(id);
    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    const oldStatus = booking.status;
    booking.status = newStatus;
    booking.timeline.push({
      status: newStatus,
      timestamp: new Date(),
      note: note || `Status updated from ${oldStatus} to ${newStatus}`,
    });

    if (newStatus === 'completed') {
      booking.paymentStatus = 'paid';
      if (booking.cleaner) {
        await Cleaner.findByIdAndUpdate(booking.cleaner, {
          $inc: { completedJobs: 1, activeBookingsCount: -1 },
          status: 'available',
        });
      }
    } else if (newStatus === 'cancelled') {
      if (booking.cleaner) {
        await Cleaner.findByIdAndUpdate(booking.cleaner, {
          $inc: { activeBookingsCount: -1 },
          status: 'available',
        });
      }
    }

    await booking.save();
    return booking;
  }

  static async assignCleaner(bookingId, cleanerId) {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    const cleaner = await Cleaner.findById(cleanerId);
    if (!cleaner) {
      throw new ApiError(404, 'Cleaner not found');
    }

    // Decrement previous cleaner active bookings if any
    if (booking.cleaner && booking.cleaner.toString() !== cleanerId) {
      await Cleaner.findByIdAndUpdate(booking.cleaner, {
        $inc: { activeBookingsCount: -1 },
      });
    }

    booking.cleaner = cleanerId;
    booking.status = 'assigned';
    booking.timeline.push({
      status: 'assigned',
      timestamp: new Date(),
      note: `Cleaner '${cleaner.name}' assigned to booking`,
    });

    await booking.save();

    await Cleaner.findByIdAndUpdate(cleanerId, {
      $inc: { activeBookingsCount: 1 },
      status: 'on_job',
    });

    return booking;
  }

  static async deleteBooking(id) {
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    // Decrement customer totalBookings
    if (booking.customer) {
      await Customer.findByIdAndUpdate(booking.customer, {
        $inc: { totalBookings: -1 },
      });
    }

    // Decrement cleaner activeBookingsCount if assigned and not completed/cancelled
    if (booking.cleaner && !['completed', 'cancelled'].includes(booking.status)) {
      await Cleaner.findByIdAndUpdate(booking.cleaner, {
        $inc: { activeBookingsCount: -1 },
      });
    }

    return true;
  }
}
