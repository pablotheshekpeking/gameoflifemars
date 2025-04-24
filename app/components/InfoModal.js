'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InfoModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg max-h-[90vh] overflow-y-auto bg-black/80 backdrop-blur-md p-6 rounded-xl z-50 text-white shadow-xl border border-white/10"
          >
            <div className="relative">
              <button
                onClick={onClose}
                className="absolute right-0 top-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
              
              <h2 className="text-2xl font-bold mb-6 pr-8">How to Play</h2>
              
              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold text-red-400">Game Objective</h3>
                  <p className="text-white/80">Build and maintain a thriving Mars colony by strategically placing structures and managing resources.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-red-400">Structures</h3>
                  <ul className="list-disc list-inside text-white/80 space-y-2">
                    <li>🏠 Habitat Dome - Houses colonists</li>
                    <li>💨 Oxygen Generator - Produces oxygen</li>
                    <li>💧 Water Extractor - Collects water</li>
                    <li>☀️ Solar Array - Generates energy</li>
                    <li>🛡️ Shield Generator - Protects from hazards</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-red-400">Levels</h3>
                  <p className="text-white/80">
                    Each level has a score target to achieve within a limited number of turns. 
                    The grid size and difficulty increase as you progress.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-red-400">Scoring</h3>
                  <ul className="list-disc list-inside text-white/80">
                    <li>Thriving structures: +10 points</li>
                    <li>Struggling structures: +5 points</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-red-400">Tips</h3>
                  <ul className="list-disc list-inside text-white/80 space-y-1">
                    <li>Place structures adjacent to each other for better survival</li>
                    <li>Balance your resources to maintain colony growth</li>
                    <li>Use shields to protect against hazardous weather</li>
                    <li>Plan your structure placement carefully - you have limited turns!</li>
                  </ul>
                </section>
              </div>

              <button
                onClick={onClose}
                className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors font-semibold"
              >
                Got it!
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 