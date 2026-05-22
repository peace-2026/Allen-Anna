const STORAGE_KEY = "anniversary-reminder-events";
const REMINDED_KEY = "anniversary-reminder-fired";

const lunarInfo = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0,
  0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540,
  0x0d6a0, 0x0ada2, 0x095b0, 0x14977, 0x04970, 0x0a4b0, 0x0b4b5, 0x06a50,
  0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, 0x06566, 0x0d4a0,
  0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2,
  0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573,
  0x052d0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60, 0x0aae4,
  0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5,
  0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46,
  0x0ab60, 0x09570, 0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58,
  0x055c0, 0x0ab60, 0x096d5, 0x092e0, 0x0c960, 0x0d954, 0x0d4a0, 0x0da50,
  0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, 0x0a950, 0x0b4a0,
  0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260,
  0x0ea65, 0x0d530, 0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0,
  0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2, 0x049b0,
  0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, 0x14b63, 0x09370,
  0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06aa0, 0x1a6c4, 0x0aae0,
  0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0,
  0x0a6d0, 0x055d4, 0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50,
  0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, 0x0b273, 0x06930, 0x07337, 0x06aa0,
  0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, 0x0e968, 0x0d520,
  0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,
  0x0d520
];

const monthNames = ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "冬月", "腊月"];
const dayNames = [
  "初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
  "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
  "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"
];

const form = document.querySelector("#eventForm");
const titleInput = document.querySelector("#titleInput");
const solarDateInput = document.querySelector("#solarDateInput");
const solarAdvanceInput = document.querySelector("#solarAdvanceInput");
const lunarMonthInput = document.querySelector("#lunarMonthInput");
const lunarDayInput = document.querySelector("#lunarDayInput");
const lunarAdvanceInput = document.querySelector("#lunarAdvanceInput");
const lunarLeapInput = document.querySelector("#lunarLeapInput");
const noteInput = document.querySelector("#noteInput");
const solarFields = document.querySelector("#solarFields");
const lunarFields = document.querySelector("#lunarFields");
const eventList = document.querySelector("#eventList");
const emptyState = document.querySelector("#emptyState");
const countText = document.querySelector("#countText");
const exportButton = document.querySelector("#exportButton");
const notifyButton = document.querySelector("#notifyButton");
const todayText = document.querySelector("#todayText");
const todayLunarText = document.querySelector("#todayLunarText");

let events = loadEvents();

function pad(value) {
  return String(value).padStart(2, "0");
}

function dateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function daysBetween(start, end) {
  const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((endDate - startDate) / 86400000);
}

function offsetDate(date, offset) {
  const next = new Date(date);
  next.setDate(next.getDate() + offset);
  return next;
}

function leapMonth(year) {
  return lunarInfo[year - 1900] & 0xf;
}

function leapDays(year) {
  if (!leapMonth(year)) return 0;
  return (lunarInfo[year - 1900] & 0x10000) ? 30 : 29;
}

function monthDays(year, month) {
  return (lunarInfo[year - 1900] & (0x10000 >> month)) ? 30 : 29;
}

function lunarYearDays(year) {
  let sum = 348;
  for (let bit = 0x8000; bit > 0x8; bit >>= 1) {
    if (lunarInfo[year - 1900] & bit) sum += 1;
  }
  return sum + leapDays(year);
}

function solarToLunar(date) {
  const base = new Date(1900, 0, 31);
  let offset = Math.floor((new Date(date.getFullYear(), date.getMonth(), date.getDate()) - base) / 86400000);
  let year = 1900;
  while (year < 2101 && offset >= lunarYearDays(year)) {
    offset -= lunarYearDays(year);
    year += 1;
  }

  let month = 1;
  let isLeap = false;
  const leap = leapMonth(year);

  while (month <= 12) {
    const days = isLeap ? leapDays(year) : monthDays(year, month);
    if (offset < days) break;
    offset -= days;

    if (leap === month && !isLeap) {
      isLeap = true;
    } else {
      if (isLeap) isLeap = false;
      month += 1;
    }
  }

  return { year, month, day: offset + 1, isLeap };
}

