# AiCal

An Outlook add-in that brings AI-powered tools directly into your email reading experience.

## Installation

1. Open this URL in your browser (works for both Outlook on the web and Outlook desktop):

   **https://aka.ms/olksideload**

2. In the dialog that opens, click **My add-ins** in the left sidebar.

3. Scroll down to **Custom Add-ins** and click **+ Add a custom add-in** → **Add from File...**

4. Select the `manifest.xml` file from this repo (or download it from the [latest release](https://we1chj.github.io/AiCal/manifest.xml)).

5. Accept the warning prompt.

## Usage

- Open any email in Outlook
- Find the **aical** group in the ribbon
- Click **Show Task Pane** to open the add-in

## Development

```bash
npm install
npm run dev-server
```

To deploy:

```bash
npm run deploy
```
