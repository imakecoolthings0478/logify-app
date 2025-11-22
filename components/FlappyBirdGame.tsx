
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, RotateCcw, Trophy, Play } from 'lucide-react';

interface FlappyBirdGameProps {
  onClose: () => void;
}

const FlappyBirdGame: React.FC<FlappyBirdGameProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAME_OVER'>('START');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('logify_flappy_highscore') || '0');
    }
    return 0;
  });

  // Game Constants
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 600;
  const GRAVITY = 0.5;
  const JUMP = -8;
  const PIPE_SPEED = 3;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 160;
  const BIRD_SIZE = 24;

  // Mutable Game State (Refs for performance loop)
  const birdY = useRef(CANVAS_HEIGHT / 2);
  const velocity = useRef(0);
  const pipes = useRef<Array<{ x: number; topHeight: number; passed: boolean }>>([]);
  const requestRef = useRef<number>(0);

  const spawnPipe = () => {
    const minHeight = 50;
    const maxHeight = CANVAS_HEIGHT - PIPE_GAP - minHeight;
    const height = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
    pipes.current.push({
      x: CANVAS_WIDTH,
      topHeight: height,
      passed: false
    });
  };

  const resetGame = () => {
    birdY.current = CANVAS_HEIGHT / 2;
    velocity.current = 0;
    pipes.current = [];
    setScore(0);
    setGameState('START');
  };

  const gameOver = () => {
    setGameState('GAME_OVER');
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('logify_flappy_highscore', score.toString());
    }
  };

  const jump = useCallback(() => {
    if (gameState === 'PLAYING') {
      velocity.current = JUMP;
    } else if (gameState === 'START') {
      setGameState('PLAYING');
      velocity.current = JUMP;
    } else if (gameState === 'GAME_OVER') {
      // Do nothing, use button to reset
    }
  }, [gameState]);

  // Main Game Loop
  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    if (gameState === 'PLAYING') {
      // 1. Physics
      velocity.current += GRAVITY;
      birdY.current += velocity.current;

      // 2. Spawn Pipes
      if (pipes.current.length === 0 || pipes.current[pipes.current.length - 1].x < CANVAS_WIDTH - 250) {
        spawnPipe();
      }

      // 3. Update Pipes & Collision
      for (let i = pipes.current.length - 1; i >= 0; i--) {
        const p = pipes.current[i];
        p.x -= PIPE_SPEED;

        // Remove offscreen pipes
        if (p.x + PIPE_WIDTH < 0) {
          pipes.current.splice(i, 1);
          continue;
        }

        // Score counting
        if (!p.passed && p.x + PIPE_WIDTH < CANVAS_WIDTH / 2 - BIRD_SIZE / 2) {
          setScore(s => s + 1);
          p.passed = true;
        }

        // Collision Detection
        const birdLeft = CANVAS_WIDTH / 2 - BIRD_SIZE / 2;
        const birdRight = CANVAS_WIDTH / 2 + BIRD_SIZE / 2;
        const birdTop = birdY.current - BIRD_SIZE / 2;
        const birdBottom = birdY.current + BIRD_SIZE / 2;

        const pipeLeft = p.x;
        const pipeRight = p.x + PIPE_WIDTH;

        const hitPipe = 
          birdRight > pipeLeft && 
          birdLeft < pipeRight &&
          (birdTop < p.topHeight || birdBottom > p.topHeight + PIPE_GAP);

        if (hitPipe) {
          gameOver();
        }
      }

      // Floor/Ceiling Collision
      if (birdY.current + BIRD_SIZE/2 >= CANVAS_HEIGHT || birdY.current - BIRD_SIZE/2 <= 0) {
        gameOver();
      }
    }

    // --- DRAWING ---
    
    // Background
    ctx.fillStyle = '#0f172a'; // Slate 900
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Pipes
    ctx.fillStyle = '#6366f1'; // Brand 500
    ctx.strokeStyle = '#818cf8'; // Brand 400
    ctx.lineWidth = 2;
    
    pipes.current.forEach(p => {
      // Top Pipe
      ctx.fillRect(p.x, 0, PIPE_WIDTH, p.topHeight);
      ctx.strokeRect(p.x, 0, PIPE_WIDTH, p.topHeight);
      
      // Bottom Pipe
      ctx.fillRect(p.x, p.topHeight + PIPE_GAP, PIPE_WIDTH, CANVAS_HEIGHT - (p.topHeight + PIPE_GAP));
      ctx.strokeRect(p.x, p.topHeight + PIPE_GAP, PIPE_WIDTH, CANVAS_HEIGHT - (p.topHeight + PIPE_GAP));
    });

    // Bird
    ctx.save();
    ctx.translate(CANVAS_WIDTH / 2, birdY.current);
    // Rotate bird based on velocity
    const rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (velocity.current * 0.1)));
    ctx.rotate(rotation);

    // Body
    ctx.fillStyle = '#fbbf24'; // Amber 400
    ctx.beginPath();
    ctx.arc(0, 0, BIRD_SIZE/2, 0, Math.PI*2);
    ctx.fill();

    // Eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(6, -6, 6, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(8, -6, 2, 0, Math.PI*2);
    ctx.fill();

    // Wing
    ctx.fillStyle = '#f59e0b'; // Amber 500
    ctx.beginPath();
    ctx.ellipse(-4, 4, 8, 5, -0.2, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();

    // Ground
    ctx.fillStyle = '#1e293b'; // Slate 800
    ctx.fillRect(0, CANVAS_HEIGHT - 12, CANVAS_WIDTH, 12);
    ctx.fillStyle = '#6366f1'; // Strip
    ctx.fillRect(0, CANVAS_HEIGHT - 12, CANVAS_WIDTH, 2);

    if (gameState === 'PLAYING') {
      requestRef.current = requestAnimationFrame(animate);
    } else {
       // Keep drawing one frame if stopped to show death state or start state, 
       // but usually we might want to loop start animation. 
       // For simplicity, we stop the loop here, but we need to ensure things are drawn.
       // If Game Over, we just leave the last frame drawn.
    }
  };

  // Handle Animation Frame Request
  useEffect(() => {
    // Start the loop
    if (gameState === 'PLAYING') {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      // Draw at least once for Start/Game Over screens background
      requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, score]);

  // Keyboard Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 max-w-full">
        
        {/* Score HUD */}
        <div className="absolute top-4 left-0 right-0 flex justify-between px-6 z-10 pointer-events-none">
           <div className="bg-slate-950/80 backdrop-blur border border-slate-800 rounded-xl px-4 py-2 text-white font-bold text-2xl shadow-lg min-w-[60px] text-center">
              {score}
           </div>
           <div className="bg-slate-950/80 backdrop-blur border border-slate-800 rounded-xl px-4 py-2 text-brand-400 font-bold text-sm flex items-center gap-2 shadow-lg">
              <Trophy className="w-4 h-4" /> Best: {highScore}
           </div>
        </div>

        {/* Game Canvas */}
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onClick={(e) => {
            e.preventDefault();
            jump();
          }}
          className="cursor-pointer bg-slate-950 touch-none w-full h-auto max-h-[80vh] block"
          style={{ maxWidth: '100%' }}
        />

        {/* Start Screen */}
        {gameState === 'START' && (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none">
              <div className="bg-brand-500 p-4 rounded-full mb-4 shadow-[0_0_30px_rgba(99,102,241,0.5)] animate-bounce">
                 <Play className="w-8 h-8 text-white fill-white" />
              </div>
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">FLAPPY MAKER</h2>
              <p className="text-slate-300 font-medium animate-pulse">Tap or Space to Fly</p>
           </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'GAME_OVER' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px]">
              <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl text-center shadow-2xl transform scale-100 animate-in zoom-in duration-200 max-w-xs w-full mx-4">
                <h2 className="text-3xl font-bold text-white mb-1">Game Over</h2>
                <div className="text-4xl font-black text-brand-400 mb-6 mt-2">{score}</div>
                
                <button 
                  onClick={resetGame}
                  className="w-full bg-brand-600 hover:bg-brand-500 text-white py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-900/20 active:scale-95"
                >
                  <RotateCcw className="w-5 h-5" /> Try Again
                </button>
              </div>
            </div>
        )}

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-slate-800/80 hover:bg-red-500/90 text-white p-2 rounded-full backdrop-blur border border-white/10 transition-colors"
          title="Close Game"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FlappyBirdGame;
