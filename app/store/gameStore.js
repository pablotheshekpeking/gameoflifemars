import { create } from 'zustand';
import { toast } from 'sonner';

const INITIAL_LEVEL = 1;
const BASE_GRID_SIZE = 6; // Starting with a 6x6 grid
const MAX_LEVEL = 10;

const getLevelConfig = (level) => ({
  gridSize: BASE_GRID_SIZE + Math.floor(level / 2), // Grid grows every 2 levels
  requiredScore: level * 100,
  maxTurns: 30 + (level * 5),
  survivalThreshold: Math.max(2, Math.min(4, 2 + Math.floor(level / 3))), // Gets harder to survive
});

const createInitialGrid = (size) => {
  return Array(size).fill().map(() => 
    Array(size).fill().map(() => ({
      type: '',
      status: '',
      shield: false,
    }))
  );
};

const loadGameState = () => {
  if (typeof window === 'undefined') {
    // Return default state for SSR
    return {
      level: INITIAL_LEVEL,
      score: 0,
      turnsLeft: 30,
      grid: createInitialGrid(BASE_GRID_SIZE),
      resources: {
        energy: 100,
        water: 100,
        oxygen: 100,
      },
      weather: 'normal',
    };
  }

  const saved = localStorage.getItem('marsGameState');
  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
};

