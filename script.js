
const dayNames = [
  "Senin", "Selasa", "Rabu",
  "Kamis", "Jumat", "Sabtu"
];

const defaultSchedule = {
  0: [
    "Bahasa Jerman",
    "Bahasa Inggris",
    "Bahasa Indonesia",
    "Pendidikan Agama & Budi Pekerti",
    "Informatika",
    "Ekonomi"
  ],
  1: [
    "PJOK",
    "Geografi",
    "Matematika",
    "Informatika",
    "Sejarah Wajib",
    "Ekonomi"
  ],
  2: [
    "Seni Rupa",
    "Bahasa Inggris",
    "Geografi",
    "Pendidikan Agama & Budi Pekerti",
    "Bahasa Jerman",
    "BK",
    "Ekonomi"
  ],
  3: [
    "PJOK",
    "Prakarya/Kewirausahaan",
    "Bahasa Jawa",
    "Pendidikan Kewarganegaraan",
    "Matematika"
  ],
  4: [
    "Informatika",
    "Bahasa Indonesia",
    "Geografi",
    "Bahasa Jerman"
  ],
  5: []
};

let schedules;

try {
  schedules = JSON.parse(
    localStorage.getItem("mySchedule")
  );

  if (!schedules || Object.keys(schedules).length === 0) {
    schedules = JSON.parse(JSON.stringify(defaultSchedule));
  }
} catch {
  schedules = JSON.parse(JSON.stringify(defaultSchedule));
}

let selectedDay = 0;

function save() {
  localStorage.setItem(
    "mySchedule",
    JSON.stringify(schedules)
  );
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function render() {
  document.getElementById("days").innerHTML =
    dayNames.map((day, i) =>
      `<button class="day ${i === selectedDay ? "active" : ""}"
      data-day="${i}">${day}</button>`
    ).join("");

  document.getElementById("dayTitle").textContent =
    dayNames[selectedDay];

  const lessons = schedules[selectedDay] || [];
  const list = document.getElementById("lessonList");

  if (lessons.length === 0) {
    list.innerHTML =
      '<div class="empty">Belum ada mata pelajaran.</div>';
    return;
  }

  list.innerHTML = lessons.map((lesson, i) =>
    `<div class="lesson">
      <span>${i + 1}. ${escapeHTML(lesson)}</span>
      <span>
        <button data-edit="${i}">Edit</button>
        <button data-delete="${i}">Hapus</button>
      </span>
    </div>`
  ).join("");
}

document.getElementById("days").addEventListener("click", e => {
  const button = e.target.closest("[data-day]");
  if (!button) return;

  selectedDay = Number(button.dataset.day);
  render();
});

document.getElementById("addButton").addEventListener("click", () => {
  const input = document.getElementById("lessonInput");
  const name = input.value.trim();

  if (!name) {
    alert("Masukkan nama pelajaran!");
    return;
  }

  if (!schedules[selectedDay]) schedules[selectedDay] = [];

  schedules[selectedDay].push(name);
  save();
  input.value = "";
  render();
});

document.getElementById("lessonList").addEventListener("click", e => {
  const edit = e.target.closest("[data-edit]");
  const del = e.target.closest("[data-delete]");

  if (edit) {
    const i = Number(edit.dataset.edit);
    const newName = prompt(
      "Ubah mata pelajaran:",
      schedules[selectedDay][i]
    );

    if (newName && newName.trim()) {
      schedules[selectedDay][i] = newName.trim();
      save();
      render();
    }
  }

  if (del) {
    const i = Number(del.dataset.delete);

    if (confirm("Hapus mata pelajaran ini?")) {
      schedules[selectedDay].splice(i, 1);
      save();
      render();
    }
  }
});

render();
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {
  const keyword = searchInput.value.toLowerCase();

  document.querySelectorAll(".lesson").forEach(function (lesson) {
    const text = lesson.textContent.toLowerCase();

    lesson.style.display = text.includes(keyword) ? "flex" : "none";
  });
});
const themeButton = document.getElementById("themeButton");

themeButton.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    themeButton.textContent = "☀️ Mode Terang";
  } else {
    themeButton.textContent = "🌙 Mode Gelap";
  }
});
function updateStatistics() {
  const allLessons = Object.values(schedule || {}).flat();

  const uniqueSubjects = new Set(
    allLessons.map(item =>
      typeof item === "string"
        ? item.toLowerCase()
        : String(item.name || "").toLowerCase()
    )
  );

  const activeDays = Object.values(schedule || {})
    .filter(day => Array.isArray(day) && day.length > 0).length;

  document.getElementById("subjectCount").textContent =
    uniqueSubjects.size;

  document.getElementById("dayCount").textContent =
    activeDays;

  document.getElementById("totalCount").textContent =
    allLessons.length;
}

updateStatistics();
const todayDate = document.getElementById("todayDate");

if (todayDate) {
  todayDate.textContent = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}
function updateGreeting() {
  const hour = new Date().getHours();
  const greeting = document.getElementById("greetingText");

  if (!greeting) return;

  if (hour >= 4 && hour < 11) {
    greeting.textContent = "☀️ Selamat pagi! Semangat belajar!";
  } else if (hour >= 11 && hour < 15) {
    greeting.textContent = "🌤️ Selamat siang! Tetap semangat!";
  } else if (hour >= 15 && hour < 18) {
    greeting.textContent = "🌇 Selamat sore! Jangan lupa istirahat!";
  } else {
    greeting.textContent = "🌙 Selamat malam! Selamat beristirahat!";
  }
}

updateGreeting();
  
