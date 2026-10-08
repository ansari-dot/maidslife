import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { BookingService } from './booking.service.js';
import { EmailService } from '../../utils/email.service.js';

export const createBooking = asyncHandler(async (req, res) => {
  const { booking, paymentUrl } = await BookingService.createBooking(req.body);

  try {
    const fullBooking = await BookingService.getBookingById(booking._id);
    await EmailService.sendBookingConfirmationEmails(fullBooking);
  } catch (err) {
    console.error('Failed to send booking emails:', err);
  }

  // Custom response to include paymentUrl outside or inside data
  return res.status(201).json({
    statusCode: 201,
    success: true,
    data: booking,
    paymentUrl,
    message: 'Booking created successfully'
  });
});

export const getBookings = asyncHandler(async (req, res) => {
  const { bookings, meta } = await BookingService.getAllBookings(req.query);
  return res.status(200).json(new ApiResponse(200, bookings, 'Bookings retrieved successfully', meta));
});

export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await BookingService.getBookingById(req.params.id);
  return res.status(200).json(new ApiResponse(200, booking, 'Booking retrieved successfully'));
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const booking = await BookingService.updateBookingStatus(req.params.id, status, note);
  return res.status(200).json(new ApiResponse(200, booking, `Booking status updated to ${status}`));
});

export const assignCleaner = asyncHandler(async (req, res) => {
  const booking = await BookingService.assignCleaner(req.params.id, req.body.cleanerId);
  return res.status(200).json(new ApiResponse(200, booking, 'Cleaner assigned successfully'));
});

export const handleZiinaWebhook = asyncHandler(async (req, res) => {
  console.log('Ziina Webhook Received:', req.body);
  await BookingService.processZiinaWebhook(req.body);
  return res.status(200).send('OK');
});

export const deleteBooking = asyncHandler(async (req, res) => {
  await BookingService.deleteBooking(req.params.id);
  return res.status(200).json(new ApiResponse(200, {}, 'Booking deleted successfully'));
});
