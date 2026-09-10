import { useEffect, useState } from 'react';

const loadingMessages = [
  'Gerando mundo...',
  'Carregando chunks...',
  'Spawnando creepers...',
  'Acendendo tochas...',
  'Minerando diamantes...',
  'Construindo workspace...',
];

export default function CreeperLoading() {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + Math.random() * 8 + 2, 100);
        if (next >= 100) window.clearInterval(interval);
        return next;
      });
    }, 180);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const msgInterval = window.setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1400);
    return () => window.clearInterval(msgInterval);
  }, []);

  return (
    <div className="creeper-loading">
      <div className="creeper-bg" />

      <div className="creeper-scene">
        <div className="creeper-pixel">
          <div className="creeper-face">
            <div className="creeper-eye creeper-eye-left" />
            <div className="creeper-eye creeper-eye-right" />
            <div className="creeper-mouth">
              <div className="creeper-mouth-top" />
              <div className="creeper-mouth-left" />
              <div className="creeper-mouth-right" />
              <div className="creeper-mouth-bottom" />
            </div>
          </div>
          <div className="creeper-shadow" />
        </div>
      </div>

      <div className="creeper-info">
        <h1 className="creeper-title">CRAFT<span>BOARD</span></h1>
        <div className="creeper-bar-wrap">
          <div className="creeper-bar" style={{ width: `${progress}%` }} />
          <div className="creeper-bar-pixels">
            {Array.from({ length: 20 }).map((_, i) => (
              <span key={i} className={progress > i * 5 ? 'lit' : ''} />
            ))}
          </div>
        </div>
        <p className="creeper-message">{loadingMessages[messageIndex]}</p>
        <span className="creeper-percent">{Math.floor(progress)}%</span>
      </div>
    </div>
  );
}
