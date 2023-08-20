let url = `https://dpg.gg/test/calendar.json`

// получение данных о contributions
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

// рэндерим календарь
const calendarContainer = document.getElementById("calendarContainer")

function generateCalendar(contributionData) {
  const currentDate = new Date()

  // Создаем столбец с днями недели
  const dayOfWeekColumn = document.createElement("div")
  dayOfWeekColumn.classList.add("day-of-week-column")

  const monthNames = [
    "Янв.",
    "Фев.",
    "Март",
    "Апр.",
    "Май",
    "Июнь",
    "Июль",
    "Авг.",
    "Сен.",
    "Окт.",
    "Ноя.",
    "Дек.",
  ]

  const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]

  const firstSquare = document.createElement("div")
  firstSquare.classList.add("calendar-square")

  // Создаем столбец с названиями месяцев
  const monthColumn = document.createElement("div")
  monthColumn.classList.add("month-column")

  // Получаем день недели и месяц самой первой ячейки
  const firstDateCopy = new Date(currentDate)
  firstDateCopy.setDate(firstDateCopy.getDate() - 356)
  const firstDayOfWeek = firstDateCopy.getDay()
  const firstMonth = firstDateCopy.getMonth()

  console.log("Первый день недели:", firstDayOfWeek)
  console.log("Первый месяц:", firstMonth)

  // Переупорядочиваем месяцы в новом массиве в нужном порядке
  const reorderedMonthNames = [
    ...monthNames.slice(firstMonth),
    ...monthNames.slice(0, firstMonth),
  ]

  // Переупорядочиваем дни недели в новом массиве в нужном порядке
  const reorderedDaysOfWeek = [
    ...daysOfWeek.slice(firstDayOfWeek),
    ...daysOfWeek.slice(0, firstDayOfWeek),
  ]

  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    const monthName = reorderedMonthNames[monthIndex]

    const monthLabel = document.createElement("div")
    monthLabel.classList.add("month-label")
    monthLabel.textContent = monthName

    monthColumn.appendChild(monthLabel)
  }

  calendarContainer.appendChild(monthColumn)

  for (const dayOfWeek of reorderedDaysOfWeek) {
    const dayOfWeekNameCell = document.createElement("div")
    dayOfWeekNameCell.classList.add("day-of-week-cell")
    dayOfWeekNameCell.textContent = dayOfWeek
    dayOfWeekColumn.appendChild(dayOfWeekNameCell)
  }

  calendarContainer.appendChild(dayOfWeekColumn)

  for (let week = 0; week < 51; week++) {
    const weekColumn = document.createElement("div")
    weekColumn.classList.add("week-column")

    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      const square = document.createElement("div")
      square.classList.add("calendar-square")

      square.addEventListener("mouseenter", () => {
        const tooltip = createTooltip(contributions, currentDateCopy)
        square.appendChild(tooltip)
      })

      square.addEventListener("mouseleave", () => {
        const tooltip = square.querySelector(".tooltip")
        if (tooltip) {
          tooltip.remove()
        }
      })

      const currentDateCopy = new Date(currentDate)
      currentDateCopy.setDate(
        currentDateCopy.getDate() - (356 - (week * 7 + dayOfWeek))
      )

      const dateKey = formatDate(currentDateCopy)
      const contributions = contributionData[dateKey] || 0
      const level = calculateLevel(contributions)
      // const month = currentDateCopy.getMonth()
      // const dayOfMonth = currentDateCopy.getDate() // Получаем день месяца
      // square.textContent = dayOfMonth + "," + month

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

// tooltip
function createTooltip(contributions, date) {
  const tooltip = document.createElement("div")
  tooltip.classList.add("tooltip")

  const tooltipContent = document.createElement("div")
  tooltipContent.classList.add("tooltip-content")

  const contributionsInfo = document.createElement("div")
  contributionsInfo.textContent = `Contributions: ${contributions}`
  tooltipContent.appendChild(contributionsInfo)

  const dateInfo = document.createElement("div")
  const formattedDate = formatDateFull(date)
  dateInfo.textContent = formattedDate
  tooltipContent.appendChild(dateInfo)

  tooltip.appendChild(tooltipContent)

  return tooltip
}

function formatDateFull(date) {
  const options = {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }
  return date.toLocaleDateString("en-US", options)
}
