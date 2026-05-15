/* global document, Office, localStorage, fetch */

Office.onReady(() => {
  const savedKey = localStorage.getItem("openai_api_key");
  if (savedKey) {
    document.getElementById("api-key").value = savedKey;
    document.getElementById("key-status").textContent = "API key loaded";
  }

  document.getElementById("save-key-btn").onclick = () => {
    const key = document.getElementById("api-key").value.trim();
    if (!key) return;
    localStorage.setItem("openai_api_key", key);
    document.getElementById("key-status").textContent = "Saved!";
    setTimeout(() => (document.getElementById("key-status").textContent = ""), 2000);
  };

  document.getElementById("parse-btn").onclick = parseEvent;
  document.getElementById("back-btn").onclick = () => showScreen("input");
  document.getElementById("confirm-btn").onclick = scheduleEvent;
});

async function parseEvent() {
  const text = document.getElementById("event-text").value.trim();
  const apiKey = document.getElementById("api-key").value.trim();

  document.getElementById("parse-error").textContent = "";

  if (!text) return setError("parse-error", "Please describe your event.");
  if (!apiKey) return setError("parse-error", "Please enter and save your OpenAI API key.");

  showScreen("loading");

  try {
    const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a calendar assistant. Extract event details from the user's message. Today is ${today}. The user's local timezone is ${timezone}. All output times should be in the user's local timezone. If no end time is mentioned, add 1 hour to start. If no date is mentioned, use today. For recurring events, pick the next occurrence date.`,
          },
          {
            role: "user",
            content: text,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "calendar_event",
            strict: true,
            schema: {
              type: "object",
              properties: {
                title:      { type: "string", description: "Event title" },
                date:       { type: "string", description: "Date in YYYY-MM-DD" },
                startTime:  { type: "string", description: "Start time in HH:MM 24h" },
                endTime:    { type: "string", description: "End time in HH:MM 24h" },
                location:   { type: "string", description: "Room, address, or meeting URL. Empty string if none." },
                recurrence: { type: "string", enum: ["none", "daily", "weekly", "monthly", "yearly"] },
                notes:      { type: "string", description: "Any extra context. Empty string if none." },
              },
              required: ["title", "date", "startTime", "endTime", "location", "recurrence", "notes"],
              additionalProperties: false,
            },
          },
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || `API error ${res.status}`);
    }

    const data = await res.json();
    const event = JSON.parse(data.choices[0].message.content); // still a string even with structured outputs

    document.getElementById("r-title").value = event.title || "";
    document.getElementById("r-date").value = event.date || today;
    document.getElementById("r-start").value = event.startTime || "";
    document.getElementById("r-end").value = event.endTime || "";
    document.getElementById("r-location").value = event.location || "";
    document.getElementById("r-recurrence").value = event.recurrence || "none";
    document.getElementById("r-notes").value = event.notes || "";

    showScreen("review");
  } catch (e) {
    showScreen("input");
    setError("parse-error", e.message);
  }
}

function scheduleEvent() {
  const title = document.getElementById("r-title").value.trim();
  const date = document.getElementById("r-date").value;
  const startTime = document.getElementById("r-start").value;
  const endTime = document.getElementById("r-end").value;
  const location = document.getElementById("r-location").value.trim();
  const notes = document.getElementById("r-notes").value.trim();

  document.getElementById("review-error").textContent = "";

  if (!title) return setError("review-error", "Title is required.");
  if (!date) return setError("review-error", "Date is required.");
  if (!startTime) return setError("review-error", "Start time is required.");

  const start = new Date(`${date}T${startTime}`);
  const end = endTime ? new Date(`${date}T${endTime}`) : new Date(start.getTime() + 60 * 60 * 1000);

  Office.context.mailbox.displayNewAppointmentForm({
    subject: title,
    start: start,
    end: end,
    location: location,
    body: notes,
    requiredAttendees: [],
    optionalAttendees: [],
  });
}

function showScreen(name) {
  document.getElementById("input-screen").style.display = name === "input" ? "flex" : "none";
  document.getElementById("loading-screen").style.display = name === "loading" ? "flex" : "none";
  document.getElementById("review-screen").style.display = name === "review" ? "flex" : "none";
}

function setError(id, msg) {
  document.getElementById(id).textContent = msg;
}
