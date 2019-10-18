
const getThisMonthRow = (): any[] => {
  let sheet = SpreadsheetApp.getActiveSheet();
  let thisRow = sheet.getDataRange().getValues()[1]
  return thisRow
}


class MonthWork {
  dayShifts: number[];
  nightShifts: number[];
  morningShifts: number[];
  afternoonShifts: number[];
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
  currentRow: any[];


  constructor(thisMonthRange: any[]) {
    this.dayShifts = thisMonthRange[2]
    this.nightShifts = thisMonthRange[3]
    this.morningShifts = thisMonthRange[4]
    this.afternoonShifts = thisMonthRange[5]

    Logger.log('Denni: ' + this.dayShifts)
    Logger.log('Nocni: ' + this.nightShifts)
    Logger.log('Ranni: ' + this.morningShifts)
    Logger.log('Odpoledni: ' + this.afternoonShifts)
  }
}

const createEvent = () => {
  Logger.log('CalendarEvents: ' + Calendar.Events.list('beesr16iv7pam5gval5rh0cm2c@group.calendar.google.com') )
  Calendar.Events.list('beesr16iv7pam5gval5rh0cm2c@group.calendar.google.com')
}

function main() {
  createEvent()
  // const thisMonth = getThisMonthRow()
  // new MonthWork(thisMonth)
}
