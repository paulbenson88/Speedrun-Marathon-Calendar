/**
 * commentators.js — Manages commentator assignments for speedrun events.
 *
 * Stores data in localStorage so it persists across sessions.
 * Each event (keyed by name) has an array of commentator objects:
 *   { name: string, status: "not-asked"|"asked"|"confirmed"|"declined" }
 */

// eslint-disable-next-line no-unused-vars
const CommentatorManager = (function () {
  "use strict";

  const STORAGE_KEY = "speedrun-commentators";

  const STATUSES = {
    "not-asked": { label: "Not Asked", icon: "⬜", className: "status-not-asked" },
    asked:       { label: "Asked",     icon: "📨", className: "status-asked" },
    confirmed:   { label: "Confirmed", icon: "✅", className: "status-confirmed" },
    declined:    { label: "Declined",  icon: "❌", className: "status-declined" },
  };

  /** Load all commentator data from localStorage. */
  function loadAll() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  /** Save all commentator data to localStorage. */
  function saveAll(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  /** Get commentators for a specific event. */
  function getForEvent(eventName) {
    const data = loadAll();
    return data[eventName] || [];
  }

  /** Add a commentator to an event. */
  function add(eventName, commentatorName) {
    const data = loadAll();
    if (!data[eventName]) data[eventName] = [];
    // Avoid duplicates (case-insensitive)
    const exists = data[eventName].some(
      (c) => c.name.toLowerCase() === commentatorName.trim().toLowerCase()
    );
    if (exists) return false;
    data[eventName].push({ name: commentatorName.trim(), status: "not-asked" });
    saveAll(data);
    return true;
  }

  /** Remove a commentator from an event. */
  function remove(eventName, commentatorName) {
    const data = loadAll();
    if (!data[eventName]) return;
    data[eventName] = data[eventName].filter(
      (c) => c.name.toLowerCase() !== commentatorName.toLowerCase()
    );
    saveAll(data);
  }

  /** Update a commentator's status for an event. */
  function setStatus(eventName, commentatorName, newStatus) {
    if (!STATUSES[newStatus]) return;
    const data = loadAll();
    if (!data[eventName]) return;
    const entry = data[eventName].find(
      (c) => c.name.toLowerCase() === commentatorName.toLowerCase()
    );
    if (entry) {
      entry.status = newStatus;
      saveAll(data);
    }
  }

  /** Get a summary across all events for reporting. */
  function getSummary() {
    const data = loadAll();
    const summary = [];
    for (const [eventName, commentators] of Object.entries(data)) {
      if (commentators.length === 0) continue;
      summary.push({
        event: eventName,
        total: commentators.length,
        confirmed: commentators.filter((c) => c.status === "confirmed").length,
        asked: commentators.filter((c) => c.status === "asked").length,
        declined: commentators.filter((c) => c.status === "declined").length,
        notAsked: commentators.filter((c) => c.status === "not-asked").length,
      });
    }
    return summary;
  }

  return { STATUSES, getForEvent, add, remove, setStatus, getSummary };
})();
