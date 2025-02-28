import { motion } from 'framer-motion';
import { useState } from 'react';

export default function UsernameModal({ onStart }) {
  const [username, setUsername] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
    >
      <div className="bg-red-900/80 p-8 rounded-xl text-center space-y-6 max-w-md mx-4">
        <h2 className="text-3xl font-bold text-white">Welcome to Mars!</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full px-4 py-2 bg-black/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={() => onStart(username)}
            disabled={!username.trim()}
            className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition-colors disabled:opacity-50"
          >
            Start Colonization
          </button>
        </div>
      </div>
    </motion.div>
  );
} 