export const useGameStore = create((set, get) => {
  const initialState = loadGameState();
  
  return {
    // Initial state
    level: initialState?.level ?? INITIAL_LEVEL,
    score: initialState?.score ?? 0,
    turnsLeft: initialState?.turnsLeft ?? 30,
    grid: initialState?.grid ?? createInitialGrid(BASE_GRID_SIZE),
    isRunning: false,
    speed: 1000,
    selectedStructure: '',
    weather: initialState?.weather ?? 'normal',
    resources: initialState?.resources ?? {
      energy: 100,
      water: 100,
      oxygen: 100,
    },

    // Actions
    setIsRunning: (running) => set({ isRunning: running }),
    setSpeed: (newSpeed) => set({ speed: newSpeed }),
    setSelectedStructure: (structure) => set({ selectedStructure: structure }),
    
    saveGameState: () => {
      const state = get();
      localStorage.setItem('marsGameState', JSON.stringify({
        level: state.level,
        score: state.score,
        turnsLeft: state.turnsLeft,
        grid: state.grid,
        resources: state.resources,
        weather: state.weather,
      }));
    },

    retryLevel: () => {
      const state = get();
      const config = getLevelConfig(state.level);
      
      set({
        score: 0,
        turnsLeft: config.maxTurns,
        isRunning: false,
        // Keep the existing grid but update statuses
        grid: state.grid.map(row => 
          row.map(cell => ({
            ...cell,
            status: cell.type ? 'thriving' : '',
          }))
        ),
        // Penalize resources for retry
        resources: {
          energy: Math.max(0, state.resources.energy - 20),
          water: Math.max(0, state.resources.water - 15),
          oxygen: Math.max(0, state.resources.oxygen - 15),
        }
      });
      
      toast.info('Level Retry', {
        description: 'Retrying level with existing structures. Resources reduced as penalty.'
      });
      
      get().saveGameState();
    },

    nextGeneration: () => {
      const state = get();
      const { grid, level, turnsLeft, resources } = state;
      const config = getLevelConfig(level);
      
      if (turnsLeft <= 0) {
        set({ isRunning: false });
        toast.error('Out of Turns', {
          description: 'Retry this level or reset to Level 1?',
          action: {
            label: 'Retry Level',
            onClick: () => get().retryLevel()
          }
        });
        return;
      }

      // Calculate resource impact from existing structures
      const resourceImpact = grid.flat().reduce((impact, cell) => {
        if (!cell.type) return impact;
        
        switch (cell.status) {
          case 'thriving':
            return {
              energy: impact.energy + 2,
              water: impact.water + 2,
              oxygen: impact.oxygen + 2
            };
          case 'struggling':
            return {
              energy: impact.energy - 1,
              water: impact.water - 1,
              oxygen: impact.oxygen - 1
            };
          case 'dying':
            return {
              energy: impact.energy - 3,
              water: impact.water - 3,
              oxygen: impact.oxygen - 3
            };
          default:
            return impact;
        }
      }, { energy: 0, water: 0, oxygen: 0 });

      const newGrid = grid.map((row, i) => 
        row.map((cell, j) => {
          if (!cell.type) return cell;

          const neighbors = countNeighbors(grid, i, j);
          let newStatus = cell.status;
          
          // Stricter survival rules
          if (neighbors < config.survivalThreshold + 1) {
            newStatus = 'dying';
          } else if (neighbors === config.survivalThreshold + 1) {
            newStatus = 'struggling';
          } else if (neighbors > config.survivalThreshold + 1) {
            newStatus = 'thriving';
          }
          
          return { ...cell, status: newStatus };
        })
      );

      const newScore = state.score + calculateTurnScore(newGrid);
      const newTurnsLeft = turnsLeft - 1;

      // Update resources based on structure impact
      const newResources = {
        energy: Math.min(100, Math.max(0, resources.energy + resourceImpact.energy)),
        water: Math.min(100, Math.max(0, resources.water + resourceImpact.water)),
        oxygen: Math.min(100, Math.max(0, resources.oxygen + resourceImpact.oxygen)),
      };

      // Check win condition
      if (newScore >= config.requiredScore) {
        const nextLevel = Math.min(state.level + 1, MAX_LEVEL);
        set({ 
          level: nextLevel,
          score: 0,
          turnsLeft: getLevelConfig(nextLevel).maxTurns,
          // Keep existing grid but expand it if needed
          grid: expandGrid(newGrid, getLevelConfig(nextLevel).gridSize),
          isRunning: false,
          // Bonus resources for completing level
          resources: {
            energy: Math.min(100, newResources.energy + 10),
            water: Math.min(100, newResources.water + 10),
            oxygen: Math.min(100, newResources.oxygen + 10),
          }
        });
        toast.success('Level Complete!', {
          description: `Advanced to level ${nextLevel}. Existing structures carried over!`
        });
      } else {
        set({ 
          grid: newGrid, 
          score: newScore,
          turnsLeft: newTurnsLeft,
          resources: newResources
        });
      }

      get().saveGameState();
    },

    placeStructure: (i, j, structureType) => {
      const state = get();
      const newGrid = [...state.grid];
      newGrid[i][j] = {
        type: structureType,
        status: 'thriving',
        shield: false,
      };
      set({ grid: newGrid });
      get().saveGameState();
    },

    resetGame: () => {
      const initialState = {
        level: INITIAL_LEVEL,
        score: 0,
        turnsLeft: getLevelConfig(INITIAL_LEVEL).maxTurns,
        grid: createInitialGrid(BASE_GRID_SIZE),
        isRunning: false,
      };
      set(initialState);
      localStorage.setItem('marsGameState', JSON.stringify(initialState));
    },
  };
});

function countNeighbors(grid, i, j) {
  let count = 0;
  for (let di = -1; di <= 1; di++) {
    for (let dj = -1; dj <= 1; dj++) {
      if (di === 0 && dj === 0) continue;
      const ni = i + di;
      const nj = j + dj;
      if (ni >= 0 && ni < grid.length && nj >= 0 && nj < grid[0].length) {
        if (grid[ni][nj].type) count++;
      }
    }
  }
  return count;
}

function calculateTurnScore(grid) {
  return grid.flat().reduce((score, cell) => {
    if (cell.status === 'thriving') return score + 10;
    if (cell.status === 'struggling') return score + 5;
    return score;
  }, 0);
}

// Helper function to expand grid while preserving existing structures
function expandGrid(currentGrid, newSize) {
  if (currentGrid.length >= newSize) return currentGrid;

  const newGrid = Array(newSize).fill().map(() => 
    Array(newSize).fill().map(() => ({
      type: '',
      status: '',
      shield: false,
    }))
  );

  // Copy existing structures to new grid
  currentGrid.forEach((row, i) => {
    row.forEach((cell, j) => {
      newGrid[i][j] = { ...cell };
    });
  });

  return newGrid;
} 