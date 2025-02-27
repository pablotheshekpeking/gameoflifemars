import { create } from 'zustand';

const GRID_SIZE = { rows: 30, cols: 50 };
const RESOURCE_MAX = 100;
const RESOURCE_DECAY = {
  oxygen: 5,
  water: 3,
  energy: 4
};

const structures = [
  { id: 'habitat', name: 'Habitat Dome', cost: { energy: 20, water: 10, oxygen: 15 } },
  { id: 'oxygen', name: 'Oxygen Generator', cost: { energy: 30, water: 5, oxygen: 0 } },
  { id: 'water', name: 'Water Extractor', cost: { energy: 25, water: 0, oxygen: 10 } },
  { id: 'energy', name: 'Solar Array', cost: { energy: 0, water: 15, oxygen: 10 } },
  { id: 'shield', name: 'Shield Generator', cost: { energy: 40, water: 20, oxygen: 20 } },
];

const HAZARDS = {
  DUST_STORM: { chance: 0.01, damage: 20 },
  RADIATION: { chance: 0.02, damage: 15 },
  METEOR: { chance: 0.005, damage: 50 }
};

export const useGameStore = create((set) => ({
  grid: [],
  generation: 0,
  isRunning: false,
  speed: 1000,
  selectedStructure: null,
  resources: {
    oxygen: RESOURCE_MAX,
    water: RESOURCE_MAX,
    energy: RESOURCE_MAX,
  },
  weather: 'normal',

  initializeGrid: () => {
    const newGrid = Array(GRID_SIZE.rows).fill().map(() =>
      Array(GRID_SIZE.cols).fill().map(() => ({
        type: null,
        status: 'empty',
        resources: { oxygen: 0, water: 0, energy: 0 },
        shield: false,
      }))
    );
    set({ grid: newGrid });
  },

  placeStructure: (row, col, structureType) => {
    set((state) => {
      // Check if we have enough resources
      const structure = structures.find(s => s.id === structureType);
      if (!structure) return state;

      const canAfford = Object.entries(structure.cost).every(
        ([resource, cost]) => state.resources[resource] >= cost
      );

      if (!canAfford) return state;

      // Deduct resources
      const newResources = { ...state.resources };
      Object.entries(structure.cost).forEach(([resource, cost]) => {
        newResources[resource] -= cost;
      });

      const newGrid = [...state.grid];
      newGrid[row][col] = {
        type: structureType,
        status: 'thriving',
        resources: { oxygen: RESOURCE_MAX, water: RESOURCE_MAX, energy: RESOURCE_MAX },
        shield: structureType === 'shield',
      };

      return { grid: newGrid, resources: newResources };
    });
  },

  nextGeneration: () => {
    set((state) => {
      // Apply hazards
      let hazardType = null;
      if (Math.random() < HAZARDS.DUST_STORM.chance) hazardType = 'DUST_STORM';
      else if (Math.random() < HAZARDS.RADIATION.chance) hazardType = 'RADIATION';
      else if (Math.random() < HAZARDS.METEOR.chance) hazardType = 'METEOR';

      const newGrid = state.grid.map((row, i) => 
        row.map((cell, j) => {
          const neighbors = countNeighbors(state.grid, i, j);
          const newCell = { ...cell };

          if (cell.type) {
            // Apply hazard damage if applicable
            if (hazardType && !cell.shield) {
              const damage = HAZARDS[hazardType].damage;
              Object.keys(newCell.resources).forEach(resource => {
                newCell.resources[resource] = Math.max(0, 
                  newCell.resources[resource] - damage
                );
              });
            }

            // Resource management based on neighbor count
            const resourceMultiplier = neighbors > 5 ? 2 : // Overpopulation
                                     neighbors < 2 ? 1.5 : // Isolation
                                     1; // Normal decay

            // Resource depletion
            newCell.resources = {
              oxygen: Math.max(0, cell.resources.oxygen - RESOURCE_DECAY.oxygen * resourceMultiplier),
              water: Math.max(0, cell.resources.water - RESOURCE_DECAY.water * resourceMultiplier),
              energy: Math.max(0, cell.resources.energy - RESOURCE_DECAY.energy * resourceMultiplier),
            };

            // Status update based on resources
            const avgResources = Object.values(newCell.resources).reduce((a, b) => a + b, 0) / 3;
            newCell.status = avgResources > 70 ? 'thriving' : 
                            avgResources > 30 ? 'struggling' : 'dying';

            // Colony death conditions
            if (avgResources === 0 || neighbors > 6 || neighbors < 1) {
              newCell.type = null;
              newCell.status = 'empty';
              newCell.resources = { oxygen: 0, water: 0, energy: 0 };
            }
          } else if (neighbors === 3) {
            // New colony formation
            newCell.type = 'habitat';
            newCell.status = 'thriving';
            newCell.resources = { oxygen: RESOURCE_MAX, water: RESOURCE_MAX, energy: RESOURCE_MAX };
          }

          return newCell;
        })
      );

      // Update global resources
      const globalResources = { ...state.resources };
      const activeCells = newGrid.flat().filter(cell => cell.type);
      const resourceGeneration = activeCells.reduce((acc, cell) => {
        if (cell.type === 'oxygen') acc.oxygen += 10;
        if (cell.type === 'water') acc.water += 8;
        if (cell.type === 'energy') acc.energy += 12;
        return acc;
      }, { oxygen: 0, water: 0, energy: 0 });

      Object.keys(globalResources).forEach(resource => {
        globalResources[resource] = Math.min(
          RESOURCE_MAX,
          globalResources[resource] + resourceGeneration[resource] - 
          (activeCells.length * RESOURCE_DECAY[resource])
        );
      });

      return { 
        grid: newGrid,
        generation: state.generation + 1,
        resources: globalResources,
        weather: hazardType ? hazardType.toLowerCase() : 'normal'
      };
    });
  },

  setSelectedStructure: (structure) => set({ selectedStructure: structure }),
  setIsRunning: (running) => set({ isRunning: running }),
  setSpeed: (speed) => set({ speed }),
}));

function countNeighbors(grid, row, col) {
  let count = 0;
  const directions = [
    [-1,-1], [-1,0], [-1,1],
    [0,-1],          [0,1],
    [1,-1],  [1,0],  [1,1]
  ];

  for (const [dx, dy] of directions) {
    const newRow = row + dx;
    const newCol = col + dy;
    if (
      newRow >= 0 && newRow < grid.length &&
      newCol >= 0 && newCol < grid[0].length &&
      grid[newRow][newCol].type
    ) {
      count++;
    }
  }
  return count;
} 