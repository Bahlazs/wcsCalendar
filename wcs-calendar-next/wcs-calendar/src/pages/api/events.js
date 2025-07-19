// pages/api/events.js
import { google } from 'googleapis';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Egyszerű memóriacache - ez *újraindításkor* elveszik, de Vercelen pl. jól működik
let cachedData = null;
let lastFetchTime = 0;
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 perc

dayjs.extend(utc);
dayjs.extend(timezone)
const now = dayjs()

async function fetchEventsFromGoogle() {
  const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, CALENDAR_IDS } = process.env;
  if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !CALENDAR_IDS) {
    throw new Error('Hiányzó környezeti változók');
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



  const timeMin = now.subtract(6, 'month').toISOString();
  const timeMax = now.add(6, 'month').toISOString();


  let allEvents = [];
  let innerID = 0;

 for (const calendarId of calendarIds) {
  let pageToken = null;

  do {
    try {
      const response = await calendar.events.list({
        calendarId,
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 500,
        pageToken,
      });

      const events = (response.data.items || []).map(event => ({
        id: innerID,
        title: event.summary || 'event',
        start: event.start?.dateTime || event.start?.date,
        end: event.end?.dateTime || event.end?.date,
        type: event.description || 'wcs event',
        location: event.location || ' - ',
      }));

      allEvents.push(...events);
      pageToken = response.data.nextPageToken; // <-- következő lap

    } catch (innerError) {
      console.error(`Nem sikerült lekérni a naptárat: ${calendarId}`, innerError);
      break; // Ha hiba van, kilépünk az adott naptárból
    }
  } while (pageToken); // Addig ismételjük, amíg van következő oldal

  innerID++;
}

  return allEvents;
}

export default async function handler(req, res) {
  try {

    if (cachedData && (now - lastFetchTime) < CACHE_DURATION_MS) {
      console.log('Serving cached events');
      return res.status(200).json(cachedData);
    }

    console.log('Fetching fresh events from Google Calendar');
    const freshData = await fetchEventsFromGoogle();

    // Frissítjük a cache-t
    cachedData = freshData;
    lastFetchTime = now;

    res.status(200).json(freshData);
    console.log('events fetched')
  } catch (error) {
    console.error('API hiba:', error);
    res.status(500).json({ error: 'Események lekérése sikertelen.' });
  }
}

