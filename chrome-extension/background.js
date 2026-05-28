const TASKS_KEY = "euphoricTasks";
const SWEEP_ALARM = "euphoric-reminder-sweep";
const STARTUP_CHECK_ALARM = "euphoric-startup-check";
const NATIVE_HOST_NAME = "com.euphoric.butterfly";

function getAlarmName(taskId) {
  return `task:${taskId}`;
}

function getTaskIdFromAlarm(alarmName) {
  return alarmName.startsWith("task:") ? alarmName.slice("task:".length) : null;
}

function getTasks() {
  return new Promise((resolve) => {
    chrome.storage.local.get([TASKS_KEY], (result) => {
      resolve(Array.isArray(result[TASKS_KEY]) ? result[TASKS_KEY] : []);
    });
  });
}

function setTasks(tasks) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [TASKS_KEY]: tasks }, resolve);
  });
}

function normalizeTask(task) {
  return {
    id: String(task.id || `${Date.now()}-${Math.random()}`),
    text: String(task.text || "Untitled task").slice(0, 90),
    dueAt: Number(task.dueAt || Date.now()),
    done: Boolean(task.done),
    desktopNotified: Boolean(task.desktopNotified),
    pageNotified: Boolean(task.pageNotified),
    createdAt: Number(task.createdAt || Date.now())
  };
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

function createSweepAlarm() {
  chrome.alarms.create(SWEEP_ALARM, { delayInMinutes: 0.1, periodInMinutes: 0.5 });
}

async function scheduleFutureTasks() {
  const tasks = (await getTasks()).map(normalizeTask);
  const now = Date.now();

  tasks.forEach((task) => {
    chrome.alarms.clear(getAlarmName(task.id));
    if (!task.done && !task.desktopNotified && task.dueAt > now) {
      chrome.alarms.create(getAlarmName(task.id), { when: task.dueAt });
    }
  });
}



function sendNativeButterflyAlarm(task, isTest = false) {
  return new Promise((resolve) => {
    if (!chrome?.runtime?.sendNativeMessage) {
      resolve({ ok: false, error: "native messaging unavailable" });
      return;
    }

    const payload = {
      source: "euphoric-extension",
      type: isTest ? "test" : "reminder",
      taskId: String(task.id || "test"),
      title: isTest ? "Euphoric test alarm" : "Euphoric reminder",
      text: String(task.text || "This is your Euphoric butterfly alarm."),
      dueAt: Number(task.dueAt || Date.now()),
      createdAt: Date.now()
    };

    chrome.runtime.sendNativeMessage(NATIVE_HOST_NAME, payload, (response) => {
      if (chrome.runtime.lastError) {
        console.info("Euphoric native companion unavailable:", chrome.runtime.lastError.message);
        resolve({ ok: false, error: chrome.runtime.lastError.message });
        return;
      }

      if (!response) {
        resolve({ ok: false, error: "empty companion response" });
        return;
      }

      if (!isTest) {
        if (response.action === "done" && response.taskId) {
          markTaskDone(String(response.taskId));
        }
        if (response.action === "snooze" && response.taskId) {
          snoozeTask(String(response.taskId), Number(response.minutes || 10));
        }
      }

      resolve({ ok: response.ok !== false, response });
    });
  });
}


async function notifyTask(taskId) {
  const tasks = (await getTasks()).map(normalizeTask);
  const task = tasks.find((item) => item.id === taskId);
  if (!task || task.done || task.desktopNotified || task.dueAt > Date.now() + 2500) return;

  // v4.2: mark as notified before opening the logo butterfly companion so duplicate alarms do not appear
  // while the Euphoric logo butterfly is waiting at the top-right.
  task.desktopNotified = true;
  task.pageNotified = true;
  await setTasks(tasks);

  const nativeResult = await sendNativeButterflyAlarm(task);
  if (!nativeResult.ok) {
    console.info("Euphoric desktop companion is not connected. Run RESET_AND_INSTALL_COMPANION.bat, close all Chrome windows, then reopen Chrome.");
    task.desktopNotified = false;
    task.pageNotified = false;
    await setTasks(tasks);
  }
}

async function sweepDueTasks() {
  const tasks = (await getTasks()).map(normalizeTask);
  const now = Date.now();

  for (const task of tasks) {
    if (!task.done && !task.desktopNotified && task.dueAt <= now) {
      await notifyTask(task.id);
    }
  }
}

async function markTaskDone(taskId) {
  const tasks = (await getTasks()).map(normalizeTask);
  const task = tasks.find((item) => item.id === taskId);
  if (!task) return;

  task.done = true;
  chrome.alarms.clear(getAlarmName(taskId));
  await setTasks(tasks);
}

async function snoozeTask(taskId, minutes = 10) {
  const tasks = (await getTasks()).map(normalizeTask);
  const task = tasks.find((item) => item.id === taskId);
  if (!task) return;

  task.done = false;
  task.desktopNotified = false;
  task.pageNotified = false;
  task.dueAt = Date.now() + minutes * 60 * 1000;
  chrome.alarms.create(getAlarmName(taskId), { when: task.dueAt });
  await setTasks(tasks);
}

async function getTask(taskId) {
  const tasks = (await getTasks()).map(normalizeTask);
  return tasks.find((task) => task.id === taskId) || null;
}

async function testSystemNotification() {
  const testTask = {
    id: "test",
    text: "This is a Euphoric logo butterfly reminder test.",
    dueAt: Date.now()
  };

  const result = await sendNativeButterflyAlarm(testTask, true);
  if (!result.ok) {
    console.info("Euphoric desktop companion is not connected:", result.error || "Unknown native messaging error");
    return {
      ok: false,
      error: result.error || "Native companion did not respond. Run RESET_AND_INSTALL_COMPANION.bat, close all Chrome windows, then reopen Chrome."
    };
  }

  return { ok: true, message: "Logo butterfly sent to desktop companion." };
}

chrome.runtime.onInstalled.addListener(() => {
  createSweepAlarm();
  scheduleFutureTasks();
  chrome.alarms.create(STARTUP_CHECK_ALARM, { delayInMinutes: 0.05 });
});

chrome.runtime.onStartup.addListener(() => {
  createSweepAlarm();
  scheduleFutureTasks();
  chrome.alarms.create(STARTUP_CHECK_ALARM, { delayInMinutes: 0.05 });
  sweepDueTasks();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === SWEEP_ALARM || alarm.name === STARTUP_CHECK_ALARM) {
    sweepDueTasks();
    return;
  }

  const taskId = getTaskIdFromAlarm(alarm.name);
  if (taskId) notifyTask(taskId);
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    if (message?.type === "EUPHORIC_TASKS_UPDATED") {
      await scheduleFutureTasks();
      sendResponse({ ok: true });
      return;
    }

    if (message?.type === "EUPHORIC_FORCE_SWEEP") {
      createSweepAlarm();
      await scheduleFutureTasks();
      await sweepDueTasks();
      sendResponse({ ok: true, message: "Reminder sweep completed." });
      return;
    }

    if (message?.type === "EUPHORIC_TEST_NOTIFICATION") {
      const result = await testSystemNotification();
      sendResponse(result);
      return;
    }

    if (message?.type === "EUPHORIC_GET_TASK") {
      const task = await getTask(String(message.taskId || ""));
      sendResponse({ ok: true, task });
      return;
    }

    if (message?.type === "EUPHORIC_MARK_DONE") {
      await markTaskDone(String(message.taskId || ""));
      sendResponse({ ok: true });
      return;
    }

    if (message?.type === "EUPHORIC_SNOOZE") {
      await snoozeTask(String(message.taskId || ""), Number(message.minutes || 10));
      sendResponse({ ok: true });
      return;
    }

    sendResponse({ ok: false });
  })();
  return true;
});

// Keep the repair sweep registered whenever the service worker wakes up.
createSweepAlarm();
scheduleFutureTasks();
