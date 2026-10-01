export interface SMSRequest {
  to: string;
  message: string;
  type: 'booking_confirmation' | 'flight_alert' | 'itinerary_change' | 'otp' | 'promotional';
}

export interface SMSProvider {
  name: string;
  send(req: SMSRequest): Promise<{ success: boolean; messageId: string }>;
}

class MockSMSProvider implements SMSProvider {
  name = 'MockSMS';

  async send(req: SMSRequest): Promise<{ success: boolean; messageId: string }> {
    await new Promise((r) => setTimeout(r, 200));
    console.log(`[SMS] To: ${req.to} | Type: ${req.type} | Message: ${req.message.substring(0, 50)}...`);
    return { success: true, messageId: `MSG-${Date.now()}` };
  }
}

export const smsService: SMSProvider = new MockSMSProvider();

export function buildBookingConfirmationSMS(bookingRef: string, customerName: string): string {
  return `Dear ${customerName}, your booking ${bookingRef} has been confirmed. For support, call 01790678917. - Arshi Travels`;
}

export function buildFlightAlertSMS(flightNumber: string, status: string): string {
  return `Flight ${flightNumber} status update: ${status}. For details, call 01790678917. - Arshi Travels`;
}
