import { sendEmail } from '../config/mailer.js';
import { env } from '../config/env.js';
export class EmailService {
  /**
   * Generates the HTML template for a new booking confirmation.
   * @param {Object} booking - The populated booking object.
   * @returns {string} - The generated HTML string.
   */
  static generateBookingTemplate(booking) {
    const customerName = booking.customer?.name || 'Customer';
    const customerEmail = booking.customerEmail || booking.customer?.email || '';
    const customerPhone = booking.customerPhone || booking.customer?.phone || 'N/A';
    const serviceName = booking.service?.name || 'Service';
    const address = booking.address || booking.pickupLocation || 'N/A';
    const variantName = booking.variantName || 'N/A';

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; color: #000;">
        <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 20px; color: #000;">New Booking Details</h1>
        
        <p style="margin: 8px 0; font-size: 16px;"><strong>Order ID:</strong> ${booking.bookingRef}</p>
        <p style="margin: 8px 0; font-size: 16px;"><strong>Name:</strong> ${customerName}</p>
        <p style="margin: 8px 0; font-size: 16px;"><strong>Email:</strong> <a href="mailto:${customerEmail}" style="color: #0066cc;">${customerEmail || 'N/A'}</a></p>
        <p style="margin: 8px 0; font-size: 16px;"><strong>Contact:</strong> ${customerPhone}</p>
        <p style="margin: 8px 0; font-size: 16px;"><strong>Address:</strong> ${address}</p>
        <p style="margin: 8px 0; font-size: 16px;"><strong>Coupon:</strong> ${booking.couponCode || 'None'}</p>
        
        <h3 style="font-size: 18px; font-weight: 800; margin-top: 24px; margin-bottom: 8px; color: #000;">Booking Details:</h3>
        <p style="margin: 8px 0; font-size: 16px;">Frequency : ${booking.frequency || 'One Time'}</p>
        <p style="margin: 8px 0; font-size: 16px;">Service : ${serviceName}</p>
        <p style="margin: 8px 0; font-size: 16px;">Service Details : ${variantName}</p>
        <p style="margin: 8px 0; font-size: 16px;">Duration : ${booking.hours ? booking.hours + ' hour(s)' : 'N/A'}</p>
      </div>
    `;
  }

  /**
   * Sends booking confirmation emails to admin and customer.
   * @param {Object} booking - The populated booking object.
   */
  static async sendBookingConfirmationEmails(booking) {
    if (!booking) return;

    const htmlContent = this.generateBookingTemplate(booking);
    const customerEmail = booking.customerEmail || booking.customer?.email || '';

    // 1. Send to Admin
    try {
      await sendEmail({
        to: env.ADMIN_EMAIL || 'maidslifeuae@gmail.com',
        subject: `New Booking: ${booking.bookingRef}`,
        html: htmlContent,
      });
    } catch (err) {
      console.error('Failed to send admin booking email:', err);
    }

    // 2. Send to Customer
    if (customerEmail && customerEmail.includes('@')) {
      try {
        await sendEmail({
          to: customerEmail,
          subject: `Your Booking Confirmation - ${booking.bookingRef}`,
          html: htmlContent,
        });
      } catch (err) {
        console.error('Failed to send customer booking email:', err);
      }
    }
  }
}
