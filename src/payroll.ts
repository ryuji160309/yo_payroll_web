import type { AppSettings, DayWorkRow, EmployeeHeader, SheetMeta } from './types';

export function isValidShiftCell(s: string): boolean {
  return /^\s*\d{1,2}\s*-\s*\d{1,2}\s*$/.test(s);
}

export function parseShiftCell(s: string): { start: number; end: number } {
  const m = s.match(/\d{1,2}/g);
  if (!m || m.length < 2) {
    throw new Error('Invalid shift cell');
  }
  let [start, end] = m.map(Number);
  if (end < start) {
    end += 24;
  }
  return { start, end };
}

export function computeDayWork(start: number, end: number): { workHours: number; overtimeHours: number } {
  let work = end - start;
  if (work >= 8) {
    work -= 1;
  } else if (work >= 7) {
    work -= 0.75;
  } else if (work >= 6) {
    work -= 0.5;
  }
  work = Math.max(work, 0);
  const overtime = Math.max(0, work - 8);
  return { workHours: work, overtimeHours: overtime };
}

export function computeEmployeeStats(
  matrix: string[][],
  emp: EmployeeHeader,
  settings: AppSettings,
  meta: SheetMeta
) {
  const days: DayWorkRow[] = [];
  let workdays = 0;
  let sumWorkHours = 0;
  let sumOvertimeHours = 0;

  for (let row = meta.headerRowIndex + 1; row < matrix.length; row++) {
    const rawCell = matrix[row]?.[emp.colIndex] ?? '';
    const dayVal = matrix[row]?.[1];
    const weekdayVal = matrix[row]?.[2];
    if (isValidShiftCell(rawCell)) {
      const { start, end } = parseShiftCell(rawCell);
      const { workHours, overtimeHours } = computeDayWork(start, end);
      workdays++;
      sumWorkHours += workHours;
      sumOvertimeHours += overtimeHours;
      days.push({
        rowIndex: row,
        day: dayVal ? Number(dayVal) : undefined,
        weekday: weekdayVal || undefined,
        rawCell,
        valid: true,
        start,
        end,
        workHours,
        overtimeHours,
      });
    } else if (rawCell) {
      days.push({
        rowIndex: row,
        day: dayVal ? Number(dayVal) : undefined,
        weekday: weekdayVal || undefined,
        rawCell,
        valid: false,
      });
    }
  }

  sumWorkHours += (settings.adjustMinutes * workdays) / 60;
  const base = settings.baseWage * (sumWorkHours - sumOvertimeHours);
  const otPay = settings.baseWage * settings.overtimeMultiplier * sumOvertimeHours;
  const amount = Math.ceil(base + otPay);

  return { workdays, sumWorkHours, sumOvertimeHours, amount, days };
}
