import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useEffect, useRef } from 'react';

const structureIcons = {
  habitat: '🏠',
  oxygen: '💨',
  water: '💧',
  energy: '☀️',
  shield: '🛡️',
};

const HazardEffect = ({ type }) => {
  const effects = {
    DUST_STORM: 'bg-yellow-500/50',
    RADIATION: 'bg-green-500/50',
    METEOR: 'bg-red-500/50'
  };

  return (
    <motion.div
      className={`absolute inset-0 ${effects[type]}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    />
  );
};

export default function GameGrid() {
  const { 
    grid, 
    isRunning, 
    speed, 
    nextGeneration, 
    placeStructure, 
    selectedStructure, 
    weather,
    level,
    score,
    turnsLeft
  } = useGameStore();
  const intervalRef = useRef();

  useEffect(() => {
    if (isRunning) {
      // Clear any existing interval first
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Set new interval
      intervalRef.current = setInterval(nextGeneration, speed);
    } else {
      // Clear interval when not running
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, speed, nextGeneration]);

  const getCellColor = (cell) => {
    if (!cell.type) return 'transparent';
    const colors = {
      thriving: 'rgb(0, 255, 100)',
      struggling: 'rgb(255, 165, 0)',
      dying: 'rgb(255, 50, 50)',
    };
    return colors[cell.status] || colors.thriving;
  };

  const handleCellClick = (i, j) => {
    if (selectedStructure) {
      placeStructure(i, j, selectedStructure);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center p-4 bg-black/30 rounded-lg">
        <div>Level: {level}</div>
        <div>Score: {score}</div>
        <div>Turns Left: {turnsLeft}</div>
      </div>
      <div className="relative w-full aspect-square max-w-2xl mx-auto bg-black/20 rounded-xl overflow-hidden backdrop-blur-sm">
        <AnimatePresence>
          {weather !== 'normal' && <HazardEffect type={weather.toUpperCase()} />}
        </AnimatePresence>
        <div 
          className="grid h-full" 
          style={{ 
            gridTemplateRows: `repeat(${grid.length}, 1fr)`,
            gridTemplateColumns: `repeat(${grid[0]?.length || 1}, 1fr)`,
            gap: '2px',
            padding: '2px',
            background: 'rgba(255, 50, 50, 0.2)',
          }}
        >
          {grid.map((row, i) =>
            row.map((cell, j) => (
              <motion.div
                key={`${i}-${j}`}
                className="relative cursor-pointer hover:bg-white/10 transition-colors"
                initial={false}
                animate={{
                  backgroundColor: getCellColor(cell),
                  scale: cell.type ? 1 : 0.95,
                }}
                style={{
                  boxShadow: 'inset 0 0 0 1px rgba(255, 50, 50, 0.1)',
                  borderRadius: '4px'
                }}
                onClick={() => handleCellClick(i, j)}
              >
                {cell.type && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center text-lg"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {structureIcons[cell.type]}
                  </motion.div>
                )}
                {cell.shield && (
                  <motion.div
                    className="absolute inset-0 border-2 border-blue-400 rounded-sm opacity-50"
                    animate={{
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 