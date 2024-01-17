class Cell {
	constructor(i, j, x, y, size, settings) {
		this.i = i;
		this.j = j;
		this.x = x;
		this.y = y;

		// Get the size and colors from the Settings File
		this.size = size;
		this.hiddenColor = settings.cell.cellColors.hidden;
		this.visitedColor = settings.cell.cellColors.visited;
		this.currentColor = settings.cell.cellColors.current;
		this.borderColor = settings.cell.cellColors.border;
		this.wallSize = settings.cell.wallSize;

		// Set up the default states of the cell
		this.current = false;
		this.visited = false;

		// Array for the visibility state of the walls
		// TOP RIGHT BOTTOM LEFT
		this.walls = [true, true, true, true];
	}

	// Remove the overlapping walls between two cells
	removeWallsBetween(neighbor) {
		// NEIGHBOR ON TOP
		if (this.i > neighbor.i && this.j == neighbor.j) {
			this.walls[0] = false;
			neighbor.walls[2] = false;
		}
		// NEIGHBOR ON RIGHT
		else if (this.i == neighbor.i && this.j < neighbor.j) {
			this.walls[1] = false;
			neighbor.walls[3] = false;
		}
		// NEIGHBOR ON TOP
		else if (this.i < neighbor.i && this.j == neighbor.j) {
			this.walls[2] = false;
			neighbor.walls[0] = false;
		}
		// NEIGHBOR ON LEFT
		else if (this.i == neighbor.i && this.j > neighbor.j) {
			this.walls[3] = false;
			neighbor.walls[1] = false;
		}
	}

	draw() {
		push();
		// Chose the appropriate fill color
		if (this.current) {
			fill(this.currentColor);
		}
		else if (this.visited) {
			fill(this.visitedColor);
		}
		else {
			fill(this.hiddenColor);
		}

		// Draw the cell
		noStroke();
		rect(this.x, this.y, this.size, this.size);

		// Draw the walls
		stroke(this.borderColor);
		strokeWeight(this.wallSize);

		if (this.walls[0]) {
			// TOP
			line(this.x, this.y, this.x + this.size, this.y);
		}
		if (this.walls[1]) {
			// RIGHT
			line(this.x + this.size, this.y, this.x + this.size, this.y + this.size);
		}
		if (this.walls[2]) {
			// BOTTOM
			line(this.x, this.y + this.size, this.x + this.size, this.y + this.size);
		}
		if (this.walls[3]) {
			// LEFT
			line(this.x, this.y, this.x, this.y + this.size);
		}
		pop();
	}
}