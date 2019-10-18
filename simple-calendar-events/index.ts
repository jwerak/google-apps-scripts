
function main() {
  const thisMonth = getThisMonthRow()
  new MonthWork(thisMonth)
}

// getThisMonthRow Loads info about current month
const getThisMonthRow = (): any[] => {
  let sheet = SpreadsheetApp.getActiveSheet();
  let thisRow = sheet.getDataRange().getValues()[1]
  return thisRow
}

// General configuration
const EventsInfoByType = {
  'day': {
    description: "Denni",
    startHour: 6,
    durationInHours: 12
  },
  'night': {
    description: "Nocni",
    startHour: 18,
    durationInHours: 12
  },
  'morning': {
    description: "Ranni",
    startHour: 6,
    durationInHours: 6
  },
  'afternoon': {
    description: "Odpoledni",
    startHour: 12,
    durationInHours: 6
  }
}

interface WorkDay {
  day: number,
  type: string,
}

// Contains info about this month work shifts
class MonthWork {
  year: number;
  month: number;
  workDays: WorkDay[];
  monthStart: Date;

  constructor(thisMonthRange: any[]) {
    this.workDays = []
    this.year = thisMonthRange[0]
    this.month = thisMonthRange[1]
    this.monthStart = new Date(this.year, this.month)

    let days = getDays(thisMonthRange[2] as string)
    this.addEvents(days, 'day')
    let nights = getDays(thisMonthRange[3] as string)
    this.addEvents(nights, 'night')
    let mornings = getDays(thisMonthRange[4] as string)
    this.addEvents(mornings, 'morning')
    let afternoons = getDays(thisMonthRange[5] as string)
    this.addEvents(afternoons, 'afternoon')

    this.workDays.forEach(e => {
      createCalendarEvent(this.year, this.month, e.day, e.type)
    })
  }

  addEvents(days: number[], type: string) {
    for (let d of days) {
      if (isNaN(d)) {
        continue
      }
      this.workDays.push({
        day: d,
        type: type
      })
    }
  }
}

const getDays = (input: string): number[] => {
  let days = input.split(',').map(function(d) {
    return parseInt(d)
  })
  return days
}

const createCalendarEvent = (year: number, month: number, day: number, type: string) => {
  let eventInfo = EventsInfoByType[type]
  let start = new Date(year, month - 1, day, eventInfo.startHour)
  let end = new Date(year, month - 1, day, eventInfo.startHour + eventInfo.durationInHours)

  let calendarId = 'primary';
  let event = {
    summary: eventInfo.description,
    location: 'Jana Evangelisty Purkyně 270/5, 434 01 Most, Czechia',
    start: {
      dateTime: start.toISOString()
    },
    end: {
      dateTime: end.toISOString()
    },
  };

  let calEvent = Calendar.Events.insert(event, calendarId);
  Logger.log('Event ID: ' + calEvent.id);
}
