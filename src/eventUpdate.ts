import { html, render } from "lit-html";

async function listUpcomingEvents(): Promise<void> {
  const response: gapi.client.Response<
    gapi.client.calendar.Events
    //@ts-ignore
  > = await gapi.client.calendar.events.list({
    // const response = await gapi.client.events.list({ // properly typed, but not work in browser (wrong .d.ts?)
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    showDeleted: false,
    singleEvents: true,
    maxResults: 10,
    orderBy: "startTime"
  });
  const events = response.result.items as gapi.client.calendar.Event[];
  const xHour = 2;
  const latestxh = events.filter(evt => {
    if (evt.start && evt.start.dateTime) {
      return (
        new Date(evt.start.dateTime).getTime() - Date.now() <
        xHour * 60 * 60 * 1000
      );
    } else {
      return false;
    }
  });
  const filteredEvts = latestxh.map(evt => evt.summary);
  const latestEvts = filteredEvts.length ? filteredEvts : ["No event"];
  render(
    html`
      <section id="calender">
        <ul>
          ${latestEvts.map(
            (evt: string) =>
              html`
                <li>${evt}</li>
              `
          )}
        </ul>
      </section>
    `,
    document.body.querySelector("#cal_ph") as Element
  );
}
window.setTimeout(listUpcomingEvents, 10000);
window.setInterval(listUpcomingEvents, 3 * 60 * 1000);
