// script.js
let url = `https://dpg.gg/test/calendar.json`

// get data
const getData = async function (url) {
  const result = await fetch(url)
  if (!result.ok) {
    throw new Error(`Ошибка фетч ${url} статус: ${result.status}`)
  }
  return await result.json()
}

getData(url)
  .then((data) => {
    generateCalendar(data)
    console.log(data)
  })
  .catch((error) => {
    console.error("Ошибка при получении данных:", error)
  })

// calendar render
const calendarContainer = document.getElementById("calendarContainer")

function generateCalendar(contributionData) {
  const currentDate = new Date()

  // Создаем столбец с днями недели
  const dayOfWeekColumn = document.createElement("div")
  dayOfWeekColumn.classList.add("day-of-week-column")

  const daysOfWeek = ["Пн", "", "Ср", "", "Пт", "", ""]
  for (const dayOfWeek of daysOfWeek) {
    const dayOfWeekCell = document.createElement("div")
    dayOfWeekCell.classList.add("day-of-week-cell")
    dayOfWeekCell.textContent = dayOfWeek
    dayOfWeekColumn.appendChild(dayOfWeekCell)
  }

  calendarContainer.appendChild(dayOfWeekColumn)

  for (let week = 0; week < 51; week++) {
    const weekColumn = document.createElement("div")
    weekColumn.classList.add("week-column")

    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      const square = document.createElement("div")
      square.classList.add("calendar-square")

      const currentDateCopy = new Date(currentDate)
      currentDateCopy.setDate(
        currentDateCopy.getDate() - (356 - (week * 7 + dayOfWeek))
      )
      const dateKey = formatDate(currentDateCopy)
      const contributions = contributionData[dateKey] || 0
      const level = calculateLevel(contributions)
      const month = currentDateCopy.getMonth()
      const dayOfMonth = currentDateCopy.getDate() // Получаем день месяца
      square.textContent = dayOfMonth + "," + month

      if (dayOfWeek === 0) {
        // Если это первый день недели, добавляем класс для первой ячейки строки
        square.classList.add("first-day")
      }

      if (currentDateCopy.toDateString() === new Date().toDateString()) {
        square.classList.add("today") // Добавляем класс для сегодняшнего дня
      }

      square.classList.add(`level-${level}`)
      weekColumn.appendChild(square)
    }

    calendarContainer.appendChild(weekColumn)
  }
}

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function calculateLevel(contributions) {
  if (contributions === 0) {
    return 0
  } else if (contributions >= 1 && contributions <= 9) {
    return 1
  } else if (contributions >= 10 && contributions <= 19) {
    return 2
  } else if (contributions >= 20 && contributions <= 29) {
    return 3
  } else if (contributions >= 30) {
    return 4
  } else {
    return 0
  }
}
