'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'sonner';
import { useGameStore } from './store/gameStore';
import GameGrid from './components/GameGrid';
import GameOver from './components/GameOver';
import UsernameModal from './components/UsernameModal';
import ControlPanel from './components/ControlPanel';
import ResourcePanel from './components/ResourcePanel';
import WeatherSystem from './components/WeatherSystem';
import InfoModal from './components/InfoModal';

const structures = [
  { id: 'habitat', name: 'Habitat Dome', icon: '🏠', cost: { energy: 20, water: 10, oxygen: 15 } },
  { id: 'oxygen', name: 'Oxygen Generator', icon: '💨', cost: { energy: 30, water: 5, oxygen: 0 } },
  { id: 'water', name: 'Water Extractor', icon: '💧', cost: { energy: 25, water: 0, oxygen: 10 } },
  { id: 'energy', name: 'Solar Array', icon: '☀️', cost: { energy: 0, water: 15, oxygen: 10 } },
  { id: 'shield', name: 'Shield Generator', icon: '🛡️', cost: { energy: 40, water: 20, oxygen: 20 } },
];

export default function Home() {
  const initialized = useRef(false);
  const [showInfoModal, setShowInfoModal] = useState(true);
  const { 
    resetGame, 
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
    // Initialize the game when the component mounts
    if (typeof window !== 'undefined') {
      resetGame();
    }
  }, []);

  if (!username) {
    return <UsernameModal onStart={(name) => setUsername(name)} />;
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-red-900 to-red-950">
      <Toaster position="top-center" expand={true} richColors />
      
      <InfoModal 
        isOpen={showInfoModal} 
        onClose={() => setShowInfoModal(false)} 
        style={{ position: 'fixed', top: '10px', right: '10px' }}
      />

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-center text-red-100">
            Mars Colony Simulator
          </h1>
          <button
            onClick={() => setShowInfoModal(true)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            ℹ️
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <ResourcePanel />
          </div>
          
          <div className="lg:col-span-6">
            <GameGrid />
          </div>
          
          <div className="lg:col-span-3">
            <ControlPanel />
          </div>
        </div>

        <WeatherSystem />
      </div>
    </main>
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