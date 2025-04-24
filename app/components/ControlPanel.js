import { useGameStore } from '../store/gameStore';

const structures = [
  { id: 'habitat', name: 'Habitat Dome', icon: '🏠', cost: { energy: 20, water: 10, oxygen: 15 } },
  { id: 'oxygen', name: 'Oxygen Generator', icon: '💨', cost: { energy: 30, water: 5, oxygen: 0 } },
  { id: 'water', name: 'Water Extractor', icon: '💧', cost: { energy: 25, water: 0, oxygen: 10 } },
  { id: 'energy', name: 'Solar Array', icon: '☀️', cost: { energy: 0, water: 15, oxygen: 10 } },
  { id: 'shield', name: 'Shield Generator', icon: '🛡️', cost: { energy: 40, water: 20, oxygen: 20 } },
];

export default function ControlPanel() {
  const { 
    isRunning, 
    setIsRunning, 
    speed,
    setSpeed,
    selectedStructure,
    setSelectedStructure,
    resetGame,
    level,
    score,
    turnsLeft
  } = useGameStore();

  // Calculate required score for current level
  const requiredScore = level * 100; // This should match the calculation in your gameStore
  const progressPercentage = Math.min((score / requiredScore) * 100, 100);

  return (
    <div className="bg-black/30 rounded-xl p-4 space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Control Panel</h2>
      
      {/* Level Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-white/80">
          <span>Level Progress</span>
          <span>{score} / {requiredScore} points</span>
        </div>
        <div className="h-2 bg-black/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-500 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-white/60">
          <span>Turns left: {turnsLeft}</span>
          <span>Level {level}</span>
        </div>
      </div>

      {/* Game Controls */}
      <div className="space-y-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        
        <button
          onClick={resetGame}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Reset Game
        </button>
      </div>

      {/* Speed Control */}
      <div className="space-y-2">
        <label className="text-white text-sm">Simulation Speed</label>
        <select
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-full bg-black/20 text-white py-2 px-4 rounded-lg"
        >
          <option value={1000}>Normal</option>
          <option value={500}>Fast</option>
          <option value={2000}>Slow</option>
        </select>
      </div>

      {/* Structure Selection */}
      <div className="space-y-2">
        <h3 className="text-white text-sm">Build Structures</h3>
        <div className="grid grid-cols-2 gap-2">
          {structures.map((structure) => (
            <button
              key={structure.id}
              onClick={() => setSelectedStructure(structure.id)}
              className={`p-2 rounded-lg text-center ${
                selectedStructure === structure.id
                  ? 'bg-red-600 text-white'
                  : 'bg-black/20 text-white/80 hover:bg-black/30'
              }`}
            >
              <div className="text-2xl mb-1">{structure.icon}</div>
              <div className="text-xs">{structure.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 