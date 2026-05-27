const $ = (id) => document.getElementById(id);
const UNSPLASH_ACCESS_KEY = "76wYD0-yqlMb_ejB2o1MBgPPpppZtlNCZM3SJ9o-uuc"; // <-- replace

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

async function setDailyScenery() {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // use cached image for the day (avoids hitting API repeatedly)
  const cached = await chrome.storage.local.get(["dailyScenery"]);
  if (cached.dailyScenery?.date === today && cached.dailyScenery?.url) {
    applyScenery(cached.dailyScenery);
    return;
  }

  // Scenery-only queries
  const query = "scenery,nature,landscape,mountains,ocean,forest";
  const endpoint =
    `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}` +
    `&orientation=landscape&content_filter=high`;

  try {
    const res = await fetch(endpoint, {
      headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` }
    });
    if (!res.ok) throw new Error("Unsplash request failed");

    const data = await res.json();

    const scenery = {
      date: today,
      url: data.urls?.regular,               // image url
      author: data.user?.name || "Unsplash",
      authorUrl: data.user?.links?.html,     // attribution link
      photoUrl: data.links?.html             // photo page link
    };

    await chrome.storage.local.set({ dailyScenery: scenery });
    applyScenery(scenery);
  } catch (e) {
    // fallback if offline / rate-limited
    document.documentElement.style.setProperty(
      "--date-bg",
      "radial-gradient(circle at 30% 20%, rgba(168,107,255,0.35), transparent 55%), radial-gradient(circle at 80% 70%, rgba(255,120,183,0.25), transparent 55%)"
    );
    const credit = document.getElementById("photoCredit");
    if (credit) credit.textContent = "";
  }
}

function applyScenery(scenery) {
  // your date card uses --date-bg in CSS
  document.documentElement.style.setProperty("--bg-photo", `url("${scenery.url}")`);

  // attribution
  const credit = document.getElementById("photoCredit");
  if (credit) {
    credit.textContent = `Photo: ${scenery.author} (Unsplash)`;
    credit.href = scenery.photoUrl || scenery.authorUrl || "https://unsplash.com";
  }
}
setDailyScenery();
