import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export default function ResourcePanel() {
  const { resources } = useGameStore();

  const resourceTypes = [
    { id: 'energy', name: 'Energy', icon: '⚡' },
    { id: 'water', name: 'Water', icon: '💧' },
    { id: 'oxygen', name: 'Oxygen', icon: '💨' },
  ];

  return (
    <div className="bg-black/30 rounded-xl p-4">
      <h2 className="text-xl font-bold text-white mb-4">Resources</h2>
      
      <div className="space-y-3">
        {resourceTypes.map((resource) => (
          <ResourceBar
            key={resource.id}
            icon={resource.icon}
            name={resource.name}
            value={resources[resource.id]}
            maxValue={100}
          />
        ))}
      </div>

      <div className="mt-6 p-3 bg-black/20 rounded-lg">
        <h3 className="text-sm font-semibold text-white/80 mb-2">Resource Tips</h3>
        <ul className="text-xs text-white/60 space-y-1">
          <li>• Build Solar Arrays for energy</li>
          <li>• Water Extractors provide water</li>
          <li>• Oxygen Generators produce oxygen</li>
          <li>• Balance resources for survival</li>
        </ul>
      </div>
    </div>
  );
}

function ResourceBar({ icon, name, value, maxValue }) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-white/80">
          {icon} {name}
        </span>
        <span className="text-white/60">
          {value}/{maxValue}
        </span>
      </div>
      <div className="h-2 bg-black/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-red-500"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
} 