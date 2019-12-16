import { SleepHistroy } from "./domain";
import { DateTime } from "luxon";

/**
 * Fecth sleep logs from Google Calendar (Gray "Sleep" events) within last 2 days
 * @param gapi
 * @return [wakeupUnixTime, sleepLengthUnixTime]
 */
export async function fetchSleeps(gapi: any): Promise<SleepHistroy> {
  const now = DateTime.local();
  //@ts-ignore
  const response: gapi.client.Response<gapi.client.calendar.Events> = await gapi.client.calendar.events.list(
    {
      calendarId: "primary",
      alwaysIncludeEmail: false,
      maxResults: 100,
      orderBy: "startTime",
      showDeleted: false,
      singleEvents: true,
      timeMin: now.minus({ days: 2 }).toISO(),
      timeMax: now.toISO()
    }
  );
  const events = response.result.items as gapi.client.calendar.Event[];
  const sleeps = events
    .filter(evt => evt.colorId !== undefined && evt.colorId === "8")
    .filter(evt => evt.summary === "Sleep" || evt.summary === "sleep")
    .map(evt => {
      const inSleepMills = DateTime.fromISO(
        evt.start?.dateTime as string
      ).toMillis();
      const wakeupMills = DateTime.fromISO(
        evt.end?.dateTime as string
      ).toMillis();
      // [wakeupUNIX, sleepLengthUnix]
      return [wakeupMills, wakeupMills - inSleepMills] as [number, number];
    });
  console.log(sleeps);
  return sleeps;
}
