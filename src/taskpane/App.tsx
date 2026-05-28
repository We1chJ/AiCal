import React, { useState } from 'react';
import InputScreen from './components/InputScreen';
import LoadingScreen from './components/LoadingScreen';
import ReviewScreen from './components/ReviewScreen';
import SuccessScreen from './components/SuccessScreen';
import ClickSpark from './components/ClickSpark';

type Screen = 'input' | 'loading' | 'review' | 'success';

const FREE_MODELS = [
  'openai/gpt-oss-120b:free',
  'openai/gpt-oss-20b:free',
  'z-ai/glm-4.5-air:free',
  'moonshotai/kimi-k2.6:free',
  'deepseek/deepseek-v4-flash:free',
  'google/gemma-4-31b-it:free',
  'nousresearch/hermes-3-llama-3.1-405b:free',
  'poolside/laguna-xs.2:free',
  'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
  'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
  'minimax/minimax-m2.5:free',
];

export interface EventData {
  title: string;
  date: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  notes: string;
  isAllDay: boolean;
}

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('input');
  const [parsedEvent, setParsedEvent] = useState<EventData | null>(null);
  const [error, setError] = useState('');
  const [loadingModel, setLoadingModel] = useState('');
  const [loadingStatus, setLoadingStatus] = useState('');

  const handleParse = async (text: string, apiKey: string) => {
    setError('');
    if (!text) return setError('Please describe your event.');
    if (!apiKey) return setError('Please enter and save your OpenRouter API key.');

    setScreen('loading');

    try {
      const today = new Date().toLocaleDateString('en-CA');
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      // Strip any non-printable-ASCII chars that browsers reject in HTTP headers
      const safeKey = apiKey.replace(/[^\x20-\x7E]/g, '');
      let rateLimited = false;

      for (const model of FREE_MODELS) {
        setLoadingModel(model);
        setLoadingStatus(rateLimited ? 'Rate limited — switching model' : '');

        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${safeKey}` },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'system',
                content: `You are a calendar assistant. Extract event details from the user's message and return a JSON object with exactly these fields: title (string), date (YYYY-MM-DD string), startTime (HH:MM 24h string), endTime (HH:MM 24h string), location (string, empty if none), recurrence (one of: none/daily/weekly/monthly/yearly), notes (string, empty if none). Today is ${today}. The user's local timezone is ${timezone}. All times should be in the user's local timezone. If no end time is mentioned, add 1 hour to start. If no date is mentioned, use today. For recurring events, pick the next occurrence date. Return only the JSON object, no other text.`,
              },
              { role: 'user', content: text },
            ],
            response_format: { type: 'json_object' },
          }),
        });

        if (res.status === 429) { rateLimited = true; continue; }

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error?.message || `API error ${res.status}`);
        }

        const data = await res.json();
        const parsed = JSON.parse(data.choices[0].message.content);
        setParsedEvent({ ...parsed, endDate: parsed.date, isAllDay: false });
        setScreen('review');
        return;
      }

      throw new Error('All models rate limited. Try again in a moment.');
    } catch (e) {
      setError((e as Error).message);
      setScreen('input');
    }
  };

  const handleSchedule = async (event: EventData) => {
    let start: Date;
    let end: Date;

    if (event.isAllDay) {
      start = new Date(`${event.date}T00:00:00`);
      end = new Date(`${event.endDate}T23:59:59`);
    } else {
      start = new Date(`${event.date}T${event.startTime}`);
      end = event.endTime
        ? new Date(`${event.endDate}T${event.endTime}`)
        : new Date(start.getTime() + 60 * 60 * 1000);

      // Auto-advance end by one day if it lands before start (midnight-crossing events)
      if (end <= start) {
        end.setDate(end.getDate() + 1);
      }
    }

    await Office.context.mailbox.displayNewAppointmentForm({
      subject: event.title,
      start,
      end,
      location: event.location,
      body: event.notes,
      requiredAttendees: [],
      optionalAttendees: [],
      isAllDayEvent: event.isAllDay,
    });

    setScreen('success');
  };

  const handleReset = () => {
    setParsedEvent(null);
    setError('');
    setScreen('input');
  };

  return (
    <ClickSpark sparkColor="hsl(252,75%,60%)" sparkSize={8} sparkRadius={18} sparkCount={6} duration={380}>
      {screen === 'input' && <InputScreen onParse={handleParse} error={error} />}
      {screen === 'loading' && <LoadingScreen model={loadingModel} status={loadingStatus} />}
      {screen === 'review' && parsedEvent && (
        <ReviewScreen event={parsedEvent} onConfirm={handleSchedule} onBack={() => setScreen('input')} />
      )}
      {screen === 'success' && parsedEvent && (
        <SuccessScreen event={parsedEvent} onReset={handleReset} />
      )}
    </ClickSpark>
  );
};

export default App;
