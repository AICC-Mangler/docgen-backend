import * as ExcelJS from 'exceljs';

export function merge_column(sheet: ExcelJS.Worksheet, column_index: number) {
  let startRow = 2; // 데이터 시작 row (헤더가 있으면 2)
  for (let i = 2; i <= sheet.rowCount; i++) {
    const currentValue = sheet.getRow(i).getCell(column_index).value;
    const nextValue =
      i < sheet.rowCount
        ? sheet.getRow(i + 1).getCell(column_index).value
        : null;

    if (currentValue !== nextValue) {
      if (i > startRow) {
        // 값이 연속된 구간 병합
        sheet.mergeCells(startRow, column_index, i, column_index);
      }
      startRow = i + 1; // 다음 구간 시작
    }
  }
}
