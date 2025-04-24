Survival Rules:
The survival threshold depends on the level: survivalThreshold: Math.max(2, Math.min(4, 2 + Math.floor(level / 3)))
For Level 1: You need 2 neighbors for structures to survive
As levels increase, you need more neighbors (up to 4 maximum)
Structure Status:
If neighbors < survivalThreshold: Status becomes "dying" (red)
If neighbors = survivalThreshold: Status becomes "struggling" (orange)
If neighbors > survivalThreshold: Status becomes "thriving" (green)
Scoring:
Thriving structures: +10 points
Struggling structures: +5 points
Dying structures: 0 points
Neighbor Counting:
The game counts all adjacent structures (including diagonals)
Empty cells don't count as neighbors
All structure types count as neighbors (habitat, oxygen, water, energy, shield)
So for a habitat to survive in Level 1:
It needs at least 2 neighboring structures
Having exactly 2 neighbors makes it "struggling"
Having 3 or more neighbors makes it "thriving"
Having fewer than 2 neighbors makes it "dying"
Best practices for habitat survival:
Place habitats with at least 2-3 other structures around them
Mix different structure types around habitats (oxygen, water, energy)
Don't overcrowd - too many neighbors can be as bad as too few
Use shield generators to protect important habitat clusters
Monitor the status colors:
Green: Thriving (optimal)
Orange: Struggling (needs attention)
Red: Dying (needs immediate help)