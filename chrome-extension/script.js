const SCENERIES = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=3840&h=2160&q=90",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=3840&h=2160&q=90",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=3840&h=2160&q=90",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=3840&h=2160&q=90",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=3840&h=2160&q=90",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=3840&h=2160&q=90",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=3840&h=2160&q=90",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=3840&h=2160&q=90",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=3840&h=2160&q=90",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=3840&h=2160&q=90",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=3840&h=2160&q=90",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=3840&h=2160&q=90",
  "https://images.unsplash.com/photo-1498855926480-d98e83099315?auto=format&fit=crop&w=3840&h=2160&q=90",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=3840&h=2160&q=90",
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=3840&h=2160&q=90",
  "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=3840&h=2160&q=90"
];

const GITA_START_KEY = "euphoricGitaStartDate";

const QUOTES = [
  { text: "Lesson 1 — Do your duty with full heart, but do not attach your peace to the result.", author: "Bhagavad Gita 2.47" },
  { text: "Lesson 2 — Be steady in success and failure. Balance itself is yoga.", author: "Bhagavad Gita 2.48" },
  { text: "Lesson 3 — A calm mind can face pain and pleasure without losing itself.", author: "Bhagavad Gita 2.14" },
  { text: "Lesson 4 — The soul is not born and does not die; your true self is deeper than fear.", author: "Bhagavad Gita 2.20" },
  { text: "Lesson 5 — Anger clouds judgment. Protect your mind before it controls your actions.", author: "Bhagavad Gita 2.63" },
  { text: "Lesson 6 — A disciplined mind becomes your friend; an uncontrolled mind becomes your enemy.", author: "Bhagavad Gita 6.5" },
  { text: "Lesson 7 — Act with sincerity, not ego. Let the work purify you.", author: "Bhagavad Gita 3.19" },
  { text: "Lesson 8 — Whatever you do, offer it with devotion and humility.", author: "Bhagavad Gita 9.27" },
  { text: "Lesson 9 — Even a small sincere step on the right path protects you from great fear.", author: "Bhagavad Gita 2.40" },
  { text: "Lesson 10 — Lift yourself by yourself. Your growth begins with your own effort.", author: "Bhagavad Gita 6.5" },
  { text: "Lesson 11 — When the mind is peaceful, wisdom becomes clear.", author: "Bhagavad Gita 2.65" },
  { text: "Lesson 12 — Let go of restless desires; inner contentment is real wealth.", author: "Bhagavad Gita 2.55" },
  { text: "Lesson 13 — The wise see the same divine presence in all beings.", author: "Bhagavad Gita 5.18" },
  { text: "Lesson 14 — Do not run from your path because it is difficult. Your own path is sacred.", author: "Bhagavad Gita 3.35" },
  { text: "Lesson 15 — Food, sleep, work, and rest should be balanced. Balance supports yoga.", author: "Bhagavad Gita 6.17" },
  { text: "Lesson 16 — Devotion can be simple: a leaf, a flower, a fruit, or water offered with love.", author: "Bhagavad Gita 9.26" },
  { text: "Lesson 17 — The person who is free from hatred and full of compassion is dear to the Divine.", author: "Bhagavad Gita 12.13" },
  { text: "Lesson 18 — Surrender your worries to the Divine and move forward with trust.", author: "Bhagavad Gita 18.66" }
];

const TASKS_KEY = "euphoricTasks";
const RANDOM_SEED_KEY = "euphoricRandomSeed";

const background = document.getElementById("background");
const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const quoteEl = document.getElementById("quote");
const authorEl = document.getElementById("author");
const tasksToggle = document.getElementById("tasksToggle");
const tasksCount = document.getElementById("tasksCount");
const tasksSummary = document.getElementById("tasksSummary");
const tasksPanel = document.getElementById("tasksPanel");
const tasksBackdrop = document.getElementById("tasksBackdrop");
const tasksClose = document.getElementById("tasksClose");
const taskForm = document.getElementById("taskForm");
const taskText = document.getElementById("taskText");
const taskTime = document.getElementById("taskTime");
const taskError = document.getElementById("taskError");
const taskList = document.getElementById("taskList");
const testNotification = document.getElementById("testNotification");

