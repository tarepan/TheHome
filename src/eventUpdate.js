import { html, render } from "lit-html";

async function listUpcomingEvents() {
  const response = await gapi.client.calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    showDeleted: false,
    singleEvents: true,
    maxResults: 10,
    orderBy: "startTime"
  });
  const events = response.result.items;
  const xHour = 2;
  const latestxh = events.filter(
    evt => new Date(evt.start.dateTime) - new Date() < xHour * 60 * 60 * 1000
  );
  const filteredEvts = latestxh.map(evt => evt.summary);
  const latestEvts = filteredEvts.length ? filteredEvts : ["No event"];
  console.log(latestEvts);
  console.log(`length: ${latestEvts.length}`);
  // const when = event.start.dateTime ? event.start.dateTime:event.start.date;
  render(
    html`
      <section id="calender">
        <ul>
          ${latestEvts.map(
            evt =>
              html`
                <li>${evt}</li>
              `
          )}
        </ul>
      </section>
    `,
    document.body.querySelector("#cal_ph")
  );
}
window.setTimeout(listUpcomingEvents, 10000);
window.setInterval(listUpcomingEvents, 3 * 60 * 1000);
