import { Booking } from '../bookings/booking.model.js';
import { Cleaner } from '../cleaners/cleaner.model.js';
import { Customer } from '../customers/customer.model.js';

export class ReportsService {
  static async getOverview() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [
      totalBookingsCount,
      todayBookingsCount,
      monthlyRevenueAgg,
      activeCleanersCount,
      totalCustomersCount,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ createdAt: { $gte: todayStart } }),
      Booking.aggregate([
        { $match: { createdAt: { $gte: monthStart }, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, totalRevenue: { $sum: '$amount' } } },
      ]),
      Cleaner.countDocuments({ status: 'on_job' }),
      Customer.countDocuments({ status: 'active' }),
    ]);

    const monthlyRevenue = monthlyRevenueAgg[0]?.totalRevenue || 0;

    return {
      totalBookings: totalBookingsCount,
      todayBookings: todayBookingsCount,
      monthlyRevenue,
      activeCleanersOnJob: activeCleanersCount,
      totalCustomers: totalCustomersCount,
    };
  }

  static async getRevenueStats(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const dailyRevenue = await Booking.aggregate([
      {
        $match: {
          scheduledAt: { $gte: startDate },
          status: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$scheduledAt' } },
          totalRevenue: { $sum: '$amount' },
          totalBookings: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return dailyRevenue;
  }

  static async getRevenueByService() {
    return Booking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceDetail',
        },
      },
      { $unwind: '$serviceDetail' },
      {
        $group: {
          _id: '$serviceDetail.name',
          totalRevenue: { $sum: '$amount' },
          totalBookings: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);
  }

  static async getRevenueByArea() {
    return Booking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: '$area',
          totalRevenue: { $sum: '$amount' },
          totalBookings: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);
  }

  static async getCleanerPerformance() {
    return Cleaner.find()
      .select('name phone avatarUrl emirate rating completedJobs activeBookingsCount status')
      .sort({ completedJobs: -1 })
      .lean();
  }
}
