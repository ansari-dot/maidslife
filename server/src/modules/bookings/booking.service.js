import mongoose from 'mongoose';
import { Booking } from './booking.model.js';
import { Customer } from '../customers/customer.model.js';
import { Cleaner } from '../cleaners/cleaner.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { getPaginationOptions, getPaginationMeta } from '../../utils/pagination.js';

import { Coupon } from '../coupons/coupon.model.js';

import { Service } from '../services/service.model.js';
import { getDefaultBookingFields } from '../services/service.service.js';

export class BookingService {
  static async createBooking(data) {
    const bookingRef = `ML-${Math.floor(1000 + Math.random() * 9000)}`;

    let session = null;
    try {
      session = await mongoose.startSession();
      session.startTransaction();
    } catch (err) {
      session = null;
    }

    const runOperations = async (sess) => {
      const opts = sess ? { session: sess } : {};

      // Validate Service configuration fields
      const serviceQuery = Service.findById(data.service);
      if (sess) serviceQuery.session(sess);
      const serviceDoc = await serviceQuery;
      if (!serviceDoc) {
        throw new ApiError(404, 'Service not found');
      }

      const activeBookingFields = (serviceDoc.bookingFields && serviceDoc.bookingFields.length > 0)
        ? serviceDoc.bookingFields
        : getDefaultBookingFields(serviceDoc.bookingType);

      for (const field of activeBookingFields) {
        if (field.enabled && field.required) {
          let value;
          switch (field.key) {
            case 'variant': value = data.variantId || data.variantName || (data.variants && data.variants.length > 0); break;
            case 'duration': value = data.hours; break;
            case 'extraHours': value = data.extraHours; break;
            case 'professionals': value = data.professionalsCount; break;
            case 'cleaningMaterials': value = data.needCleaningMaterials; break;
            case 'frequency': value = data.frequency; break;
            case 'specialInstructions': value = data.specialInstructions; break;
            case 'quantity': value = data.quantity; break;
            case 'weight': value = data.weight; break;
            case 'itemType': value = data.itemType; break;
            case 'pickupLocation': value = data.pickupLocation; break;
            case 'dropoffLocation': value = data.dropoffLocation; break;
            case 'vehicleType': value = data.vehicleType; break;
            case 'driver': value = data.driver || data.cleaner; break;
            case 'propertyType': value = data.propertyType; break;
            case 'bedrooms': value = data.bedrooms; break;
            case 'bathrooms': value = data.bathrooms; break;
            case 'date':
            case 'time': value = data.scheduledAt; break;
            case 'address': value = data.address || data.pickupLocation; break;
            case 'addons': value = true; break;
            default: break;
          }
          if (value === undefined || value === null || value === '' || value === false) {
            throw new ApiError(400, `Field '${field.label || field.key}' is required for this service`);
          }
        }
      }

      // Format multi-variant array and summary string if variants provided
      let formattedVariants = [];
      if (Array.isArray(data.variants) && data.variants.length > 0) {
        formattedVariants = data.variants.map((v) => ({
          variantId: v.variantId || v.id || undefined,
          name: v.name || '',
          quantity: v.quantity || 1,
          price: v.price || 0,
        }));
        if (!data.variantName) {
          data.variantName = formattedVariants.map((v) => `${v.name} (x${v.quantity})`).join(', ');
        }
        if (!data.variantId && formattedVariants[0]?.variantId) {
          data.variantId = formattedVariants[0].variantId;
        }
      }

      // Default safe fallbacks for area & address if not explicitly passed
      data.area = data.area || 'Dubai';
      data.address = data.address || data.pickupLocation || 'Dubai';

      // Handle customer auto-creation/lookup
      let customerId = data.customer;
      let customerObj = null;

      if (customerId) {
        const query = Customer.findById(customerId);
        if (sess) query.session(sess);
        customerObj = await query;
      }

      if (!customerId && (data.customerPhone || data.customerEmail)) {
        let query;
        if (data.customerPhone) {
          query = Customer.findOne({ phone: data.customerPhone });
        } else if (data.customerEmail) {
          query = Customer.findOne({ email: data.customerEmail });
        }
        
        if (query) {
          if (sess) query.session(sess);
          customerObj = await query;
        }

        if (!customerObj) {
          const createdCustomers = await Customer.create([{
            name: data.customerName || 'Guest Customer',
            phone: data.customerPhone || undefined,
            email: data.customerEmail || undefined,
          }], opts);
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
          { new: true, ...opts }
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
        variants: formattedVariants.length > 0 ? formattedVariants : data.variants,
        customer: customerId,
        bookingRef,
        status: data.cleaner ? 'assigned' : 'pending_assignment',
        timeline: initialTimeline,
      }], opts);
      const booking = createdBookings[0];

      // Update customer totalBookings & lastBookingAt
      await Customer.findByIdAndUpdate(customerId, {
        $inc: { totalBookings: 1 },
        lastBookingAt: new Date(),
      }, opts);

      // If assigned cleaner, update cleaner activeBookingsCount
      if (data.cleaner) {
        await Cleaner.findByIdAndUpdate(data.cleaner, {
          $inc: { activeBookingsCount: 1 },
        }, opts);
      }

      return booking;
    };

    if (session) {
      try {
        const booking = await runOperations(session);
        await session.commitTransaction();
        session.endSession();
        return { booking };
      } catch (err) {
        try {
          await session.abortTransaction();
          session.endSession();
        } catch (_) {}

        if (err.message && (err.message.includes('Transaction numbers are only allowed') || err.message.includes('replica set'))) {
          const booking = await runOperations(null);
          return { booking };
        }
        throw err;
      }
    } else {
      const booking = await runOperations(null);
      return { booking };
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
