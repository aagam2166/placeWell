import React, { useEffect, useState } from 'react';
import { usePlaceWell } from '../context/PlaceWellContext';
import videoSrc from '../assets/vid.mp4';
import { ArrowRight, LogIn } from 'lucide-react';

export const AuthPage: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const { signIn } = usePlaceWell();
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const fullPhrase = 'Real stories.\nReal rounds.\nReal preparation.';
  const linePhrases = ['Real stories.', 'Real rounds.', 'Real preparation.'];

  useEffect(() => {
    const delay = isDeleting ? 45 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        const nextValue = fullPhrase.slice(0, typedText.length + 1);
        setTypedText(nextValue);

        if (nextValue === fullPhrase) {
          setTimeout(() => setIsDeleting(true), 1200);
        }
      } else {
        const nextValue = fullPhrase.slice(0, Math.max(0, typedText.length - 1));
        setTypedText(nextValue);

        if (nextValue.length === 0) {
          setIsDeleting(false);
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [typedText, isDeleting]);

  const handleSignIn = () => {
    signIn('', '');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-950">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        src={videoSrc}
      />

      <div className="absolute inset-0 bg-slate-950/5" />
      <div className="absolute inset-x-0 bottom-0 h-[50%] bg-[radial-gradient(ellipse_at_center,_rgba(15,118,110,0.14)_0%,_rgba(14,116,144,0.08)_25%,_rgba(2,6,23,0)_72%)]" />

      <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-8">
        <div className="mx-auto flex max-w-[1500px] items-end justify-between gap-6">
          <div className="max-w-[1200px]">
            <div className="min-h-[110px]">
              <h2 className="text-[clamp(2.3rem,3.8vw,6rem)] font-black leading-[0.9] tracking-[-0.06em] text-white">
                {linePhrases.map((line, index) => {
                  const typedLines = typedText.split('\n');
                  const typedValue = typedLines[index] ?? '';
                  const isCurrent = index === Math.min(typedLines.length - 1, linePhrases.length - 1) && typedText !== fullPhrase;
                  const isCompleted = index < Math.min(typedLines.length - 1, linePhrases.length - 1) || typedText === fullPhrase;

                  return (
                    <span key={line} className="block min-h-[1.08em]">
                      {isCompleted ? line : isCurrent ? (
                        <>
                          {typedValue}
                          <span className="ml-1 inline-block h-[0.9em] w-[2px] translate-y-[2px] bg-white align-middle animate-pulse" />
                        </>
                      ) : ''}
                    </span>
                  );
                })}
              </h2>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="rounded-full border border-white/15 bg-slate-900/40 px-6 py-3 text-[13px] font-bold uppercase tracking-[0.32em] text-cyan-100 shadow-2xl backdrop-blur-md sm:text-[14px]">
              Join Us Today
            </div>

            <button
              type="button"
              onClick={handleSignIn}
              className="group inline-flex items-center gap-3 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 px-6 py-3.5 shadow-2xl hover:bg-white/15 transition-all"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg">
                <LogIn className="h-5 w-5 text-slate-950" />
              </span>
              <span className="flex flex-col items-start">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">Join / Sign In</span>
                <span className="text-base font-extrabold">Authenticate</span>
              </span>
              <ArrowRight className="h-4 w-4 text-white/80 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
