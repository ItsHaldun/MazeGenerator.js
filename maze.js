class Maze {
	constructor(settings, canvasWidth, canvasHeight) {
		// Finish mark lets you skip the step function
		this.finished = false;

		// Get the maze settings
		this.settings = settings;
		this.size = settings.maze.size;
		this.margins = settings.maze.margins;

		// Calculate the needed cell size
		this.cellSize = (canvasWidth<canvasHeight) ? floor((canvasWidth-this.margins.bottom)/this.size): floor((canvasHeight-this.margins.right)/this.size);

		// Create the cell grid
		this.grid = [];

		for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				this.grid.push(new Cell(i, j, j*this.cellSize + this.margins.left, i*this.cellSize + this.margins.top, this.cellSize, settings));
			}
		}

		// STEP 1: Make the initial cell the current cell and mark it as visited
		this.currentCell = this.grid[0];
		this.currentCell.visited = true;
		this.currentCell.current = true;
		this.stack = [];
	}

	// Steps through the generation algorithm
	step() {
		if (this.finished) {
			return;
		}
		// STEP 2: Check for unvisited cells
		if (this.checkUnvisitedCells()) {
			// STEP 2.1: Check if the current cell has any unvisited neighbors
			let neighbors = this.getNeighbors(this.currentCell);

			if (neighbors.length > 0) {
				// STEP 2.1.1: Chose one of the neighbors randomly
				let chosenCell = neighbors[floor(random(neighbors.length))];
				
				// STEP 2.1.2: Push the current cell to the stack
				this.stack.push(this.currentCell);

				// STEP 2.1.3: Remove the wall between current cell and chosen cell
				this.currentCell.removeWallsBetween(chosenCell);

				// STEP 2.1.4: Make the chosen cell current cell and mark it as visited
				this.currentCell.current = false;
				
				chosenCell.current = true;
				chosenCell.visited = true;

				this.currentCell = chosenCell;
			}
			// STEP 2.2: If all neighbors are visited and stack is not empty
			else if (this.stack.length > 0) {
				this.currentCell.current = false;

				this.currentCell = this.stack.pop();
				this.currentCell.current = true;
				this.currentCell.visited = true;
			}
		}
		// STEP 3: When the maze is complete, mark the stark and end cells and remove the walls
		else {
			this.currentCell.current = false;
			
			// Remove the walls the the start and end cells
			this.grid[0].walls[3] = false;
			this.grid[this.size**2 - 1].walls[1] = false;

			// Mark the maze as finished
			this.finished = true;
		}
	}

	// Fetch the UNVISITED neighbors of a given cell
	getNeighbors(cell) {
		let neighbors = [];
		let neighbor;
		if (cell.i>0) {
			// TOP
			neighbor = this.grid[(cell.i-1)*this.size + cell.j];
			if (!neighbor.visited) {
				neighbors.push(neighbor);
			}
		}
		if (cell.j<this.size-1) {
			// RIGHT
			neighbor = this.grid[(cell.i)*this.size + cell.j + 1]
			if (!neighbor.visited) {
				neighbors.push(neighbor);
			}
		}
		if (cell.i<this.size-1) {
			// BOTTOM
			neighbor = this.grid[(cell.i+1)*this.size + cell.j];
			if (!neighbor.visited) {
				neighbors.push(neighbor);
			}
		}
		if (cell.j>0) {
			// LEFT
			neighbor = this.grid[(cell.i)*this.size + cell.j - 1];
			if (!neighbor.visited) {
				neighbors.push(neighbor);
			}
		}
		return neighbors;
	}

	// Checks if there are unvisited cells
	checkUnvisitedCells() {
		for (let n = 0; n < this.grid.length; n++) {
			if (!this.grid[n].visited) {
				return true;
			}
		}
		return false;
	}

	draw() {
		// Draw the cells
		for (let n = 0; n < this.grid.length; n++) {
			this.grid[n].draw();
		}

		// Draw the start and end marks
		if (this.finished) {
			strokeWeight(this.settings.markings.strokeWeight);
			stroke(this.settings.markings.stroke);
			push();
			// Start mark
			translate(this.margins.left, 
								this.margins.top);
			
			fill(this.settings.markings.startColor);
			triangle(1*this.cellSize/6, 1*this.cellSize/3,
							 2*this.cellSize/4, 1*this.cellSize/2,
							 1*this.cellSize/6, 2*this.cellSize/3);
			pop();
			
			// End mark
			push();
			translate(this.cellSize * (this.size-1) + this.margins.left, 
								this.cellSize * (this.size-1) + this.margins.top);
			
			fill(this.settings.markings.endColor);
			triangle(3*this.cellSize/6, 1*this.cellSize/3,
							 5*this.cellSize/6, 1*this.cellSize/2,
							 3*this.cellSize/6, 2*this.cellSize/3);
			pop();
		}
	}
}