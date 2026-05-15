import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';
import { EventData } from './App';

const SCOPES = ['https://graph.microsoft.com/Calendars.ReadWrite'];

let msal: PublicClientApplication | null = null;
let msalClientId = '';

async function getMsal(clientId: string): Promise<PublicClientApplication> {
  if (msal && msalClientId === clientId) return msal;
  msal = new PublicClientApplication({
    auth: {
      clientId,
      authority: 'https://login.microsoftonline.com/common',
      redirectUri: window.location.href.split('?')[0],
    },
    cache: { cacheLocation: 'localStorage', storeAuthStateInCookie: false },
  });
  await msal.initialize();
  msalClientId = clientId;
  return msal;
}

async function getToken(clientId: string): Promise<string> {
  const instance = await getMsal(clientId);
  const accounts = instance.getAllAccounts();

  if (accounts.length > 0) {
    try {
      const result = await instance.acquireTokenSilent({ scopes: SCOPES, account: accounts[0] });
      return result.accessToken;
    } catch (e) {
      if (!(e instanceof InteractionRequiredAuthError)) throw e;
    }
  }

  const result = await instance.acquireTokenPopup({ scopes: SCOPES });
  return result.accessToken;
}

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function buildRecurrence(recurrence: string, startDate: string) {
  if (recurrence === 'none') return undefined;
  const d = new Date(startDate + 'T00:00:00');
  const range = { type: 'noEnd', startDate };
  switch (recurrence) {
    case 'daily':   return { pattern: { type: 'daily', interval: 1 }, range };
    case 'weekly':  return { pattern: { type: 'weekly', interval: 1, daysOfWeek: [DAY_NAMES[d.getDay()]] }, range };
    case 'monthly': return { pattern: { type: 'absoluteMonthly', interval: 1, dayOfMonth: d.getDate() }, range };
    case 'yearly':  return { pattern: { type: 'absoluteYearly', interval: 1, month: d.getMonth() + 1, dayOfMonth: d.getDate() }, range };
    default:        return undefined;
  }
}

export async function createGraphEvent(clientId: string, event: EventData): Promise<void> {
  const token = await getToken(clientId);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const body: Record<string, unknown> = {
    subject: event.title,
    start: { dateTime: `${event.date}T${event.startTime}:00`, timeZone: tz },
    end:   { dateTime: `${event.date}T${event.endTime}:00`,   timeZone: tz },
  };

  if (event.location) body.location = { displayName: event.location };
  if (event.notes)    body.body = { contentType: 'Text', content: event.notes };

  const recurrence = buildRecurrence(event.recurrence, event.date);
  if (recurrence) body.recurrence = recurrence;

  const res = await fetch('https://graph.microsoft.com/v1.0/me/events', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error?.message || `Graph API error ${res.status}`);
  }
}