let activeDailyKey = "";
let activeBackgroundUrl = "";
let tasks = [];

const hasChromeStorage = Boolean(globalThis.chrome?.storage?.local);
const hasChromeAlarms = Boolean(globalThis.chrome?.alarms);
const hasChromeRuntime = Boolean(globalThis.chrome?.runtime?.sendMessage);

function getLocalDailyKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getGitaLessonIndex(today = new Date()) {
  const todayKey = getLocalDailyKey(today);
  let startKey = localStorage.getItem(GITA_START_KEY);

  if (!startKey) {
    startKey = todayKey;
    localStorage.setItem(GITA_START_KEY, startKey);
  }

  const startDate = new Date(`${startKey}T00:00:00`);
  const todayDate = new Date(`${todayKey}T00:00:00`);
  const diffDays = Math.max(0, Math.floor((todayDate - startDate) / 86400000));
  return diffDays % QUOTES.length;
}


function getRandomSeed() {
  let seed = localStorage.getItem(RANDOM_SEED_KEY);
  if (!seed) {
    seed = `${Date.now()}-${Math.random().toString(36).slice(2)}-${crypto?.randomUUID?.() || ""}`;
    localStorage.setItem(RANDOM_SEED_KEY, seed);
  }
  return seed;
}

function hashString(value) {
  let hash = 2166136261;
  const text = String(value);
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededIndex(key, length, salt = "") {
  if (!length) return 0;
  return hashString(`${getRandomSeed()}-${key}-${salt}`) % length;
}

function setDailyContent(force = false) {
  const today = new Date();
  const dailyKey = getLocalDailyKey(today);
  if (!force && dailyKey === activeDailyKey) return;

  activeDailyKey = dailyKey;

  // Random per browser/user, but stable for the whole day.
  // This means every user can see different scenery + lesson, and it changes daily.
  const sceneryIndex = seededIndex(dailyKey, SCENERIES.length, "scenery");
  const quoteIndex = seededIndex(dailyKey, QUOTES.length, "quote");

  setBackground(sceneryIndex);
  setQuote(quoteIndex);
}

function setBackground(index) {
  const safeIndex = ((index % SCENERIES.length) + SCENERIES.length) % SCENERIES.length;
  const url = SCENERIES[safeIndex];
  if (url === activeBackgroundUrl) return;

  const image = new Image();
  activeBackgroundUrl = url;
  background.classList.add("is-loading");

  image.onload = () => {
    background.style.backgroundImage = `url("${url}")`;
    window.setTimeout(() => background.classList.remove("is-loading"), 180);
  };
  image.onerror = () => background.classList.remove("is-loading");
  image.src = url;
}

function setQuote(index) {
  const quote = QUOTES[index];
  quoteEl.textContent = quote.text;
  authorEl.textContent = `— ${quote.author}`;
}

function updateClock() {
  const now = new Date();
  timeEl.textContent = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  dateEl.textContent = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  setDailyContent();
}

function toDatetimeLocalValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function roundUpToNextMinute(date = new Date()) {
  const rounded = new Date(date);
  rounded.setSeconds(0, 0);
  if (rounded.getTime() <= date.getTime()) rounded.setMinutes(rounded.getMinutes() + 1);
  return rounded;
}

function isSameLocalMinute(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
    && a.getHours() === b.getHours()
    && a.getMinutes() === b.getMinutes();
}

function parseReminderDueAt(value) {
  const selectedDate = new Date(value);
  const selectedTime = selectedDate.getTime();
  if (!Number.isFinite(selectedTime)) return { ok: false, error: "Choose a reminder time." };

  const now = new Date();
  const nowMs = now.getTime();

  // datetime-local has minute precision, so choosing the current minute means :00 seconds.
  // Example: at 9:03:35, selecting 9:03 becomes 9:03:00 and looks expired.
  // For a smoother UX, treat current-minute selections as the next minute automatically.
  if (isSameLocalMinute(selectedDate, now) && selectedTime <= nowMs + 10 * 1000) {
    return { ok: true, dueAt: roundUpToNextMinute(now).getTime(), adjusted: true };
  }

  if (selectedTime <= nowMs + 10 * 1000) {
    return { ok: false, error: "Pick a time at least 1 minute in the future." };
  }

  return { ok: true, dueAt: selectedTime, adjusted: false };
}

function formatTaskTime(timestamp) {
  return new Date(timestamp).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function createTaskId() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeTask(task) {
  return {
    id: String(task.id || createTaskId()),
    text: String(task.text || "Untitled task").slice(0, 90),
    dueAt: Number(task.dueAt || Date.now()),
    done: Boolean(task.done),
    desktopNotified: Boolean(task.desktopNotified),
    pageNotified: Boolean(task.pageNotified),
    createdAt: Number(task.createdAt || Date.now())
  };
}

function getStoredTasks() {
  return new Promise((resolve) => {
    if (!hasChromeStorage) {
      try { resolve(JSON.parse(localStorage.getItem(TASKS_KEY) || "[]")); }
      catch { resolve([]); }
      return;
    }
    chrome.storage.local.get([TASKS_KEY], (result) => {
      resolve(Array.isArray(result[TASKS_KEY]) ? result[TASKS_KEY] : []);
    });
  });
}

function setStoredTasks(nextTasks) {
  return new Promise((resolve) => {
    if (!hasChromeStorage) {
      localStorage.setItem(TASKS_KEY, JSON.stringify(nextTasks));
      resolve();
      return;
    }
    chrome.storage.local.set({ [TASKS_KEY]: nextTasks }, resolve);
  });
}

function getAlarmName(taskId) {
  return `task:${taskId}`;
}

function scheduleTaskAlarm(task) {
  if (!hasChromeAlarms || task.done || task.desktopNotified || task.dueAt <= Date.now()) return;
  chrome.alarms.create(getAlarmName(task.id), { when: task.dueAt });
}

function clearTaskAlarm(taskId) {
  if (!hasChromeAlarms) return;
  chrome.alarms.clear(getAlarmName(taskId));
}

function pingBackground(type, payload = {}) {
  return new Promise((resolve) => {
    if (!hasChromeRuntime) { resolve({ ok: false, error: "Chrome runtime unavailable" }); return; }
    chrome.runtime.sendMessage({ type, ...payload }, (response) => {
      if (chrome.runtime.lastError) {
        resolve({ ok: false, error: chrome.runtime.lastError.message });
        return;
      }
      resolve(response || { ok: true });
    });
  });
}

function forceReminderSweep() {
  if (!hasChromeRuntime) return;
  pingBackground("EUPHORIC_FORCE_SWEEP");
}

async function loadTasks() {
  const saved = await getStoredTasks();
  tasks = saved.map(normalizeTask).sort(sortTasks);
  renderTasks();
  tasks.forEach(scheduleTaskAlarm);
  await pingBackground("EUPHORIC_TASKS_UPDATED");
  forceReminderSweep();
}

async function saveTasks() {
  tasks = tasks.map(normalizeTask).sort(sortTasks);
  await setStoredTasks(tasks);
  renderTasks();
  pingBackground("EUPHORIC_TASKS_UPDATED");
}

function sortTasks(a, b) {
  if (a.done !== b.done) return Number(a.done) - Number(b.done);
  return a.dueAt - b.dueAt;
}

function setDefaultTaskTime() {
  const now = new Date();
  const minDate = roundUpToNextMinute(now);
  const suggestedDate = new Date(minDate.getTime() + 2 * 60 * 1000);
  taskTime.min = toDatetimeLocalValue(minDate);
  taskTime.value = toDatetimeLocalValue(suggestedDate);
}

function refreshTaskTimeMinimum() {
  const nextMinute = roundUpToNextMinute(new Date());
  taskTime.min = toDatetimeLocalValue(nextMinute);
}

function openTasksPanel() {
  tasksPanel.classList.add("is-open");
  tasksPanel.setAttribute("aria-hidden", "false");
  tasksBackdrop.hidden = false;
  refreshTaskTimeMinimum();
  window.setTimeout(() => taskText.focus(), 80);
}

function closeTasksPanel() {
  tasksPanel.classList.remove("is-open");
  tasksPanel.setAttribute("aria-hidden", "true");
  tasksBackdrop.hidden = true;
}

function renderTasks() {
  const pendingCount = tasks.filter((task) => !task.done).length;
  tasksCount.textContent = String(pendingCount);
  if (tasksSummary) tasksSummary.textContent = `${pendingCount} pending`;
  taskList.replaceChildren();

  if (!tasks.length) {
    const empty = document.createElement("p");
    empty.className = "empty-tasks";
    empty.textContent = "No tasks yet. Add one and let Euphoric send a tiny butterfly reminder to your laptop screen.";
    taskList.append(empty);
    return;
  }

  tasks.forEach((task) => {
    const item = document.createElement("article");
    item.className = `task-item${task.done ? " is-done" : ""}`;

    const check = document.createElement("button");
    check.className = "task-check";
    check.type = "button";
    check.textContent = "✓";
    check.setAttribute("aria-label", task.done ? "Mark task as pending" : "Mark task as done");
    check.addEventListener("click", () => toggleTaskDone(task.id));

    const content = document.createElement("div");
    const title = document.createElement("p");
    title.className = "task-title";
    title.textContent = task.text;

    const meta = document.createElement("p");
    meta.className = "task-meta";
    meta.textContent = formatTaskTime(task.dueAt);
    content.append(title, meta);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-task";
    deleteButton.type = "button";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", "Delete task");
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    item.append(check, content, deleteButton);
    taskList.append(item);
  });
}

async function addTask(event) {
  event.preventDefault();
  taskError.textContent = "";

  const text = taskText.value.trim();
  const parsedDue = parseReminderDueAt(taskTime.value);

  if (!text) { taskError.textContent = "Write a task first."; return; }
  if (!parsedDue.ok) { taskError.textContent = parsedDue.error; return; }
  const dueAt = parsedDue.dueAt;

  const task = normalizeTask({
    id: createTaskId(),
    text,
    dueAt,
    done: false,
    desktopNotified: false,
    pageNotified: false,
    createdAt: Date.now()
  });

  tasks.push(task);
  await saveTasks();
  scheduleTaskAlarm(task);

  taskText.value = "";
  setDefaultTaskTime();
  taskError.textContent = parsedDue.adjusted
    ? `Added for ${formatTaskTime(dueAt)}. I moved it to the next minute because the selected minute had already started.`
    : `Added for ${formatTaskTime(dueAt)}.`;
  taskText.focus();
}

async function toggleTaskDone(taskId) {
  const task = tasks.find((item) => item.id === taskId);
  if (!task) return;

  task.done = !task.done;
  if (task.done) {
    clearTaskAlarm(task.id);
  } else if (task.dueAt > Date.now()) {
    task.desktopNotified = false;
    task.pageNotified = false;
    scheduleTaskAlarm(task);
  }
  await saveTasks();
}

async function deleteTask(taskId) {
  clearTaskAlarm(taskId);
  tasks = tasks.filter((task) => task.id !== taskId);
  await saveTasks();
}

async function requestTestNotification() {
  if (testNotification) testNotification.textContent = "Testing...";
  taskError.textContent = "Sending to desktop companion...";

  const result = await pingBackground("EUPHORIC_TEST_NOTIFICATION");

  if (result?.ok) {
    taskError.textContent = "Sent. Look at the top-right of your laptop screen.";
    if (testNotification) testNotification.textContent = "Sent ✓";
  } else {
    const id = globalThis.chrome?.runtime?.id ? ` Extension ID: ${chrome.runtime.id}` : "";
    taskError.textContent = `${result?.error || "Desktop companion connection failed. Run RESET_AND_INSTALL_COMPANION.bat and restart Chrome."}${id}`;
    if (testNotification) testNotification.textContent = "Fix needed";
  }

  window.setTimeout(() => {
    if (testNotification) testNotification.textContent = "Test logo butterfly";
  }, 5200);
}

setDailyContent(true);
updateClock();
setDefaultTaskTime();
loadTasks();
forceReminderSweep();
window.setInterval(forceReminderSweep, 10000);
setInterval(updateClock, 1000);
setInterval(refreshTaskTimeMinimum, 15000);

if (window.location.hash === "#tasks") window.setTimeout(openTasksPanel, 250);

tasksToggle.addEventListener("click", openTasksPanel);
tasksClose.addEventListener("click", closeTasksPanel);
tasksBackdrop.addEventListener("click", closeTasksPanel);
taskForm.addEventListener("submit", addTask);
testNotification?.addEventListener("click", requestTestNotification);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeTasksPanel();
});

