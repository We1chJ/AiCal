<p align="center">
  <img src="assets/aicon-aurora-256.png" width="80" alt="AiCal logo" />
</p>

<h1 align="center">AiCal</h1>

<p align="center">
  An Outlook add-in that turns plain-text descriptions into calendar events — powered by free AI models via OpenRouter.
</p>

---

## How it works

1. Open any email in Outlook — the **AiCal** button appears in the ribbon
2. Click it to open the side panel
3. Type or paste in your event text — *"Team standup every Monday at 9am for 30 minutes"*
4. An AI model parses the details and shows a pre-filled review form you can edit
5. Click **Add to Calendar** — Outlook's appointment form opens pre-filled, click Save to add it

Supports titles, dates, start/end times, location, notes, and recurring events (daily / weekly / monthly / yearly).

---

## Installation

1. Open the Outlook sideload URL in your browser:

   **https://aka.ms/olksideload**

2. Click **My add-ins** in the left sidebar

3. Scroll to **Custom Add-ins** → **+ Add a custom add-in** → **Add from URL...**

4. Paste this URL:
   ```
   https://we1chj.github.io/AiCal/manifest.xml
   ```

5. Accept the warning — AiCal will appear in your Outlook ribbon

---

## Setup

AiCal uses [OpenRouter](https://openrouter.ai) to parse events — **free models are available with no per-token cost.**

1. Sign up at [openrouter.ai](https://openrouter.ai) (free)
2. Go to **Dashboard → API Keys → Create Key**
3. Open the add-in in Outlook
4. Expand the **OpenRouter API Key** section at the bottom
5. Paste your key (`sk-or-...`) and click **Save**

Your key is stored locally in the browser and never sent anywhere except the OpenRouter API.

---

## AI Models

AiCal automatically rotates through a list of free OpenRouter models. If one hits a rate limit, it silently switches to the next — you'll see the active model name during parsing.

**Free models used (in fallback order):**

| Model | Provider |
|---|---|
| `openai/gpt-oss-120b:free` | OpenAI |
| `openai/gpt-oss-20b:free` | OpenAI |
| `z-ai/glm-4.5-air:free` | Z-AI |
| `moonshotai/kimi-k2.6:free` | Moonshot AI |
| `deepseek/deepseek-v4-flash:free` | DeepSeek |
| `google/gemma-4-31b-it:free` | Google |
| `nousresearch/hermes-3-llama-3.1-405b:free` | Nous Research |
| `poolside/laguna-xs.2:free` | Poolside |
| `cognitivecomputations/dolphin-mistral-24b-venice-edition:free` | Cognitive Computations |
| `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` | NVIDIA |
| `minimax/minimax-m2.5:free` | Minimax |

### Rate limits

Free models have per-minute rate limits. AiCal handles this automatically by trying the next model in the list. If all models are rate limited at once, you'll see an error asking you to try again shortly.

To remove rate limit issues entirely, add a small credit balance ($1–5) to your OpenRouter account — free models cost $0/token so the balance won't be spent, but it unlocks higher limits.

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
- [OpenRouter](https://openrouter.ai) — unified API for free AI models
- GitHub Pages — hosting
