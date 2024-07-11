import { useEffect, useState } from "react";


export type DaysArray = {
  date: number;
  disabled: boolean;
  isCurrentMonth: boolean;
  month: number;
  year: number;
}

export function useDaysOfMonth(inputYear: number, inputMonth: number, minTime?: number, maxTime?: number): DaysArray[] {
  const [dateArray, setDateArray] = useState<DaysArray[]>([])
  const days = new Date(inputYear, inputMonth + 1, 0).getDate()
  const firstDay = new Date(inputYear, inputMonth, 1).getDay()
  const prevMonthDays = new Date(inputYear, inputMonth, 0).getDate()

  function createDateArray() {
    let arr = Array.from(Array(days), (_, i) => {
      return {
        year: inputYear,
        month: inputMonth,
        date: i + 1,
        isCurrentMonth: true,
        disabled: false
      }
    })

    // 補上個月的日期
    let daysShouldInsert = firstDay
    let insertedNumber = prevMonthDays
    while (daysShouldInsert > 0 && daysShouldInsert < 7) {
      const insertingTime = {
        year: inputYear,
        month: inputMonth - 1,
        date: insertedNumber,
        isCurrentMonth: false,
        disabled: false
      }
      arr.unshift(insertingTime)
      insertedNumber--
      daysShouldInsert--
    }

    // 補下個月的日期
    let blankInEnd = arr.length % 7 // 最後一行剩幾個空格
    if (blankInEnd !== 0) blankInEnd = blankInEnd - 7 // 如有餘數則再減七,得到要補的日期數量
    let i = -1
    while (i >= blankInEnd) {
      const insertingTime = {
        year: inputYear,
        month: inputMonth + 1,
        date: (i * -1),
        isCurrentMonth: false,
        disabled: false
      }

      arr.push({ ...insertingTime })
      i--
    }

    // 若有給上下限，把在範圍外的按鍵 disable
    if (minTime || maxTime) {
      function checkShouldDisabled(day: DaysArray) {
        const thisKeyTime = new Date(day.year, day.month, day.date).getTime()
        let shouldDisableKey = false
        if (maxTime && thisKeyTime > maxTime) shouldDisableKey = true
        if (minTime && thisKeyTime < minTime) shouldDisableKey = true
        const disableKey = !!shouldDisableKey
        return { ...day, disabled: disableKey }
      }

      arr = arr.map(checkShouldDisabled)
    }

    return arr
  }

  useEffect(() => {
    setDateArray(createDateArray())
  }, [inputYear, inputMonth, minTime, maxTime])

  return dateArray
}