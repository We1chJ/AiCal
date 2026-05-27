import React, { useState } from 'react';
import { EventData } from '../App';
import GlassButton from './GlassButton';

interface Props {
  event: EventData;
  onConfirm: (event: EventData) => Promise<void>;
  onBack: () => void;
}

const ReviewScreen: React.FC<Props> = ({ event, onConfirm, onBack }) => {
  const [data, setData] = useState<EventData>(event);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const update = (key: keyof EventData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setData(prev => ({ ...prev, [key]: e.target.value }));

  const handleConfirm = async () => {
    if (!data.title) return setError('Title is required.');
    if (!data.date) return setError('Date is required.');
    if (!data.startTime) return setError('Start time is required.');
    setError('');
    setIsLoading(true);
    try {
      await onConfirm(data);
    } catch (e) {
      setIsLoading(false);
      setError((e as Error).message || 'Failed to open appointment form. Please try again.');
    }
  };

  return (
    <div className="screen">
      {/* Topbar */}
      <div className="review-topbar">
        <button className="review-back-btn" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <span className="review-topbar-title">Review Event</span>
        <span className="review-topbar-spacer" />
      </div>

      {/* Scrollable fields */}
      <div className="review-body">
        {/* Title */}
        <div className="review-card">
          <div className="review-field">
            <label className="review-label">Title</label>
            <input className="review-input" type="text" value={data.title} onChange={update('title')} />
          </div>
        </div>

        {/* Date + Recurrence */}
        <div className="review-card">
          <div className="review-grid">
            <div className="review-field">
              <label className="review-label">Date</label>
              <input className="review-input" type="date" value={data.date} onChange={update('date')} />
            </div>
            <div className="review-field">
              <label className="review-label">Recurrence</label>
              <select className="review-select" value={data.recurrence} onChange={update('recurrence')}>
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Start + End Time */}
        <div className="review-card">
          <div className="review-grid">
            <div className="review-field">
              <label className="review-label">Start</label>
              <input className="review-input" type="time" value={data.startTime} onChange={update('startTime')} />
            </div>
            <div className="review-field">
              <label className="review-label">End</label>
              <input className="review-input" type="time" value={data.endTime} onChange={update('endTime')} />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="review-card">
          <div className="review-field" style={{ borderBottom: 'none' }}>
            <label className="review-label">Location / Link</label>
            <input
              className="review-input"
              type="text"
              value={data.location}
              onChange={update('location')}
              placeholder="Room, address, or meeting URL"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="review-card">
          <div className="review-field" style={{ borderBottom: 'none' }}>
            <label className="review-label">Notes</label>
            <textarea className="review-textarea" rows={3} value={data.notes} onChange={update('notes')} />
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="review-footer">
        {error && <div className="review-error">{error}</div>}
        <GlassButton fullWidth onClick={handleConfirm} disabled={isLoading}>
          {isLoading ? 'Opening Outlook...' : 'Add to Calendar'}
        </GlassButton>
      </div>
    </div>
  );
};

export default ReviewScreen;
