'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import GameGrid from './components/GameGrid';

const structures = [
  { id: 'habitat', name: 'Habitat Dome', icon: '🏠', cost: { energy: 20, water: 10, oxygen: 15 } },
  { id: 'oxygen', name: 'Oxygen Generator', icon: '💨', cost: { energy: 30, water: 5, oxygen: 0 } },
  { id: 'water', name: 'Water Extractor', icon: '💧', cost: { energy: 25, water: 0, oxygen: 10 } },
  { id: 'energy', name: 'Solar Array', icon: '☀️', cost: { energy: 0, water: 15, oxygen: 10 } },
  { id: 'shield', name: 'Shield Generator', icon: '🛡️', cost: { energy: 40, water: 20, oxygen: 20 } },
];

export default function Home() {
  const { 
    initializeGrid, 
    isRunning, 
    setIsRunning, 
    generation, 
    resources,
    selectedStructure,
    setSelectedStructure,
    speed,
    setSpeed 
  } = useGameStore();

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900/20 to-black p-8">
      <main className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-red-500">Mars Colonization</h1>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-6 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold"
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <select 
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="bg-black/30 text-white rounded-md px-3 py-2"
            >
              <option value={1000}>Normal Speed</option>
              <option value={500}>Fast</option>
              <option value={2000}>Slow</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 p-4 bg-black/30 rounded-xl backdrop-blur-sm">
          <div className="flex gap-2 items-center text-white">
            <span className="text-xl">🕒</span>
            <span>Generation: {generation}</span>
          </div>
          <div className="flex gap-6">
            <ResourceDisplay icon="💨" value={resources.oxygen} label="Oxygen" />
            <ResourceDisplay icon="💧" value={resources.water} label="Water" />
            <ResourceDisplay icon="⚡" value={resources.energy} label="Energy" />
          </div>
        </div>

        <div className="flex gap-8">
          <div className="w-48 space-y-4">
            <h2 className="text-xl font-semibold text-white">Structures</h2>
            <div className="space-y-2">
              {structures.map((structure) => (
                <motion.button
                  key={structure.id}
                  className={`w-full p-3 rounded-lg text-left ${
                    selectedStructure === structure.id
                      ? 'bg-red-500 text-white'
                      : 'bg-black/30 text-white/80 hover:bg-black/40'
                  }`}
                  onClick={() => setSelectedStructure(structure.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{structure.icon}</span>
                    <div>
                      <div className="font-medium">{structure.name}</div>
                      <div className="text-xs opacity-80">
                        {Object.entries(structure.cost)
                          .filter(([, value]) => value > 0)
                          .map(([resource, value]) => `${resource}: ${value}`)
                          .join(' | ')}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <GameGrid />
          </div>
        </div>
      </main>
    </div>
  );
}

function ResourceDisplay({ icon, value, label }) {
  return (
    <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-lg">
      <span className="text-xl">{icon}</span>
      <div>
        <div className="text-sm text-white/60">{label}</div>
        <div className="text-white font-semibold">{value}</div>
      </div>
      <div className="w-24 h-2 bg-black/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-red-500"
          initial={false}
          animate={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
} 