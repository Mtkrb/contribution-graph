// script.js
let url = `https://dpg.gg/test/calendar.json`
const calendarContainer = document.getElementById("calendarContainer")
const startDate = new Date()
console.log(startDate)
startDate.setDate(startDate.getDate() - 357) // Передвигаемся назад на 357 дней
console.log(startDate)

// get data
const getData = async function (url) {
  const result = await fetch(url)
  if (!result.ok) {
    throw new Error(`Ошибка фетч ${url} статус: ${result.status}`)
  }
  return await result.json()
}

getData(url).then((data) => {
  console.log(data)
})

// calendar render