// v7.2 Spotify + Focus Mode
const SPOTIFY_KEY = "euphoricSpotify";
const FOCUS_KEY = "euphoricFocus";
const musicToggle = document.getElementById("musicToggle");
const musicPanel = document.getElementById("musicPanel");
const musicClose = document.getElementById("musicClose");
const spotifyClientId = document.getElementById("spotifyClientId");
const spotifyConnect = document.getElementById("spotifyConnect");
const spotifyRefresh = document.getElementById("spotifyRefresh");
const spotifyDisconnect = document.getElementById("spotifyDisconnect");
const spotifyPrev = document.getElementById("spotifyPrev");
const spotifyPlay = document.getElementById("spotifyPlay");
const spotifyNext = document.getElementById("spotifyNext");
const spotifyTitle = document.getElementById("spotifyTitle");
const spotifyArtist = document.getElementById("spotifyArtist");
const spotifyArt = document.getElementById("spotifyArt");
const spotifyHelp = document.getElementById("spotifyHelp");
const focusToggle = document.getElementById("focusToggle");
const focusPanel = document.getElementById("focusPanel");
const focusClose = document.getElementById("focusClose");
const focusTime = document.getElementById("focusTime");
const focusModeLabel = document.getElementById("focusModeLabel");
const focusCycle = document.getElementById("focusCycle");
const focusMinutes = document.getElementById("focusMinutes");
const breakMinutes = document.getElementById("breakMinutes");
const focusStart = document.getElementById("focusStart");
const focusPause = document.getElementById("focusPause");
const focusReset = document.getElementById("focusReset");
let spotifyState = {};
let focusState = { mode: "focus", running: false, remaining: 1500, focusMinutes: 25, breakMinutes: 5, cycle: 1, lastTick: 0 };

