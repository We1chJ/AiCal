import React, { useState } from 'react';
import { EventData } from '../App';
import BorderGlow from './BorderGlow';
import GlassSurface from './GlassSurface';

interface Props {
  event: EventData;
  onConfirm: (event: EventData) => void;
  onBack: () => void;
}

const ReviewScreen: React.FC<Props> = ({ event, onConfirm, onBack }) => {
  const [data, setData] = useState<EventData>(event);
  const [error, setError] = useState('');

  const update = (key: keyof EventData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setData(prev => ({ ...prev, [key]: e.target.value }));

  const handleConfirm = () => {
    if (!data.title) return setError('Title is required.');
    if (!data.date) return setError('Date is required.');
    if (!data.startTime) return setError('Start time is required.');
    setError('');
    onConfirm(data);
  };

  return (
    <div className="screen">
      <div className="header">
        <h1>Review Event</h1>
        <p className="subtitle">Edit if needed, then confirm</p>
      </div>
      <div className="body">
        <GlassSurface width="100%" height="auto" borderRadius={10} backgroundOpacity={0.08} saturation={1.2} className="glass-field-wrap">
          <div className="field">
            <label>Title</label>
            <input type="text" value={data.title} onChange={update('title')} />
          </div>
        </GlassSurface>

        <GlassSurface width="100%" height="auto" borderRadius={10} backgroundOpacity={0.08} saturation={1.2} className="glass-field-wrap">
          <div className="field-row">
            <div className="field">
              <label>Date</label>
              <input type="date" value={data.date} onChange={update('date')} />
            </div>
            <div className="field">
              <label>Recurrence</label>
              <select value={data.recurrence} onChange={update('recurrence')}>
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
        </GlassSurface>

        <GlassSurface width="100%" height="auto" borderRadius={10} backgroundOpacity={0.08} saturation={1.2} className="glass-field-wrap">
          <div className="field-row">
            <div className="field">
              <label>Start Time</label>
              <input type="time" value={data.startTime} onChange={update('startTime')} />
            </div>
            <div className="field">
              <label>End Time</label>
              <input type="time" value={data.endTime} onChange={update('endTime')} />
            </div>
          </div>
        </GlassSurface>

        <GlassSurface width="100%" height="auto" borderRadius={10} backgroundOpacity={0.08} saturation={1.2} className="glass-field-wrap">
          <div className="field">
            <label>Location / Link</label>
            <input type="text" value={data.location} onChange={update('location')} placeholder="Room, address, or meeting link" />
          </div>
        </GlassSurface>

        <GlassSurface width="100%" height="auto" borderRadius={10} backgroundOpacity={0.08} saturation={1.2} className="glass-field-wrap">
          <div className="field">
            <label>Notes</label>
            <textarea rows={3} value={data.notes} onChange={update('notes')} />
          </div>
        </GlassSurface>

        {error && <div className="error">{error}</div>}

        <div className="action-row">
          <BorderGlow
            borderRadius={8} backgroundColor="transparent" glowColor="217 60 60"
            glowRadius={12} glowIntensity={1.5} coneSpread={30}
            colors={['#60a5fa', '#818cf8', '#38bdf8']} className="btn-glow-wrap btn-glow-secondary"
          >
            <button className="btn-secondary" onClick={onBack}>Back</button>
          </BorderGlow>
          <BorderGlow
            borderRadius={8} backgroundColor="transparent" glowColor="217 80 65"
            glowRadius={12} glowIntensity={2.0} coneSpread={30}
            colors={['#60a5fa', '#818cf8', '#38bdf8']} className="btn-glow-wrap btn-glow-primary"
          >
            <button className="btn-primary" onClick={handleConfirm}>Add to Calendar</button>
          </BorderGlow>
        </div>
      </div>
    </div>
  );
};

export default ReviewScreen;