function lunarToSolar(year, month, day, isLeap) {
  if (year < 1900 || year > 2100) return null;
  const leap = leapMonth(year);
  if (isLeap && leap !== month) return null;

  let offset = 0;
  for (let y = 1900; y < year; y += 1) {
    offset += lunarYearDays(y);
  }
  for (let m = 1; m < month; m += 1) {
    offset += monthDays(year, m);
    if (leap === m) offset += leapDays(year);
  }
  if (isLeap) offset += monthDays(year, month);

  const maxDay = isLeap ? leapDays(year) : monthDays(year, month);
  if (day > maxDay) return null;

  const base = new Date(1900, 0, 31);
  return offsetDate(base, offset + day - 1);
}

function lunarLabel(month, day, isLeap) {
  return `${isLeap ? "闰" : ""}${monthNames[month - 1]}${dayNames[day - 1]}`;
}

function getNextSolarDate(event, fromDate = new Date()) {
  const today = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());

  if (event.type === "solar") {
    const base = parseDate(event.solarDate);
    for (let year = today.getFullYear(); year <= today.getFullYear() + 5; year += 1) {
      const candidate = new Date(year, base.getMonth(), base.getDate());
      if (candidate >= today) return candidate;
    }
    return new Date(today.getFullYear() + 1, base.getMonth(), base.getDate());
  }

  for (let year = today.getFullYear(); year <= 2100; year += 1) {
    const candidate = lunarToSolar(year, event.lunarMonth, event.lunarDay, event.lunarLeap);
    if (candidate && candidate >= today) return candidate;
  }

  return null;
}

function loadEvents() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveEvents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function populateLunarFields() {
  lunarMonthInput.innerHTML = monthNames
    .map((name, index) => `<option value="${index + 1}">${name}</option>`)
    .join("");
  lunarDayInput.innerHTML = dayNames
    .map((name, index) => `<option value="${index + 1}">${name}</option>`)
    .join("");
}

function updateToday() {
  const today = new Date();
  const lunar = solarToLunar(today);
  todayText.textContent = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  todayLunarText.textContent = `农历 ${lunarLabel(lunar.month, lunar.day, lunar.isLeap)}`;
}

function renderEvents() {
  const sorted = [...events].sort((a, b) => {
    const dateA = getNextSolarDate(a);
    const dateB = getNextSolarDate(b);
    return (dateA?.getTime() || Infinity) - (dateB?.getTime() || Infinity);
  });

  eventList.innerHTML = "";
  emptyState.hidden = sorted.length > 0;
  countText.textContent = sorted.length ? `${sorted.length} 个事项` : "暂无事项";

  sorted.forEach((event) => {
    const nextDate = getNextSolarDate(event);
    const card = document.querySelector("#eventTemplate").content.firstElementChild.cloneNode(true);
    const month = nextDate ? nextDate.getMonth() + 1 : "--";
    const day = nextDate ? nextDate.getDate() : "--";
    const remain = nextDate ? daysBetween(new Date(), nextDate) : null;

    card.querySelector(".event-month").textContent = nextDate ? `${month}月` : "超出";
    card.querySelector(".event-day").textContent = day;
    card.querySelector("h3").textContent = event.title;
    card.querySelector(".type-badge").textContent = event.type === "lunar" ? "农历" : "公历";

    const sourceDate = event.type === "lunar"
      ? `农历 ${lunarLabel(event.lunarMonth, event.lunarDay, event.lunarLeap)}`
      : `公历 ${event.solarDate.slice(5).replace("-", "月")}日`;
    const nextText = nextDate ? `下一次 ${dateKey(nextDate)}，${remain === 0 ? "今天" : `${remain} 天后`}` : "超出可计算年份";
    card.querySelector(".event-meta").textContent = `${sourceDate} · ${nextText} · 提前 ${event.advanceDays} 天提醒`;
    card.querySelector(".event-note").textContent = event.note || "";
    card.querySelector(".delete-button").addEventListener("click", () => {
      events = events.filter((item) => item.id !== event.id);
      saveEvents();
      renderEvents();
    });

    eventList.append(card);
  });
}

