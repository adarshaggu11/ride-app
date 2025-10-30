import twilio from 'twilio';

let client = null;

export function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) {
    throw new Error('Twilio credentials missing. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN');
  }
  if (!client) {
    client = twilio(sid, token);
  }
  return client;
}

export async function sendSMS({ to, from, body }) {
  const cli = getTwilioClient();
  if (!from) {
    from = process.env.TWILIO_PHONE_NUMBER || '';
  }
  if (!from) {
    throw new Error('TWILIO_PHONE_NUMBER missing. Set it in backend/.env');
  }
  const msg = await cli.messages.create({ to, from, body });
  return msg;
}
