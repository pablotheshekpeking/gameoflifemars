import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Tutorial() {
  const [step, setStep] = useState(0);
  const steps = [
    { title: 'Welcome', content: 'Build a sustainable colony on Mars!' },
    { title: 'Resources', content: 'Manage Oxygen, Water, and Energy' },
    { title: 'Structures', content: 'Place structures to generate resources' },
    { title: 'Hazards', content: 'Protect your colony from environmental threats' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-8 right-8 bg-black/50 p-6 rounded-xl backdrop-blur-sm"
    >
      <h3 className="text-lg font-semibold text-white">{steps[step].title}</h3>
      <p className="text-white/80 mt-2">{steps[step].content}</p>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          className="px-4 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setStep(step + 1)}
          disabled={step === steps.length - 1}
          className="px-4 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
} 