var settings;
var canvasWidth, canvasHeight;
var maze;

function preload() {
  // Get the most recent earthquake in the database
  settings = loadJSON("settings.json");
}

function setup() {
  // Get the width from settings
	if (settings.canvas.width == "max") {
		canvasWidth = windowWidth;
	}
	else {
		canvasWidth = settings.canvas.width
	}

	// Get the height from settings
	if (settings.canvas.height == "max") {
		canvasHeight = windowHeight - settings.canvas.headerOffset;
	}
	else {
		canvasHeight = settings.canvas.height - settings.canvas.headerOffset;
	}

  createCanvas(canvasWidth, canvasHeight);

	// Create the Maze
	maze = new Maze(settings, canvasWidth, canvasHeight);
}

function draw() {
  // put drawing code here
  background(255);

	maze.step();
	maze.draw();
}