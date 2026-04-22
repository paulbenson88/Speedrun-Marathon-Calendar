/**
 * calendar.js — Renders a monthly calendar and upcoming-events list.
 * All UTC event times are displayed in the viewer's local timezone.
 */

(function () {
  "use strict";

  /* ── Helpers ──────────────────────────────────────── */

  const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

  /** Format a Date to a human-friendly local string. */
  function fmtDate(date) {
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function fmtTime(date) {
    return date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function fmtShortDate(date) {
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  /** Return "YYYY-MM-DD" in local time for a Date. */
  function dateKey(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  /** Check if two local dates are the same calendar day. */
  function sameDay(a, b) {
    return dateKey(a) === dateKey(b);
  }

  /* ── Parse Events ─────────────────────────────────── */

  /** Build a Map<"YYYY-MM-DD", Event[]> keyed by every local day the event spans. */
  function buildEventMap(events) {
    const map = new Map();
    for (const ev of events) {
      const start = new Date(ev.start);
      const end = new Date(ev.end);
      const cursor = new Date(start);
      cursor.setHours(0, 0, 0, 0);
      while (cursor <= end) {
        const key = dateKey(cursor);
        if (!map.has(key)) map.set(key, []);
        map.get(key).push({ ...ev, _start: start, _end: end });
        cursor.setDate(cursor.getDate() + 1);
      }
    }
    return map;
  }

  const eventMap = buildEventMap(MARATHON_EVENTS);

  /* ── DOM References ───────────────────────────────── */
  const grid = document.getElementById("calendar-grid");
  const monthTitle = document.getElementById("month-title");
  const prevBtn = document.getElementById("prev-month");
  const nextBtn = document.getElementById("next-month");
  const detailSection = document.getElementById("event-details");
  const detailDate = document.getElementById("detail-date");
  const detailList = document.getElementById("detail-list");
  const upcomingList = document.getElementById("upcoming-list");
  const tzLabel = document.getElementById("tz-label");

  /* ── State ────────────────────────────────────────── */
  const today = new Date();
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth(); // 0-indexed

  /* ── Render Calendar ──────────────────────────────── */

  function renderMonth() {
    // Clear old day cells (keep the 7 header divs)
    const headers = grid.querySelectorAll(".day-header");
    grid.innerHTML = "";
    headers.forEach((h) => grid.appendChild(h));

    const monthNames = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December",
    ];
    monthTitle.textContent = `${monthNames[viewMonth]} ${viewYear}`;

    const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    // Leading empties
    for (let i = 0; i < firstDay; i++) {
      const cell = document.createElement("div");
      cell.className = "day-cell empty";
      grid.appendChild(cell);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const cellDate = new Date(viewYear, viewMonth, d);
      const key = dateKey(cellDate);
      const events = eventMap.get(key) || [];

      const cell = document.createElement("div");
      cell.className = "day-cell";
      if (sameDay(cellDate, today)) cell.classList.add("today");
      if (events.length) cell.classList.add("has-event");

      const num = document.createElement("span");
      num.className = "day-number";
      num.textContent = d;
      cell.appendChild(num);

      // Show up to 2 event labels
      events.slice(0, 2).forEach((ev) => {
        const lbl = document.createElement("span");
        lbl.className = "event-label";
        lbl.innerHTML = `<span class="event-dot"></span>${ev.name}`;
        cell.appendChild(lbl);
      });
      if (events.length > 2) {
        const more = document.createElement("span");
        more.className = "event-label";
        more.textContent = `+${events.length - 2} more`;
        cell.appendChild(more);
      }

      // Click to show details
      if (events.length) {
        cell.addEventListener("click", () => showDetails(cellDate, events));
      }

      grid.appendChild(cell);
    }
  }

  /* ── Show Detail Panel ────────────────────────────── */

  function showDetails(date, events) {
    detailDate.textContent = fmtDate(date);
    detailList.innerHTML = "";
    for (const ev of events) {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="event-name">${ev.name}</span>
        <span class="event-time">${fmtShortDate(ev._start)} ${fmtTime(ev._start)} &mdash; ${fmtShortDate(ev._end)} ${fmtTime(ev._end)}</span>
        <span class="event-desc">${ev.description}</span>
      `;
      detailList.appendChild(li);
    }
    detailSection.classList.remove("hidden");
    detailSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /* ── Upcoming List ────────────────────────────────── */

  function renderUpcoming() {
    const now = new Date();
    const upcoming = MARATHON_EVENTS
      .filter((ev) => new Date(ev.end) >= now)
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .slice(0, 6);

    upcomingList.innerHTML = "";
    if (upcoming.length === 0) {
      upcomingList.innerHTML = "<li>No upcoming marathons — check back later!</li>";
      return;
    }

    for (const ev of upcoming) {
      const start = new Date(ev.start);
      const end = new Date(ev.end);
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="event-name">${ev.name}</span>
        <span class="event-date">${fmtShortDate(start)} &mdash; ${fmtShortDate(end)}</span>
        <span class="event-time">${fmtTime(start)} &ndash; ${fmtTime(end)}</span>
        <span class="event-desc">${ev.description}</span>
      `;
      upcomingList.appendChild(li);
    }
  }

  /* ── Navigation ───────────────────────────────────── */

  prevBtn.addEventListener("click", () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    detailSection.classList.add("hidden");
    renderMonth();
  });

  nextBtn.addEventListener("click", () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    detailSection.classList.add("hidden");
    renderMonth();
  });

  /* ── Init ─────────────────────────────────────────── */
  tzLabel.textContent = userTZ.replace(/_/g, " ");
  renderMonth();
  renderUpcoming();
})();
