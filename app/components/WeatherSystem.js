import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

const weatherTypes = {
  normal: { icon: '☀️', label: 'Clear Skies', description: 'Normal conditions' },
  dust_storm: { icon: '🌪️', label: 'Dust Storm', description: 'Reduces energy production' },
  radiation: { icon: '☢️', label: 'Solar Radiation', description: 'Damages unshielded structures' },
  meteor: { icon: '☄️', label: 'Meteor Shower', description: 'Can destroy structures' },
};

export default function WeatherSystem() {
  const { weather } = useGameStore();

  const currentWeather = weatherTypes[weather.toLowerCase()] || weatherTypes.normal;

  return (
    <motion.div
      className="bg-black/30 rounded-xl p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold text-white mb-4">Weather System</h2>
      
      <div className="flex items-center space-x-4">
        <div className="text-4xl">{currentWeather.icon}</div>
        <div>
          <div className="text-lg font-semibold text-white">
            {currentWeather.label}
          </div>
          <div className="text-sm text-white/60">
            {currentWeather.description}
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-white/80">
        <p>Weather conditions change periodically and affect your colony's performance.</p>
      </div>
    </motion.div>
  );
} 