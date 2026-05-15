import React from 'react';
import { EventData } from '../App';
import GlassButton from './GlassButton';

interface Props {
  event: EventData;
  onReset: () => void;
}

const fmt = (dateStr: string) => {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const fmtTime = (t: string) => {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 || 12;
  return `${hr}:${m.toString().padStart(2, '0')} ${ampm}`;
};

const SuccessScreen: React.FC<Props> = ({ event, onReset }) => (
  <div className="success-screen">
    <div className="success-check">
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <polyline
          points="5,13 10,19 21,8"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="40"
          strokeDashoffset="0"
          style={{ animation: 'check-draw 0.35s ease 0.15s both' }}
        />
      </svg>
    </div>

    <div>
      <p className="success-heading">Appointment form opened</p>
      <p className="success-sub">Confirm in Outlook to save the event.</p>
    </div>

    <div className="success-event-card">
      <div className="success-event-banner" />
      <div className="success-event-body">
        <p className="success-event-title">{event.title}</p>
        <div className="success-event-meta">
          <span>{fmt(event.date)}</span>
          <span>{fmtTime(event.startTime)}{event.endTime ? ` – ${fmtTime(event.endTime)}` : ''}</span>
          {event.location && <span>{event.location}</span>}
        </div>
      </div>
    </div>

    <GlassButton variant="secondary" onClick={onReset}>Schedule another</GlassButton>

    <style>{`
      @keyframes check-draw {
        from { stroke-dashoffset: 40; opacity: 0; }
        to   { stroke-dashoffset: 0;  opacity: 1; }
      }
    `}</style>
  </div>
);

export default SuccessScreen;
