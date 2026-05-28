const params = new URLSearchParams(location.search);
const taskId = params.get("task");
const textParam = params.get("text");
const isTest = params.get("test") === "1";

const taskText = document.getElementById("taskText");
const taskTime = document.getElementById("taskTime");
const doneButton = document.getElementById("doneButton");
const snoozeButton = document.getElementById("snoozeButton");
const closeButton = document.getElementById("closeButton");
const taskActions = document.getElementById("taskActions");

function formatTaskTime(timestamp) {
  return new Date(timestamp).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function sendMessage(message) {
  return new Promise((resolve) => {
    if (!globalThis.chrome?.runtime?.sendMessage) {
      resolve({ ok: false });
      return;
    }
    chrome.runtime.sendMessage(message, (response) => {
      chrome.runtime.lastError;
      resolve(response || { ok: false });
    });
  });
}

async function load() {
  if (isTest || !taskId) {
    taskText.textContent = textParam || "This is a test reminder.";
    taskTime.textContent = "Compact fallback popup";
    taskActions.style.display = "none";
    return;
  }

  const response = await sendMessage({ type: "EUPHORIC_GET_TASK", taskId });
  const task = response?.task;
  if (!task) {
    taskText.textContent = "This reminder was already completed.";
    taskTime.textContent = "Euphoric";
    taskActions.style.display = "none";
    return;
  }

  taskText.textContent = task.text;
  taskTime.textContent = formatTaskTime(task.dueAt);
}

async function markDone() {
  if (taskId) await sendMessage({ type: "EUPHORIC_MARK_DONE", taskId });
  window.close();
}

async function snooze() {
  if (taskId) await sendMessage({ type: "EUPHORIC_SNOOZE", taskId, minutes: 10 });
  window.close();
}

doneButton.addEventListener("click", markDone);
snoozeButton.addEventListener("click", snooze);
closeButton.addEventListener("click", () => window.close());
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") window.close();
});

load();
