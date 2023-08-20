// script.js
const calendarContainer = document.getElementById("calendarContainer")
const startDate = new Date()
startDate.setDate(startDate.getDate() - 357) // Передвигаемся назад на 357 дней

async function fetchContributions() {
  try {
    const response = await fetch("https://dpg.gg/test/calendar.json")
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching contributions:", error)
    return {}
  }
}

class CalendarDay {
  constructor() {
    this.element = document.createElement("div")
    this.element.classList.add("calendar-day")
    this.generateSquares()
  }

  generateSquares() {
    let currentDate = new Date(startDate)

    for (let week = 0; week < 51; week++) {
      const square = document.createElement("div")
      square.classList.add("calendar-square")
      const dateString = currentDate.toISOString().split("T")[0]
      const activityLevel = contributions[dateString] || 0
      square.classList.add(`level-${activityLevel}`)
      if (currentDate.toDateString() === new Date().toDateString()) {
        square.classList.add("current-day")
      }
      this.element.appendChild(square)
      currentDate.setDate(currentDate.getDate() + 1)
    }
  }
}

async function init() {
  const contributions = await fetchContributions()

  for (let day = 0; day < 7; day++) {
    const calendarDay = new CalendarDay()
    calendarContainer.appendChild(calendarDay.element)
  }
}

init()
