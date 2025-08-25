export interface AppSettings {
  version: string;
  baseWage: number;
  overtimeMultiplier: number;
  adjustMinutes: number;
  stores: StoreConfig[];
}

export interface StoreConfig {
  id: string;
  name: string;
  url: string;
}

export interface AppState {
  selectedStoreId?: string;
  selectedSheetName?: string;
  workbook?: Workbook;
  sheetMatrix?: string[][];
  meta?: SheetMeta;
  employees?: EmployeeHeader[];
}

export interface Workbook {
  sheetNames: string[];
  sheets: Record<string, string[][]>;
}

export interface SheetMeta {
  year: number;
  month: number;
  identifier: string;
  headerRowIndex: number;
  startEmployeeColIndex: number;
}

export interface EmployeeHeader {
  name: string;
  colIndex: number;
}

export interface DayWorkRow {
  rowIndex: number;
  day?: number;
  weekday?: string;
  rawCell?: string;
  valid: boolean;
  start?: number;
  end?: number;
  workHours?: number;
  overtimeHours?: number;
}
