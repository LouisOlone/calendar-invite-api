export default function handler(req, res) {
  try {
    const { site = '', role = '', band = '', start = '', end = '' } = req.query;

    if (!site || !role || !band || !start || !end) {
      return res.status(400).json({ error: 'Missing one or more query parameters: site, role, band, start, end' });
    }

    const summary = `Shift at: ${site} ${band} ${role}`;
    const uid = `${Date.now()}-${Math.floor(Math.random() * 10000)}@spectrum.com`;

    const cleanSite = site.replace(/ /g, '_');
    const locationUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanSite)}`;

    // Use current time as DTSTAMP in ICS format YYYYMMDDTHHmmssZ
    const dtstamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    // Make sure start/end have no 'Z' at the end (assumed UTC in input)
    const dtstart = start.endsWith('Z') ? start.slice(0, -1) : start;
    const dtend = end.endsWith('Z') ? end.slice(0, -1) : end;

    const ics = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SpectrumBank//EN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
DTSTART:${dtstart}Z
DTEND:${dtend}Z
SUMMARY:${summary}
DESCRIPTION:You’ve been accepted onto this shift.
LOCATION:${locationUrl}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`.trim();

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=shift_${cleanSite}.ics`);
    res.status(200).send(ics);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
