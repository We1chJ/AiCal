import React, { useState, useEffect } from 'react';
import LogoMark from './LogoMark';
import GlassButton from './GlassButton';

interface Props {
  onParse: (text: string, apiKey: string) => void;
  error: string;
}

const InputScreen: React.FC<Props> = ({ onParse, error }) => {
  const [text, setText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [keyStatus, setKeyStatus] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('openai_api_key');
    if (saved) { setApiKey(saved); setKeyStatus('API key loaded'); }
  }, []);

  const saveKey = () => {
    if (!apiKey.trim()) return;
    localStorage.setItem('openai_api_key', apiKey.trim());
    setKeyStatus('Saved!');
    setTimeout(() => setKeyStatus(''), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      onParse(text.trim(), apiKey.trim());
    }
  };

  return (
    <div className="compose-screen">
      {/* Logo lockup */}
      <div className="compose-logo-row">
        <LogoMark size={36} />
        <span className="compose-app-name">AiCal</span>
      </div>
      <p className="compose-subtitle">Describe an event — AI will schedule it</p>

      {/* Textarea */}
      <div className="compose-textarea-wrap">
        <textarea
          className="compose-textarea"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Team standup every Monday at 9am, 30 minutes in the Zoom room"
        />
      </div>

      {/* Parse button */}
      <GlassButton fullWidth onClick={() => onParse(text.trim(), apiKey.trim())}>
        Parse Event
      </GlassButton>

      {error && <div className="compose-error">{error}</div>}

      {/* API key accordion */}
      <details className="api-accordion">
        <summary>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 6.5v3M7 4.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          OpenAI API Key
        </summary>
        <div className="api-accordion-body">
          <div className="api-input-row">
            <input
              type="password"
              className="api-input"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-..."
              onKeyDown={e => e.key === 'Enter' && saveKey()}
            />
            <GlassButton variant="secondary" onClick={saveKey}>Save</GlassButton>
          </div>
          {keyStatus && <div className="api-status">{keyStatus}</div>}
        </div>
      </details>
    </div>
  );
};

export default InputScreen;
