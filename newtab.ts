const $ = (id) => document.getElementById(id);

const hhEl = $("hh");
const mmEl = $("mm");
const ampmEl = $("ampm");
const dateEl = $("date");
const quoteEl = $("quote");

// curated short quotes (you can expand this later)
const QUOTES = [
  "Just when you think it can't get any worse, it can. And just when you think it can't get any better, it can.",
  "Small steps, repeated daily, become extraordinary results.",
  "Focus on the next minute. The hours will follow.",
  "Consistency beats intensity when it’s repeated.",
  "Make it easy to start. Make it satisfying to finish."
];

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatDate(d) {
  // Example: May 13
  return new Intl.DateTimeFormat(undefined, { month: "long", day: "numeric" }).format(d);
}

function tick() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();

  // 12-hour format like your wireframe
  const isPM = hours >= 12;
  const ampm = isPM ? "PM" : "AM";
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;

  hhEl.textContent = pad2(hours);
  mmEl.textContent = pad2(minutes);
  ampmEl.textContent = ampm;

  dateEl.textContent = formatDate(now);
}

function pickQuote() {
  const idx = Math.floor(Math.random() * QUOTES.length);
  quoteEl.textContent = QUOTES[idx];
}

pickQuote();
tick();
setInterval(tick, 1000);
