import React, { useState, useEffect } from 'react';
import '../../styles/EntranceOverlay.scss';
import { useScene } from '../../context/SceneContext';

const EntranceOverlay = () => {
  const [isExiting, setIsExiting] = useState(false);
  const { markEntered } = useScene();

  useEffect(() => {
    const handleExit = () => {
      setIsExiting(true);
      setTimeout(() => {
        markEntered();
      }, 600);
    };

    window.addEventListener('entranceTransitionStart', handleExit);
    return () => {
      window.removeEventListener('entranceTransitionStart', handleExit);
    };
  }, [markEntered]);

  return (
    <div className={`entrance-overlay ${isExiting ? 'entrance-overlay--exit' : ''}`}>
      {/* 2D Flying Birds Micro-animations */}
      {!isExiting && (
        <div className="entrance-birds">
          <div className="entrance-bird entrance-bird--1">
            <svg viewBox="0 0 44 20" width="36" height="16">
              <path d="M 2 12 Q 12 2 22 12 Q 32 2 42 12 Q 22 22 2 12" fill="none" stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="entrance-bird entrance-bird--2">
            <svg viewBox="0 0 44 20" width="28" height="12">
              <path d="M 2 12 Q 12 2 22 12 Q 32 2 42 12 Q 22 22 2 12" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="entrance-bird entrance-bird--3">
            <svg viewBox="0 0 44 20" width="24" height="10">
              <path d="M 2 12 Q 12 2 22 12 Q 32 2 42 12 Q 22 22 2 12" fill="none" stroke="#1a1a1a" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      )}

      {/* Top-Left Glassmorphic Profile Card */}
      <header className="entrance-overlay__header">
        <h1 className="entrance-overlay__name">Madhan Kumar S</h1>
        <div className="entrance-overlay__roles">
          <p className="entrance-overlay__role">AI Engineer</p>
          <p className="entrance-overlay__role">Full Stack Developer</p>
          <p className="entrance-overlay__role">UI/UX Designer</p>
        </div>
        <div className="entrance-overlay__divider">
          <span className="entrance-overlay__divider-line"></span>
          <span className="entrance-overlay__divider-diamond">♦</span>
          <span className="entrance-overlay__divider-line"></span>
        </div>
        <p className="entrance-overlay__welcome">Welcome to my journey.</p>
      </header>
    </div>
  );
};

export default EntranceOverlay;
