'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import GameGrid from './components/GameGrid';
import GameOver from './components/GameOver';
import UsernameModal from './components/UsernameModal';

const structures = [
  { id: 'habitat', name: 'Habitat Dome', icon: '🏠', cost: { energy: 20, water: 10, oxygen: 15 } },
  { id: 'oxygen', name: 'Oxygen Generator', icon: '💨', cost: { energy: 30, water: 5, oxygen: 0 } },
  { id: 'water', name: 'Water Extractor', icon: '💧', cost: { energy: 25, water: 0, oxygen: 10 } },
  { id: 'energy', name: 'Solar Array', icon: '☀️', cost: { energy: 0, water: 15, oxygen: 10 } },
  { id: 'shield', name: 'Shield Generator', icon: '🛡️', cost: { energy: 40, water: 20, oxygen: 20 } },
];

export default function Home() {
  const initialized = useRef(false);
  const { 
    initializeGrid, 
    isRunning, 
    setIsRunning, 
    generation, 
    resources,
    selectedStructure,
    setSelectedStructure,
    speed,
    setSpeed,
    isGameOver,
    habitatCount,
  } = useGameStore();

  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (!initialized.current) {
      initializeGrid();
      initialized.current = true;
    }
  }, [initializeGrid]);

  if (!username) {
    return <UsernameModal onStart={(name) => setUsername(name)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900/20 to-black p-8">
      <main className="max-w-7xl mx-auto space-y-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-red-500">
            Mars Colonization
            {username && <span className="block text-sm font-normal text-white/80">Colonist: {username}</span>}
          </h1>
          <div className="flex gap-2 md:gap-4 items-center">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-4 md:px-6 py-2 text-sm md:text-base rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold"
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <select 
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="bg-black/30 text-white rounded-md px-2 md:px-3 py-1 md:py-2 text-sm md:text-base"
            >
              <option value={1000}>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Normal Speed
                </span>
              </option>
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
        {isGameOver && <GameOver />}

        <StatisticsPanel />
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

function StatisticsPanel() {
  const { generation, habitatCount, resources } = useGameStore();
  
  return (
    <div className="p-4 bg-black/30 rounded-xl backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
      <div className="space-y-2">
        <StatItem label="Total Generations" value={generation} />
        <StatItem label="Habitat Domes" value={habitatCount} />
        <StatItem label="Total Structures" value={
          Object.values(resources).reduce((a, b) => a + b, 0)
        } />
      </div>
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="flex justify-between text-white/80">
      <span>{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
} 