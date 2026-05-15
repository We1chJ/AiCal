<p align="center">
  <img src="https://we1chj.github.io/AiCal/assets/logo.png" width="80" alt="AiCal logo" />
</p>

<h1 align="center">AiCal</h1>

<p align="center">
  An Outlook add-in that turns plain-text descriptions into calendar events — powered by GPT-4o.
</p>

---

## How it works

1. Open any email in Outlook and click **AiCal** in the ribbon
2. Describe your event in plain English — *"Team standup every Monday at 9am for 30 minutes"*
3. GPT-4o parses the details and shows a pre-filled review form
4. Click **Add to Calendar** — an `.ics` file downloads instantly
5. Double-click the file and Outlook adds the event

Supports titles, dates, start/end times, location, notes, and recurring events (daily / weekly / monthly / yearly).

---

## Installation

1. Open the Outlook sideload URL in your browser:

   **https://aka.ms/olksideload**

2. Click **My add-ins** in the left sidebar

3. Scroll to **Custom Add-ins** → **+ Add a custom add-in** → **Add from File...**

4. Upload the [`manifest.xml`](https://we1chj.github.io/AiCal/manifest.xml) from this repo

5. Accept the warning and the add-in will appear in your Outlook ribbon

---

## Setup

The add-in requires an OpenAI API key to parse events.

1. Open the add-in in Outlook
2. Expand the **OpenAI API Key** section at the bottom
3. Paste your key (`sk-...`) and click **Save**

Your key is stored locally in the browser and never sent anywhere except the OpenAI API.

---

## Development

```bash
npm install
npm run dev-server
```

To build and deploy to GitHub Pages:

```bash
npm run deploy
```

---

## Tech stack

- [Office.js](https://learn.microsoft.com/en-us/office/dev/add-ins/) — Outlook add-in runtime
- [React](https://react.dev/) + TypeScript
- [OpenAI GPT-4o-mini](https://platform.openai.com/docs) — natural language event parsing
- GitHub Pages — hosting
