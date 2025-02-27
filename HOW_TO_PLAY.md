# Mars Colonization - Game Guide

## Game Overview
Mars Colonization is a survival strategy game based on Conway's Game of Life where you must build and maintain a sustainable colony on Mars by managing resources and structures.

## Basic Controls
1. Start/Pause: Use the button in the top right
2. Speed Control: Select game speed (500ms = Fast, 1000ms = Normal, 2000ms = Slow)
3. Structure Placement: Click a structure from the left panel, then click on the grid to place it

## Available Structures

### 1. Solar Array (☀️)
- Generates 12 energy per generation
- Cost: Water: 15, Oxygen: 10
- Best first structure to build

### 2. Oxygen Generator (💨)
- Generates 10 oxygen per generation
- Cost: Energy: 30, Water: 5

### 3. Water Extractor (💧)
- Generates 8 water per generation
- Cost: Energy: 25, Oxygen: 10

### 4. Habitat Dome (🏠)
- Basic living structure
- Cost: Energy: 20, Water: 10, Oxygen: 15
- Can appear automatically when conditions are right

### 5. Shield Generator (🛡️)
- Protects from hazards
- Cost: Energy: 40, Water: 20, Oxygen: 20

## Structure Status Colors
- Green: Thriving (>70% resources)
- Orange: Struggling (30-70% resources)
- Red: Dying (<30% resources)

## Hazards
Your colony faces three environmental threats:
- Dust Storms: 1% chance, 20 damage
- Radiation: 2% chance, 15 damage
- Meteors: 0.5% chance, 50 damage

## Resource System
- Each resource has a maximum value of 100
- Resources naturally decay over time:
  - Oxygen: -5 per generation
  - Water: -3 per generation
  - Energy: -4 per generation

## Neighbor Rules
- 0-1 neighbors: Structure dies
- 2-5 neighbors: Optimal performance
- 6+ neighbors: Structure dies from overcrowding
- Exactly 3 neighbors around empty space: New Habitat Dome appears 