function openMiniPanel(panel) {
  [musicPanel, focusPanel, tasksPanel].forEach((item) => {
    if (item && item !== panel) {
      item.classList.remove("is-open");
      item.setAttribute("aria-hidden", "true");
    }
  });
  if (panel) { panel.classList.add("is-open"); panel.setAttribute("aria-hidden", "false"); }
}
function closeMiniPanel(panel) { panel?.classList.remove("is-open"); panel?.setAttribute("aria-hidden", "true"); }
function getSpotifyState() { try { return JSON.parse(localStorage.getItem(SPOTIFY_KEY) || "{}"); } catch { return {}; } }
function saveSpotifyState(next) { spotifyState = { ...spotifyState, ...next }; localStorage.setItem(SPOTIFY_KEY, JSON.stringify(spotifyState)); }
function base64UrlEncode(bytes) { return btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, ""); }
async function sha256(value) { return crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)); }
function randomString(length = 64) { const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"; const values = new Uint8Array(length); crypto.getRandomValues(values); return Array.from(values, (v) => chars[v % chars.length]).join(""); }
function getSpotifyRedirectUrl() { return chrome?.identity?.getRedirectURL ? chrome.identity.getRedirectURL("spotify") : `${location.origin}/spotify`; }

async function connectSpotify() {
  const clientId = spotifyClientId.value.trim();
  if (!clientId) { spotifyHelp.textContent = "Paste your Spotify Client ID first."; return; }
  const redirectUri = getSpotifyRedirectUrl();
  const verifier = randomString(64);
  const challenge = base64UrlEncode(await sha256(verifier));
  const state = randomString(16);
  saveSpotifyState({ clientId, verifier, state, redirectUri });
  const scopes = ["user-read-currently-playing", "user-read-playback-state", "user-modify-playback-state"].join(" ");
  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", scopes);
  authUrl.searchParams.set("code_challenge_method", "S256");
  authUrl.searchParams.set("code_challenge", challenge);
  authUrl.searchParams.set("state", state);
  spotifyHelp.textContent = `Add this Redirect URL in Spotify Dashboard: ${redirectUri}`;
  if (!chrome?.identity?.launchWebAuthFlow) { spotifyHelp.textContent = "Chrome identity API unavailable. Reinstall/reload extension."; return; }
  try {
    const responseUrl = await chrome.identity.launchWebAuthFlow({ url: authUrl.toString(), interactive: true });
    const redirected = new URL(responseUrl);
    const code = redirected.searchParams.get("code");
    const returnedState = redirected.searchParams.get("state");
    if (!code || returnedState !== state) throw new Error("Spotify login cancelled or state mismatch.");
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: clientId, grant_type: "authorization_code", code, redirect_uri: redirectUri, code_verifier: verifier })
    });
    const token = await tokenResponse.json();
    if (!tokenResponse.ok) throw new Error(token.error_description || token.error || "Token error");
    saveSpotifyState({ accessToken: token.access_token, refreshToken: token.refresh_token, expiresAt: Date.now() + token.expires_in * 1000 });
    spotifyHelp.textContent = "Spotify connected.";
    await refreshSpotifyNowPlaying();
  } catch (error) {
    spotifyHelp.textContent = `${error.message}. Make sure Redirect URL is allowlisted in Spotify Dashboard.`;
  }
}
async function getSpotifyAccessToken() {
  spotifyState = getSpotifyState();
  if (!spotifyState.accessToken) return null;
  if (spotifyState.expiresAt && Date.now() < spotifyState.expiresAt - 60000) return spotifyState.accessToken;
  if (!spotifyState.refreshToken || !spotifyState.clientId) return spotifyState.accessToken;
  const res = await fetch("https://accounts.spotify.com/api/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: spotifyState.clientId, grant_type: "refresh_token", refresh_token: spotifyState.refreshToken }) });
  const token = await res.json();
  if (!res.ok) return spotifyState.accessToken;
  saveSpotifyState({ accessToken: token.access_token, refreshToken: token.refresh_token || spotifyState.refreshToken, expiresAt: Date.now() + token.expires_in * 1000 });
  return token.access_token;
}
async function spotifyFetch(path, options = {}) {
  const token = await getSpotifyAccessToken();
  if (!token) { spotifyHelp.textContent = "Connect Spotify first."; return null; }
  const res = await fetch(`https://api.spotify.com/v1${path}`, { ...options, headers: { Authorization: `Bearer ${token}`, ...(options.headers || {}) } });
  if (res.status === 204) return {};
  if (!res.ok) { spotifyHelp.textContent = res.status === 403 ? "Spotify Premium/active device may be required for controls." : `Spotify error ${res.status}`; return null; }
  return res.json();
}
async function refreshSpotifyNowPlaying() {
  const data = await spotifyFetch("/me/player/currently-playing");
  if (!data || !data.item) { spotifyTitle.textContent = "Nothing playing"; spotifyArtist.textContent = "Start Spotify on phone/desktop, then refresh."; spotifyArt.textContent = "♫"; return; }
  spotifyTitle.textContent = data.item.name || "Unknown track";
  spotifyArtist.textContent = (data.item.artists || []).map((a) => a.name).join(", ") || "Spotify";
  const image = data.item.album?.images?.[0]?.url;
  spotifyArt.innerHTML = image ? `<img src="${image}" alt="">` : "♫";
  spotifyPlay.textContent = data.is_playing ? "Pause" : "Play";
}
async function spotifyCommand(command) {
  if (command === "previous") await spotifyFetch("/me/player/previous", { method: "POST" });
  if (command === "next") await spotifyFetch("/me/player/next", { method: "POST" });
  if (command === "toggle") {
    const state = await spotifyFetch("/me/player");
    await spotifyFetch(state?.is_playing ? "/me/player/pause" : "/me/player/play", { method: "PUT" });
  }
  setTimeout(refreshSpotifyNowPlaying, 500);
}
function disconnectSpotify() { localStorage.removeItem(SPOTIFY_KEY); spotifyState = {}; spotifyTitle.textContent = "Connect Spotify"; spotifyArtist.textContent = "Control your active Spotify session here."; spotifyArt.textContent = "♫"; spotifyHelp.textContent = "Logged out."; }
function loadSpotifyUI() { spotifyState = getSpotifyState(); if (spotifyState.clientId) spotifyClientId.value = spotifyState.clientId; spotifyHelp.textContent = `Redirect URL: ${getSpotifyRedirectUrl()}`; if (spotifyState.accessToken) refreshSpotifyNowPlaying(); }

function formatFocusTime(seconds) { const min = Math.floor(seconds / 60); const sec = seconds % 60; return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`; }
function saveFocusState() { localStorage.setItem(FOCUS_KEY, JSON.stringify(focusState)); }
function loadFocusState() { try { focusState = { ...focusState, ...JSON.parse(localStorage.getItem(FOCUS_KEY) || "{}") }; } catch {} focusMinutes.value = focusState.focusMinutes; breakMinutes.value = focusState.breakMinutes; renderFocus(); }
function renderFocus() { focusTime.textContent = formatFocusTime(Math.max(0, focusState.remaining)); focusModeLabel.textContent = focusState.mode === "focus" ? "Focus" : "Break"; focusCycle.textContent = focusState.mode === "focus" ? `Pomodoro ${focusState.cycle}` : "Rest gently"; focusStart.textContent = focusState.running ? "Running" : "Start"; }
function syncFocusInputs() { focusState.focusMinutes = Math.max(1, Number(focusMinutes.value || 25)); focusState.breakMinutes = Math.max(1, Number(breakMinutes.value || 5)); if (!focusState.running) focusState.remaining = (focusState.mode === "focus" ? focusState.focusMinutes : focusState.breakMinutes) * 60; saveFocusState(); renderFocus(); }
function setFocusPreset(focus, brk) { focusState.focusMinutes = focus; focusState.breakMinutes = brk; focusState.mode = "focus"; focusState.running = false; focusState.remaining = focus * 60; focusMinutes.value = focus; breakMinutes.value = brk; saveFocusState(); renderFocus(); }
function startFocus() { syncFocusInputs(); focusState.running = true; focusState.lastTick = Date.now(); saveFocusState(); renderFocus(); }
function pauseFocus() { focusState.running = false; saveFocusState(); renderFocus(); }
function resetFocus() { focusState.running = false; focusState.mode = "focus"; focusState.remaining = focusState.focusMinutes * 60; saveFocusState(); renderFocus(); }
function completeFocusRound() {
  const wasFocus = focusState.mode === "focus";
  focusState.mode = wasFocus ? "break" : "focus";
  if (!wasFocus) focusState.cycle += 1;
  focusState.remaining = (focusState.mode === "focus" ? focusState.focusMinutes : focusState.breakMinutes) * 60;
  focusState.running = false;
  saveFocusState();
  renderFocus();
  if (typeof sendNativeButterfly === "function") {
    sendNativeButterfly({ taskId: `focus-${Date.now()}`, title: wasFocus ? "Focus complete" : "Break complete", text: wasFocus ? "Focus session done. Take a calm break." : "Break done. Ready for the next focus round?", dueAt: Date.now() });
  }
}
function tickFocus() { if (!focusState.running) return; const now = Date.now(); const elapsed = Math.max(1, Math.floor((now - focusState.lastTick) / 1000)); focusState.lastTick = now; focusState.remaining -= elapsed; if (focusState.remaining <= 0) { focusState.remaining = 0; completeFocusRound(); return; } saveFocusState(); renderFocus(); }

musicToggle?.addEventListener("click", () => { openMiniPanel(musicPanel); loadSpotifyUI(); });
musicClose?.addEventListener("click", () => closeMiniPanel(musicPanel));
spotifyConnect?.addEventListener("click", connectSpotify);
spotifyRefresh?.addEventListener("click", refreshSpotifyNowPlaying);
spotifyDisconnect?.addEventListener("click", disconnectSpotify);
spotifyPrev?.addEventListener("click", () => spotifyCommand("previous"));
spotifyPlay?.addEventListener("click", () => spotifyCommand("toggle"));
spotifyNext?.addEventListener("click", () => spotifyCommand("next"));
focusToggle?.addEventListener("click", () => { openMiniPanel(focusPanel); renderFocus(); });
focusClose?.addEventListener("click", () => closeMiniPanel(focusPanel));
focusStart?.addEventListener("click", startFocus);
focusPause?.addEventListener("click", pauseFocus);
focusReset?.addEventListener("click", resetFocus);
focusMinutes?.addEventListener("change", syncFocusInputs);
breakMinutes?.addEventListener("change", syncFocusInputs);
document.querySelectorAll("[data-preset]").forEach((button) => button.addEventListener("click", () => { const [f, b] = button.dataset.preset.split(",").map(Number); setFocusPreset(f, b); }));
loadSpotifyUI();
loadFocusState();
setInterval(tickFocus, 1000);

/* =========================================================
   Euphoric Auto Shortcuts
   Shows most visited + recent websites automatically.
   ========================================================= */

const AUTO_SHORTCUT_LIMIT = 8;
const shortcutsEl = document.getElementById("shortcuts");
const shortcutsNote = document.getElementById("shortcutsNote");

function shortcutInitial(title, url) {
  const text = String(title || getHostName(url) || "?").trim();
  return text.charAt(0).toUpperCase();
}

function getHostName(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function cleanShortcutTitle(title, url) {
  const host = getHostName(url);
  const value = String(title || host || "Website")
    .replace(/\s[-|–—]\s.*$/, "")
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .trim();

  return value.length > 18 ? value.slice(0, 17).trim() + "…" : value;
}

function escapeShortcutText(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isGoodShortcutUrl(url) {
  if (!url) return false;
  if (!/^https?:\/\//i.test(url)) return false;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
    if (!parsed.hostname.includes(".")) return false;
    return true;
  } catch {
    return false;
  }
}

function uniqueByHost(items) {
  const seen = new Set();
  const result = [];

  for (const item of items) {
    if (!isGoodShortcutUrl(item.url)) continue;

    const host = getHostName(item.url);
    if (!host || seen.has(host)) continue;

    seen.add(host);
    result.push(item);

    if (result.length >= AUTO_SHORTCUT_LIMIT) break;
  }

  return result;
}

function renderAutoShortcuts(items) {
  if (!shortcutsEl) return;

  const shortcuts = uniqueByHost(items);

  shortcutsEl.innerHTML = shortcuts.map((item) => {
    const title = cleanShortcutTitle(item.title, item.url);
    const icon = shortcutInitial(title, item.url);

    return `
      <a class="shortcut-item" href="${escapeShortcutText(item.url)}" title="${escapeShortcutText(title)}">
        <span class="shortcut-icon">${escapeShortcutText(icon)}</span>
        <span class="shortcut-name">${escapeShortcutText(title)}</span>
      </a>
    `;
  }).join("");

  if (shortcuts.length > 0) {
    shortcutsEl.classList.add("has-items");
    if (shortcutsNote) shortcutsNote.textContent = "";
  } else if (shortcutsNote) {
    shortcutsNote.textContent = "Shortcuts will appear after Chrome has enough recent/visited sites.";
  }
}

function getTopSites() {
  return new Promise((resolve) => {
    if (!chrome?.topSites?.get) return resolve([]);

    chrome.topSites.get((sites) => {
      resolve(Array.isArray(sites) ? sites : []);
    });
  });
}

function getRecentHistory() {
  return new Promise((resolve) => {
    if (!chrome?.history?.search) return resolve([]);

    chrome.history.search({
      text: "",
      startTime: Date.now() - 1000 * 60 * 60 * 24 * 14,
      maxResults: 20
    }, (items) => {
      resolve(Array.isArray(items) ? items : []);
    });
  });
}

async function loadAutoShortcuts() {
  if (!shortcutsEl) return;

  try {
    const [topSites, recentSites] = await Promise.all([
      getTopSites(),
      getRecentHistory()
    ]);

    renderAutoShortcuts([...topSites, ...recentSites]);
  } catch {
    if (shortcutsNote) {
      shortcutsNote.textContent = "Enable topSites/history permission and reload Euphoric.";
    }
  }
}

loadAutoShortcuts();
