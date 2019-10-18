class MonthWork {
  dayShifts: number[];
  nightShifts: number[];
  morningShifts: number[];
  afternoonShifts: number[];
  sheet: GoogleAppsScript.Spreadsheet.Sheet;



  constructor() {
    this.sheet = SpreadsheetApp.getActiveSheet();
    let data = this.sheet.getDataRange().getValues();
    let dayShifts: string = data[1][2];
    Logger.log('Denni: ' + dayShifts.split(",")[0] + 'Dalsi: ' + dayShifts.split(",")[1])
  }
}

function main() {
  let m = new MonthWork()
}
