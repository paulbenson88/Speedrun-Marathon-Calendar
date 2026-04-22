/**
 * events.js — Speedrun marathon event data.
 *
 * Each event stores its start/end in UTC via ISO-8601 strings.
 * The calendar JS converts them to the viewer's local timezone
 * automatically using the Intl API.
 *
 * To add / edit events, just update this array.
 */

// eslint-disable-next-line no-unused-vars
const MARATHON_EVENTS = [
  {
    name: "Awesome Games Done Quick 2026",
    start: "2026-01-04T16:30:00Z",
    end: "2026-01-11T04:00:00Z",
    description: "Week-long charity speedrun marathon benefiting the Prevent Cancer Foundation.",
  },
  {
    name: "European Speedrunner Assembly 2026",
    start: "2026-02-15T12:00:00Z",
    end: "2026-02-22T22:00:00Z",
    description: "Europe's biggest speedrunning marathon, raising money for charity.",
  },
  {
    name: "Flame Fatales 2026",
    start: "2026-03-15T17:00:00Z",
    end: "2026-03-22T03:00:00Z",
    description: "All-women & non-binary speedrun marathon presented by GDQ.",
  },
  {
    name: "Summer Games Done Quick 2026",
    start: "2026-06-28T16:30:00Z",
    end: "2026-07-05T04:00:00Z",
    description: "Annual summer charity marathon benefiting Doctors Without Borders.",
  },
  {
    name: "RPG Limit Break 2026",
    start: "2026-05-10T15:00:00Z",
    end: "2026-05-17T03:00:00Z",
    description: "Marathon dedicated to RPG speedruns, raising money for NAMI.",
  },
  {
    name: "GDQ Hotfix — March",
    start: "2026-03-28T18:00:00Z",
    end: "2026-03-28T23:00:00Z",
    description: "One-day online speedrun showcase by GDQ.",
  },
  {
    name: "Questing for Glory 2026",
    start: "2026-04-20T14:00:00Z",
    end: "2026-04-27T02:00:00Z",
    description: "Community marathon supporting Direct Relief.",
  },
  {
    name: "Speedrun Marathon Online — Fall 2026",
    start: "2026-09-12T16:00:00Z",
    end: "2026-09-14T04:00:00Z",
    description: "48-hour online marathon featuring viewer-voted games.",
  },
  {
    name: "Awesome Games Done Quick 2027",
    start: "2027-01-05T16:30:00Z",
    end: "2027-01-12T04:00:00Z",
    description: "The next annual winter AGDQ event.",
  },
];
