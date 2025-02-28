import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export default function GameOver() {
  const { generation, resetGame, initializeGrid } = useGameStore();

  const handleRestart = () => {
    resetGame();
    initializeGrid();
  };

  const shareResult = () => {
    const text = `I survived ${generation} generations on Mars! Try the Mars Colonization game: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: 'Mars Colonization',
        text: text,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard! Share it anywhere!');
    }
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
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={shareResult}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold transition-colors flex items-center gap-2"
          >
            <span>Share</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
} 