
function main() {
  const thisMonth = getThisMonthRowFromSheet()
  let m = new MonthWork(thisMonth)
  m.ensureEventsExist()
}

const CalendarId: string = 'primary'

// getThisMonthRow Loads info about current month
const getThisMonthRowFromSheet = (): any[] => {
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
    startHour: 14,
    durationInHours: 5
  }
}

interface WorkDay {
  day: number,
  type: string,
}

interface CalendarEvent {
  summary: string,
  location: string,
  start: {
    dateTime: string
  },
  end: {
    dateTime: string
  }
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

    let days = getDays(thisMonthRange[2].toString())
    this.addEvents(days, 'day')
    let nights = getDays(thisMonthRange[3].toString())
    this.addEvents(nights, 'night')
    let mornings = getDays(thisMonthRange[4].toString())
    this.addEvents(mornings, 'morning')
    let afternoons = getDays(thisMonthRange[5].toString())
    this.addEvents(afternoons, 'afternoon')
  }

  ensureEventsExist() {
    this.workDays.forEach(e => {
      let event = composeEvent(this.year, this.month, e.day, e.type)
      if (isEventExist(event, CalendarId)) {
        Logger.log('Event already exist: ' + event.start)
        return
      }
      // if exist => continue
      createCalendarEvent(event, CalendarId)
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

const composeEvent = (year: number, month: number, day: number, type: string): CalendarEvent => {
  let eventInfo = EventsInfoByType[type]
  let start = new Date(year, month - 1, day, eventInfo.startHour)
  let end = new Date(year, month - 1, day, eventInfo.startHour + eventInfo.durationInHours)

  return {
    summary: eventInfo.description,
    location: 'Jana Evangelisty Purkyně 270/5, 434 01 Most, Czechia',
    start: {
      dateTime: start.toISOString()
    },
    end: {
      dateTime: end.toISOString()
    },
  };
}

const getDays = (input: string): number[] => {
  let days = input
    .replace('/\s/g', "")
    .split(',')
    .map(function(d) {
      return parseInt(d)
    })
  return days
}

const isEventExist = (event: CalendarEvent, calendarId?: string): boolean => {
  if (!calendarId) {
    calendarId = 'primary'
  }
  let foundEvent = Calendar.Events.list(calendarId, {
    timeMin: event.start.dateTime,
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 1
  });

  if (foundEvent.items.length < 1) {
    return false
  }

  return foundEvent.items[0].summary == event.summary
}

const createCalendarEvent = (event: CalendarEvent, calendarId?: string) => {
  if (!calendarId) {
    calendarId = 'primary'
  }

  let calEvent = Calendar.Events.insert(event, calendarId);
  Logger.log('Event ID: ' + calEvent.id);
}
