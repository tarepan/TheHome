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
  const x_hour = 2;
  const latestxh = events.filter(
    evt => new Date(evt.start.dateTime) - new Date() < x_hour * 60 * 60 * 1000
  );
  const filtered_evts = latestxh.map(evt => evt.summary);
  const latest_evts = filtered_evts.length ? filtered_evts : ["No event"];
  console.log(latest_evts);
  console.log(`length: ${latest_evts.length}`);
  // const when = event.start.dateTime ? event.start.dateTime:event.start.date;
  render(
    html`
      <section id="calender">
        <ul>
          ${latest_evts.map(
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
