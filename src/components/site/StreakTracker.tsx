'use client';

import { useEffect } from 'react';

/**
 * Silent client component that records today's visit date in localStorage.
 * Mounted in root layout so any page view counts toward the cooking streak
 * surface on /account dashboard.
 *
 * Storage shape: rc:recent-dates = string[] of "YYYY-MM-DD" ISO dates,
 * deduped, sorted desc, capped at 30 most recent.
 *
 * Streak calculation is done by the dashboard, not this component — this
 * is purely the recorder.
 */
export function StreakTracker() {
  useEffect(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const raw = window.localStorage.getItem('rc:recent-dates');
      const arr = raw ? (JSON.parse(raw) as string[]) : [];
      if (arr.includes(today)) return; // already recorded today
      const next = [today, ...arr.filter((d) => d !== today)].slice(0, 30);
      window.localStorage.setItem('rc:recent-dates', JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);
  return null;
}
