import { describe, it, expect } from 'vitest';
import { isValidShiftCell, parseShiftCell, computeDayWork, computeEmployeeStats } from '../src/payroll';
import { defaultSettings } from '../src/settings';
import type { SheetMeta, EmployeeHeader } from '../src/types';

const meta: SheetMeta = {
  year: 2023,
  month: 5,
  identifier: 'test',
  headerRowIndex: 2,
  startEmployeeColIndex: 3,
};

const emp: EmployeeHeader = { name: 'Alice', colIndex: 3 };

const matrix: string[][] = [
  [],
  [],
  ['月', '日', '曜日', 'Alice'],
  ['5', '1', '月', '9-17'],
  ['5', '2', '火', '22-6'],
  ['5', '3', '水', '9-20'],
];

describe('shift helpers', () => {
  it('validates shift cell format', () => {
    expect(isValidShiftCell('9-17')).toBe(true);
    expect(isValidShiftCell(' 22 - 6 ')).toBe(true);
    expect(isValidShiftCell('9-17a')).toBe(false);
    expect(isValidShiftCell('')).toBe(false);
  });

  it('parses shift cell with cross-midnight', () => {
    expect(parseShiftCell('9-17')).toEqual({ start: 9, end: 17 });
    expect(parseShiftCell('22-6')).toEqual({ start: 22, end: 30 });
  });

  it('computes day work and overtime', () => {
    expect(computeDayWork(9, 17)).toEqual({ workHours: 7, overtimeHours: 0 });
    expect(computeDayWork(9, 20)).toEqual({ workHours: 10, overtimeHours: 2 });
  });
});

describe('computeEmployeeStats', () => {
  it('aggregates workdays, hours and amount', () => {
    const settings = defaultSettings();
    settings.baseWage = 1000;
    const stats = computeEmployeeStats(matrix, emp, settings, meta);
    expect(stats.workdays).toBe(3);
    expect(stats.sumWorkHours).toBeCloseTo(25);
    expect(stats.sumOvertimeHours).toBe(2);
    expect(stats.amount).toBe(25500);
    expect(stats.days.length).toBe(3);
  });
});
