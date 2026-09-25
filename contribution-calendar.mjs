const DAY_MS = 24 * 60 * 60 * 1000;

// Sunday is row 1. UTC date arithmetic keeps the calendar steady across DST.
export function contributionCalendar(days) {
  if (!days.length) return { cells: [], months: [], weeks: 0 };
  const first = new Date(`${days[0].date}T00:00:00Z`);
  const sunday = first.getTime() - first.getUTCDay() * DAY_MS;
  const months = [];
  let previousMonth;
  const cells = days.map(({ date }) => {
    const elapsed = Math.round((Date.parse(`${date}T00:00:00Z`) - sunday) / DAY_MS);
    const cell = { row: elapsed % 7 + 1, column: Math.floor(elapsed / 7) + 1 };
    const month = date.slice(0, 7);
    if (month !== previousMonth) {
      months.push({ date, column: cell.column });
      previousMonth = month;
    }
    return cell;
  });

  return {
    cells,
    weeks: Math.max(...cells.map(({ column }) => column)),
    // A partial opening month may have too little room for its three letters.
    months: months.filter((month, index) =>
      !months[index + 1] || months[index + 1].column - month.column >= 2),
  };
}
