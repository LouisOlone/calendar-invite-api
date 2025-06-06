export default function handler(req, res) {
  const { site = '', role = '', band = '', start = '', end = '' } = req.query;

  const summary = `Shift at: ${site} ${band} ${role}`;
  const uid = `${Date.now()}-${Math.floor(Math.random() * 10000)}@spectrum.com`;

  const cleanSite = site.replace(/ /g, '_');
  const locationUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanSite)}`;

  // Expect start/end in YYYYMMDDTHHmmss format (e.g., 20250610T090000)
  const dtstamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const ics = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SpectrumBank//EN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
DTSTART:${start}Z
DTEND:${end}Z
SUMMARY:${summary}
DESCRIPTION:You’ve been accepted onto this shift.
LOCATION:${locationUrl}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`.trim();

  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', \`attachment; filename=shift_\${cleanSite}.ics\`);
  res.status(200).send(ics);
}
