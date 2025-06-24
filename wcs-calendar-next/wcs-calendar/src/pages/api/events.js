import { google } from 'googleapis';
import dayjs from 'dayjs';

export default async function handler(req, res) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    const authClient = await auth.getClient();
    const calendar = google.calendar({ version: 'v3', auth: authClient });

    const timeMin = dayjs().startOf('month').toISOString();
    const timeMax = dayjs().endOf('month').toISOString();

    const response = await calendar.events.list({
      calendarId: process.env.CALENDAR_ID,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items.map(event => ({
      title: event.summary,
      start: event.start.dateTime || event.start.date,
      type: event.description || 'Minden',
    }));

    res.status(200).json(events);
  } catch (error) {
    console.error('API hiba:', error);
    res.status(500).json({ error: 'Események lekérése sikertelen.' });
  }
}
