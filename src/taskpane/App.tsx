import React, { useState } from 'react';
import InputScreen from './components/InputScreen';
import LoadingScreen from './components/LoadingScreen';
import ReviewScreen from './components/ReviewScreen';
import ClickSpark from './components/ClickSpark';
import Iridescence from './components/Iridescence';

type Screen = 'input' | 'loading' | 'review';

export interface EventData {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  notes: string;
}

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('input');
  const [parsedEvent, setParsedEvent] = useState<EventData | null>(null);
  const [error, setError] = useState('');

  const handleParse = async (text: string, apiKey: string) => {
    setError('');
    if (!text) return setError('Please describe your event.');
    if (!apiKey) return setError('Please enter and save your OpenAI API key.');

    setScreen('loading');

    try {
      const today = new Date().toLocaleDateString('en-CA');
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a calendar assistant. Extract event details from the user's message. Today is ${today}. The user's local timezone is ${timezone}. All output times should be in the user's local timezone. If no end time is mentioned, add 1 hour to start. If no date is mentioned, use today. For recurring events, pick the next occurrence date.`,
            },
            { role: 'user', content: text },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'calendar_event',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  title:      { type: 'string', description: 'Event title' },
                  date:       { type: 'string', description: 'Date in YYYY-MM-DD' },
                  startTime:  { type: 'string', description: 'Start time in HH:MM 24h' },
                  endTime:    { type: 'string', description: 'End time in HH:MM 24h' },
                  location:   { type: 'string', description: 'Room, address, or meeting URL. Empty string if none.' },
                  recurrence: { type: 'string', enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'] },
                  notes:      { type: 'string', description: 'Any extra context. Empty string if none.' },
                },
                required: ['title', 'date', 'startTime', 'endTime', 'location', 'recurrence', 'notes'],
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
      setParsedEvent(JSON.parse(data.choices[0].message.content));
      setScreen('review');
    } catch (e) {
      setError((e as Error).message);
      setScreen('input');
    }
  };

  const handleSchedule = (event: EventData) => {
    const start = new Date(`${event.date}T${event.startTime}`);
    const end = event.endTime
      ? new Date(`${event.date}T${event.endTime}`)
      : new Date(start.getTime() + 60 * 60 * 1000);

    Office.context.mailbox.displayNewAppointmentForm({
      subject: event.title, start, end,
      location: event.location, body: event.notes,
      requiredAttendees: [], optionalAttendees: [],
    });
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Iridescence color={[0.2, 0.4, 1.0]} speed={0.6} amplitude={0.15} mouseReact={true} />
      </div>
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        <ClickSpark sparkColor="#fff" sparkSize={10} sparkRadius={20} sparkCount={8} duration={400}>
          {screen === 'input' && <InputScreen onParse={handleParse} error={error} />}
          {screen === 'loading' && <LoadingScreen />}
          {screen === 'review' && parsedEvent && (
            <ReviewScreen event={parsedEvent} onConfirm={handleSchedule} onBack={() => setScreen('input')} />
          )}
        </ClickSpark>
      </div>
    </div>
  );
};

export default App;
