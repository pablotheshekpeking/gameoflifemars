import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export default function GameOver() {
  const { generation, resetGame, initializeGrid } = useGameStore();

  const handleRestart = () => {
    resetGame();
    initializeGrid();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
    >
      <div className="bg-red-900/80 p-8 rounded-xl text-center space-y-6 max-w-md mx-4">
        <h2 className="text-3xl font-bold text-white">Colony Lost</h2>
        <p className="text-white/90">
          Your colony survived for {generation} generations before all habitats were lost.
        </p>
        <button
          onClick={handleRestart}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition-colors"
        >
          Try Again
        </button>
      </div>
    </motion.div>
  );
} 