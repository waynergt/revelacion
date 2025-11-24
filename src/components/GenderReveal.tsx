import { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIGURACIÓN ---
const IS_BOY = false; // false = NIÑA 👧 | true = NIÑO 👦

const THEME = {
  boy: {
    color: 'text-blue-600',
    bg: 'from-blue-100 to-blue-300',
    accent: 'bg-blue-500',
    button: 'bg-blue-600 hover:bg-blue-700',
    message: '¡ES UN NIÑO!',
    emoji: '💙👶🚙'
  },
  girl: {
    color: 'text-pink-600',
    bg: 'from-pink-100 to-pink-300',
    accent: 'bg-pink-500',
    button: 'bg-pink-600 hover:bg-pink-700',
    message: '¡ES UNA NIÑA!',
    emoji: '🌸👶🎀'
  },
  neutral: {
    bg: 'from-slate-100 to-slate-200', 
    accent: 'bg-slate-800'
  },
  hacker: {
    bg: 'bg-slate-900', 
    text: 'text-green-400',
    error: 'text-red-500' 
  }
};

export default function GenderReveal() {
  const [status, setStatus] = useState<'idle' | 'counting' | 'analyzing' | 'revealed'>('idle');
  const [count, setCount] = useState(5);
  const [loadingPercent, setLoadingPercent] = useState(0); 
  const [isError, setIsError] = useState(false);
  
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Referencias de audio
  const drumRollRef = useRef<HTMLAudioElement | null>(null);
  const celebrationRef = useRef<HTMLAudioElement | null>(null);
  const glitchRef = useRef<HTMLAudioElement | null>(null); 

  useEffect(() => {
    drumRollRef.current = new Audio('/sounds/drumroll.mp3');
    celebrationRef.current = new Audio('/sounds/celebration.mp3');
    glitchRef.current = new Audio('/sounds/glitch.mp3'); 

    // Volumen inicial
    if (drumRollRef.current) drumRollRef.current.volume = 0.7; 
    if (celebrationRef.current) celebrationRef.current.volume = 1.0; 
    if (glitchRef.current) glitchRef.current.volume = 0.8;

    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      drumRollRef.current?.pause();
      celebrationRef.current?.pause();
      glitchRef.current?.pause();
    };
  }, []);

  // --- FUNCIÓN CRÍTICA PARA MÓVILES ---
  // Esto desbloquea el contexto de audio en iOS/Android al hacer el primer clic
  const unlockAudioContext = () => {
    const audios = [drumRollRef.current, celebrationRef.current, glitchRef.current];
    audios.forEach(audio => {
      if (audio) {
        audio.muted = true; // Silenciar para el "pre-calentamiento"
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            audio.pause();
            audio.currentTime = 0;
            audio.muted = false; // Quitar silencio para cuando toque sonar de verdad
          }).catch(() => {});
        }
      }
    });
  };

  const handleStart = () => {
    unlockAudioContext(); // <--- Desbloqueo aquí
    setStatus('counting');
  };

  const handleReset = () => {
    [drumRollRef, celebrationRef, glitchRef].forEach(ref => {
      if (ref.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });
    
    setCount(5);
    setLoadingPercent(0);
    setIsError(false);
    setStatus('idle');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // --- ORQUESTADOR DE AUDIOS ---
  useEffect(() => {
    if (status === 'counting') {
      drumRollRef.current?.play().catch(() => {});
    } 
    else if (status === 'analyzing') {
       if (drumRollRef.current) {
         drumRollRef.current.pause();
         drumRollRef.current.currentTime = 0;
       }
    }
    else if (status === 'revealed') {
      glitchRef.current?.pause();
      celebrationRef.current?.play().catch(() => {});
    }
  }, [status]);

  // --- LÓGICA TEMPORAL ---
  useEffect(() => {
    let timer: number;

    if (status === 'counting') {
      if (count > 0) {
        timer = setTimeout(() => setCount(c => c - 1), 1000);
      } else {
        timer = setTimeout(() => setStatus('analyzing'), 200);
      }
    }

    if (status === 'analyzing') {
      if (loadingPercent < 90) {
        timer = setTimeout(() => setLoadingPercent(p => p + 2), 30); 
      } else if (loadingPercent < 99) {
        timer = setTimeout(() => setLoadingPercent(p => p + 1), 200);
      } else if (loadingPercent === 99 && !isError) {
        timer = setTimeout(() => {
          setIsError(true);
          glitchRef.current?.play().catch(() => {}); 
        }, 500);
      } else if (isError) {
        timer = setTimeout(() => setStatus('revealed'), 2500);
      }
    }

    return () => clearTimeout(timer);
  }, [status, count, loadingPercent, isError]);

  const resultTheme = IS_BOY ? THEME.boy : THEME.girl;

  let bgClass = THEME.neutral.bg; 
  if (status === 'analyzing') bgClass = THEME.hacker.bg; 
  if (status === 'revealed') bgClass = resultTheme.bg; 

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center overflow-hidden transition-colors duration-500 bg-linear-to-br ${bgClass}`}>
      
      {/* Botón Pantalla Completa */}
      <button 
        onClick={toggleFullscreen}
        className={`absolute top-4 right-4 p-2 transition-colors z-50 cursor-pointer ${status === 'analyzing' ? 'text-green-500' : 'text-slate-400'}`}
        title={isFullscreen ? "Salir de Pantalla Completa" : "Pantalla Completa"}
      >
         {isFullscreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>
         ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
         )}
      </button>

      {status === 'revealed' && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={600}
          recycle={false}
          colors={IS_BOY ? ['#2563EB', '#60A5FA', '#93C5FD'] : ['#DB2777', '#F472B6', '#FBCFE8']}
        />
      )}

      <div className="z-10 text-center px-4 w-full max-w-4xl">
        <AnimatePresence mode='wait'>
          
          {/* FASE 1: INICIO */}
          {status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-slate-700 tracking-tight">
                ¿Están listos?
              </h1>
              {/* BOTÓN DE INICIO CON DESBLOQUEO DE AUDIO */}
              <button
                onClick={handleStart}
                className="px-8 py-4 bg-slate-900 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-all cursor-pointer"
              >
                Iniciar Protocolo
              </button>
            </motion.div>
          )}

          {/* FASE 2: CUENTA REGRESIVA */}
          {status === 'counting' && (
            <motion.div
              key="counting"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              className="text-9xl font-black text-slate-800"
            >
              {count}
            </motion.div>
          )}

          {/* FASE 3: LA BROMA (Consola de Sistema) */}
          {status === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 2 }} 
              className="w-full font-mono text-left p-8 rounded-lg border border-green-900 bg-black shadow-2xl overflow-hidden relative"
            >
               <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 pointer-events-none bg-size-[100%_2px,3px_100%]"></div>

              {!isError ? (
                <div className="space-y-4 text-green-500 z-30 relative">
                  <p className="text-xl animate-pulse">{'>'} INICIANDO ESCANEO DE GÉNERO...</p>
                  <p>{'>'} ACCEDIENDO A LA BASE DE DATOS...</p>
                  <p>{'>'} ANALIZANDO CROMOSOMAS...</p>
                  
                  <div className="w-full bg-green-900/30 h-8 rounded-none border border-green-500 mt-8 relative">
                    <div 
                      className="h-full bg-green-500 transition-all ease-linear" 
                      style={{ width: `${loadingPercent}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-black font-bold">
                      {loadingPercent}%
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 text-center z-30 relative py-12">
                   <motion.div 
                     animate={{ opacity: [1, 0.2, 1, 0.5, 1] }} 
                     transition={{ duration: 0.2, repeat: Infinity }}
                     className="text-red-500 text-6xl font-black tracking-widest"
                   >
                     ⚠️ FATAL ERROR
                   </motion.div>
                   <p className="text-red-400 text-2xl font-bold font-mono">
                     SOBRECARGA DE TERNURA DETECTADA
                   </p>
                   <p className="text-red-400 text-sm">
                     REINICIANDO SISTEMA EN MODO PRINCESA...
                   </p>
                </div>
              )}
            </motion.div>
          )}

          {/* FASE 4: EL RESULTADO REAL */}
          {status === 'revealed' && (
            <motion.div
              key="revealed"
              initial={{ scale: 0, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="space-y-6 bg-white/40 backdrop-blur-xl p-12 rounded-3xl shadow-2xl"
            >
              <div className="text-8xl animate-bounce">{resultTheme.emoji}</div>
              <h1 className={`text-6xl md:text-8xl font-black ${resultTheme.color} drop-shadow-lg`}>
                {resultTheme.message}
              </h1>
              <p className="text-slate-800 text-2xl font-bold">¡Bienvenida!</p>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
                className="pt-8 flex justify-center"
              >
                <button 
                  onClick={handleReset}
                  className={`px-6 py-2 ${resultTheme.button} text-white rounded-full font-medium shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-2`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  Repetir emoción
                </button>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}