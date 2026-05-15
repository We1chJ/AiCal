import React, { useState, useEffect } from 'react';
import LogoMark from './LogoMark';

const STEPS = [
  'Reading description',
  'Extracting details',
  'Verifying output',
];

const LoadingScreen: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setActiveStep(1), 900);
    const t2 = setTimeout(() => setActiveStep(2), 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="parsing-screen">
      <div className="parsing-logo-ring">
        <div className="parsing-ring" />
        <LogoMark size={44} />
      </div>

      <p className="parsing-label">Parsing event…</p>

      <div className="parsing-steps">
        {STEPS.map((step, i) => {
          const state = i < activeStep ? 'done' : i === activeStep ? 'active' : 'pending';
          return (
            <div key={step} className={`parsing-step parsing-step--${state}`}>
              <span className={`step-icon step-icon--${state}`}>
                {state === 'done' && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <polyline points="2,5 4,7.5 8,3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              {step}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoadingScreen;
