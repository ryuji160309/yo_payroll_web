import { read, utils } from 'xlsx';
import type { StoreConfig, Workbook, SheetMeta, EmployeeHeader } from './types';

export function extractFileId(url: string): string | null {
  const m = url.match(/\/d\/([a-zA-Z0-9_-]+)(?:\/|$)/);
  return m ? m[1] : null;
}

export function makeExportUrl(fileId: string): string {
  return `https://docs.google.com/spreadsheets/d/${fileId}/export?format=xlsx`;
}

export async function fetchWorkbookFromStore(store: StoreConfig): Promise<Workbook> {
  const fileId = extractFileId(store.url);
  if (!fileId) {
    throw new Error('URLに /d/{ID}/ が含まれていません');
  }
  const exportUrl = makeExportUrl(fileId);
  const res = await fetch(exportUrl);
  if (!res.ok) {
    if (typeof window !== 'undefined') {
      window.open(exportUrl, '_blank');
    }
    throw new Error('ダウンロードに失敗しました。共有設定（リンク閲覧可）をご確認ください');
  }
  const buf = await res.arrayBuffer();
  return parseArrayBufferToWorkbook(buf);
}

export function parseArrayBufferToWorkbook(buf: ArrayBuffer): Workbook {
  const wb = read(buf, { type: 'array' });
  const sheets: Record<string, string[][]> = {};
  for (const name of wb.SheetNames) {
    const ws = wb.Sheets[name];
    const rows = utils.sheet_to_json(ws, { header: 1, raw: false }) as string[][];
    sheets[name] = rows.map(row => row.map(cell => (cell ?? '').toString()));
  }
  return { sheetNames: wb.SheetNames, sheets };
}

export function getSheetMatrix(book: Workbook, sheetName: string): string[][] {
  const sheet = book.sheets[sheetName];
  if (!sheet) {
    throw new Error(`Sheet ${sheetName} not found`);
  }
  return sheet;
}

export function readMeta(matrix: string[][]): SheetMeta {
  const year = Number(matrix[1]?.[2]);
  const month = Number(matrix[1]?.[4]);
  const identifier = matrix[36]?.[14] ?? '';
  if (!year || !month || !identifier) {
    throw new Error('必須セルが見つかりません');
  }
  return {
    year,
    month,
    identifier,
    headerRowIndex: 2,
    startEmployeeColIndex: 3,
  };
}

const EXCLUDE_HEADERS = ['月', '日', '曜日', '空き', '予定', '.'];

export function extractEmployees(headerRow: string[], startCol: number): EmployeeHeader[] {
  const employees: EmployeeHeader[] = [];
  for (let col = startCol; col < headerRow.length; col++) {
    const name = headerRow[col]?.trim();
    if (name && !EXCLUDE_HEADERS.includes(name)) {
      employees.push({ name, colIndex: col });
    }
  }
  return employees;
}
