import React, { useState, useEffect } from 'react';
import BorderGlow from './BorderGlow';
import GlassSurface from './GlassSurface';

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

  return (
    <div className="screen">
      <div className="header">
        <img src="../../assets/logo.png" className="logo" alt="AiCal" />
        <h1>AiCal</h1>
        <p className="subtitle">Describe an event and AI will schedule it</p>
      </div>
      <div className="body">
        <GlassSurface width="100%" height="auto" borderRadius={10} backgroundOpacity={0.08} saturation={1.2} className="glass-field-wrap">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="e.g. Team standup every Monday at 9am in the conference room, 30 minutes"
          />
        </GlassSurface>

        <BorderGlow
          borderRadius={8} backgroundColor="transparent" glowColor="217 80 65"
          glowRadius={12} glowIntensity={1.8} coneSpread={30}
          colors={['#60a5fa', '#818cf8', '#38bdf8']} className="btn-glow-wrap"
        >
          <button className="btn-primary" onClick={() => onParse(text.trim(), apiKey.trim())}>
            Parse Event
          </button>
        </BorderGlow>

        {error && <div className="error">{error}</div>}

        <GlassSurface width="100%" height="auto" borderRadius={10} backgroundOpacity={0.06} saturation={1.1} className="glass-field-wrap">
          <details className="api-key-section">
            <summary>OpenAI API Key</summary>
            <div className="api-key-row">
              <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-..." />
              <button className="btn-secondary" onClick={saveKey}>Save</button>
            </div>
            {keyStatus && <div className="key-status">{keyStatus}</div>}
          </details>
        </GlassSurface>
      </div>
    </div>
  );
};

export default InputScreen;