function buildEventFromForm() {
  const type = new FormData(form).get("dateType");
  const title = titleInput.value.trim();
  const note = noteInput.value.trim();

  if (type === "solar") {
    if (!solarDateInput.value) {
      solarDateInput.focus();
      throw new Error("请选择公历日期");
    }

    return {
      id: crypto.randomUUID(),
      title,
      type,
      solarDate: solarDateInput.value,
      advanceDays: Number(solarAdvanceInput.value),
      note
    };
  }

  return {
    id: crypto.randomUUID(),
    title,
    type,
    lunarMonth: Number(lunarMonthInput.value),
    lunarDay: Number(lunarDayInput.value),
    lunarLeap: lunarLeapInput.checked,
    advanceDays: Number(lunarAdvanceInput.value),
    note
  };
}

function resetForm() {
  form.reset();
  document.querySelector("input[name='dateType'][value='lunar']").checked = true;
  solarFields.hidden = true;
  lunarFields.hidden = false;
}

function requestNotificationPermission() {
  if (!("Notification" in window)) {
    alert("当前浏览器不支持网页通知，可以使用“导出日历”长期提醒。");
    return;
  }

  Notification.requestPermission().then((permission) => {
    alert(permission === "granted" ? "浏览器提醒已开启。页面打开时会检查到期事项。" : "没有获得通知权限，可以继续使用日历导出。");
  });
}

function getRemindedMap() {
  try {
    return JSON.parse(localStorage.getItem(REMINDED_KEY)) || {};
  } catch {
    return {};
  }
}

function checkDueReminders() {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  const today = new Date();
  const reminded = getRemindedMap();
  events.forEach((event) => {
    const target = getNextSolarDate(event, today);
    if (!target) return;
    const remindDate = offsetDate(target, -event.advanceDays);
    if (dateKey(remindDate) !== dateKey(today)) return;

    const reminderKey = `${event.id}:${dateKey(target)}:${event.advanceDays}`;
    if (reminded[reminderKey]) return;

    const when = event.advanceDays === 0 ? "今天" : `${event.advanceDays} 天后`;
    new Notification(event.title, {
      body: `${when}是这个纪念日：${dateKey(target)}。${event.note || ""}`.trim()
    });
    reminded[reminderKey] = true;
  });
  localStorage.setItem(REMINDED_KEY, JSON.stringify(reminded));
}

function escapeIcsText(text) {
  return text.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

function buildIcs() {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Anniversary Reminder//CN",
    "CALSCALE:GREGORIAN"
  ];

  events.forEach((event) => {
    const currentYear = new Date().getFullYear();
    for (let baseYear = currentYear; baseYear <= 2100; baseYear += 1) {
      const date = event.type === "lunar"
        ? lunarToSolar(baseYear, event.lunarMonth, event.lunarDay, event.lunarLeap)
        : new Date(baseYear, parseDate(event.solarDate).getMonth(), parseDate(event.solarDate).getDate());

      if (!date) continue;

      const dateStamp = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
      const alarmDays = event.advanceDays || 0;
      lines.push(
        "BEGIN:VEVENT",
        `UID:${event.id}-${dateStamp}@anniversary-reminder`,
        `DTSTAMP:${dateStamp}T000000Z`,
        `DTSTART;VALUE=DATE:${dateStamp}`,
        `SUMMARY:${escapeIcsText(event.title)}`,
        `DESCRIPTION:${escapeIcsText(event.note || "纪念日提醒")}`,
        "BEGIN:VALARM",
        `TRIGGER:-P${alarmDays}D`,
        "ACTION:DISPLAY",
        `DESCRIPTION:${escapeIcsText(event.title)}`,
        "END:VALARM",
        "END:VEVENT"
      );
    }
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function exportCalendar() {
  if (!events.length) {
    alert("请先添加事项。");
    return;
  }

  const blob = new Blob([buildIcs()], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "纪念日提醒.ics";
  link.click();
  URL.revokeObjectURL(url);
}

document.querySelectorAll("input[name='dateType']").forEach((input) => {
  input.addEventListener("change", () => {
    const isLunar = input.value === "lunar" && input.checked;
    lunarFields.hidden = !isLunar;
    solarFields.hidden = isLunar;
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    const reminder = buildEventFromForm();
    events.push(reminder);
    saveEvents();
    resetForm();
    renderEvents();
    checkDueReminders();
  } catch (error) {
    alert(error.message);
  }
});

exportButton.addEventListener("click", exportCalendar);
notifyButton.addEventListener("click", requestNotificationPermission);

populateLunarFields();
updateToday();
renderEvents();
checkDueReminders();
setInterval(checkDueReminders, 60 * 60 * 1000);
