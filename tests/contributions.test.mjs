import test from "node:test";
import assert from "node:assert/strict";
import { contributionCalendar } from "../public/contribution-calendar.mjs";

function datesFrom(start, count) {
  const startTime = Date.parse(`${start}T00:00:00Z`);
  return Array.from({ length: count }, (_, index) => ({
    date: new Date(startTime + index * 86400000).toISOString().slice(0, 10),
  }));
}

test("all seven possible start weekdays align every date with its weekday row", () => {
  for (const start of datesFrom("2026-09-20", 7)) {
    const days = datesFrom(start.date, 364);
    const layout = contributionCalendar(days);
    assert.equal(layout.cells.length, 364, "keep the entire 52-week history");
    days.forEach(({ date }, index) => {
      const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
      assert.equal(layout.cells[index].row, weekday + 1, date);
      if (index) {
        assert.equal(layout.cells[index].column - layout.cells[index - 1].column,
          weekday === 0 ? 1 : 0, `${date} starts a new column only on Sunday`);
      }
    });
    assert.equal(layout.weeks, start.date === "2026-09-20" ? 52 : 53);
  }
});

test("month labels share the actual day column across the new year", () => {
  const days = datesFrom("2025-12-15", 90);
  const layout = contributionCalendar(days);
  assert.deepEqual(layout.months.map(({ date }) => date),
    ["2025-12-15", "2026-01-01", "2026-02-01", "2026-03-01"]);
  for (const month of layout.months) {
    const index = days.findIndex(({ date }) => date === month.date);
    assert.equal(month.column, layout.cells[index].column);
  }
  assert.equal(layout.months[1].column, 3, "January 1 belongs to the third week");
  assert.equal(layout.cells[17].row, 5, "January 1, 2026 is Thursday");
});

test("leap day and daylight-saving dates retain consecutive UTC positions", () => {
  const days = datesFrom("2024-02-27", 260);
  const layout = contributionCalendar(days);
  assert.ok(days.some(({ date }) => date === "2024-02-29"));
  const positions = layout.cells.map(({ row, column }) => (column - 1) * 7 + row);
  positions.slice(1).forEach((position, index) => assert.equal(position - positions[index], 1));
  for (const date of ["2024-02-29", "2024-03-10", "2024-11-03"]) {
    const index = days.findIndex((day) => day.date === date);
    assert.equal(layout.cells[index].row, new Date(`${date}T00:00:00Z`).getUTCDay() + 1);
  }
});

test("a short opening month does not overlap the next month label", () => {
  for (const start of ["2026-09-28", "2026-09-30", "2026-12-31"]) {
    const layout = contributionCalendar(datesFrom(start, 364));
    assert.equal(layout.months.some(({ date }) => date === start), false);
    layout.months.slice(1).forEach((month, index) =>
      assert.ok(month.column - layout.months[index].column >= 2));
  }
  assert.deepEqual(contributionCalendar([]), { cells: [], months: [], weeks: 0 });
});
