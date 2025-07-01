// pages/api/events.js
import { google } from 'googleapis';
import dayjs from 'dayjs';

export default async function handler(req, res) {
  try {
    const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, CALENDAR_IDS } = process.env;
    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !CALENDAR_IDS) {
      console.error('Hiányzó környezeti változók');
      return res.status(500).json({ error: 'Szerver konfigurációs hiba' });
    }

    const calendarIds = CALENDAR_IDS.split(',').map(id => id.trim());

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_CLIENT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY,
      },
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    const authClient = await auth.getClient();
    const calendar = google.calendar({ version: 'v3', auth: authClient });

    const now = dayjs();
    const timeMin = now.startOf('year').toISOString();
    const timeMax = now.endOf('year').toISOString();

    let allEvents = [];
    let innerID = 0

    for (const calendarId of calendarIds) {
      try {
        const response = await calendar.events.list({
          calendarId,
          timeMin,
          timeMax,
          singleEvents: true,
          orderBy: 'startTime',
        });

        const events = (response.data.items || []).map(event => ({
          id: innerID,
          title: event.summary || 'event',
          start: event.start?.dateTime || event.start?.date,
          end: event.end?.dateTime || event.end?.date,
          type: event.description || 'wcs event',
        }));

        allEvents.push(...events);
        innerID++
      } catch (innerError) {
        console.error(`Nem sikerült lekérni a naptárat: ${calendarId}`, innerError);
      }
    }
    
    res.status(200).json(allEvents);
  } catch (error) {
    console.error('API hiba:', error);
    res.status(500).json({ error: 'Események lekérése sikertelen.' });
  }
}
