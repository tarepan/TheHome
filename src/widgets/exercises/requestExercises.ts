import { DateTime as dt } from "luxon";
import { ExerciseHistroy } from "./domain";

/**
 * Fecth sleep logs from Google Calendar (Gray "Sleep" events) within last 2 days
 * @param gapi
 * @return [wakeupUnixTime, sleepLengthUnixTime]
 */
export async function fetchExercises(gapi: any): Promise<ExerciseHistroy> {
  const now = dt.local();
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
  const execises = events
    .filter(evt => evt.colorId !== undefined && evt.colorId === "2")
    .filter(
      evt =>
        /適度に使われた体力（運動）/.test(evt.summary ?? "") ||
        /\[HealthHub-運動\]/.test(evt.description ?? "")
    )
    .map<[number, number]>(evt => {
      const startUNIXtime = dt
        .fromISO(evt.start?.dateTime ?? "1970-01-01T00:00Z")
        .toMillis();
      const endUNIXtime = dt
        .fromISO(evt.end?.dateTime ?? "1970-01-01T00:00Z")
        .toMillis();
      const lengthMin = (endUNIXtime - startUNIXtime) / (1000 * 60);
      return [startUNIXtime, lengthMin];
    });
  console.log(execises);
  return execises;
}
