var dotMargin = 0.1;
var numRows = 100;
var numCols = 200;
var concurrentUpdates = 50;
var canvas = document.getElementById("c");
var context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var updates = [];

var dotWidth = ((canvasWidth - (2 * dotMargin)) / numCols) - dotMargin;
var dotHeight = ((canvasHeight - (2 * dotMargin)) / numRows) - dotMargin;

if ( dotWidth > dotHeight ) {
    var dotDiameter = dotHeight;
    var dotRadius = dotDiameter * 0.5;
    var xMargin = (canvasWidth - ((2 * dotMargin) + (numCols * dotDiameter))) / numCols;
    var yMargin = dotMargin;
} else {
    var dotDiameter = dotWidth;
    var dotRadius = dotDiameter * 0.5;
    var xMargin = dotMargin;
    var yMargin = (canvasHeight - ((2 * dotMargin) + (numRows * dotDiameter))) / numRows;
}

function calculateIntervals(min, max, num) {
    var delta = (max - min) / num;
    intervals = [];
    for (let i = 0; i < num; i++) {
        intervals.push(min + delta * i);
    }

    return intervals;
}

preCalculatedLengths = [
    calculateIntervals(0.4 * dotRadius, dotRadius, 10),
    calculateIntervals(0.4 * dotRadius, dotRadius, 20),
    calculateIntervals(0.4 * dotRadius, dotRadius, 25),
    calculateIntervals(0.4 * dotRadius, dotRadius, 30),
    calculateIntervals(0.4 * dotRadius, dotRadius, 40)
];

function updateArray(currentIndex, dotRadii, selectedColumn) {
    this.currentColumnIndex = currentIndex;
    this.dotRadii = dotRadii;
    this.selectedColumn = selectedColumn;
    this.active = true;
}

function updateDots() {
    window.requestAnimationFrame(updateDots);

    while(updates.length < concurrentUpdates) {
        updates.push(
            new updateArray(
                Math.floor(Math.random() * numRows) - 40,
                preCalculatedLengths[Math.floor(Math.random() * preCalculatedLengths.length)],
                Math.floor(Math.random() * numCols)
            )
        );
    };

    updates.forEach(u => {
        for (let i = 0; i < u.dotRadii.length; i++) {
            if ((u.currentColumnIndex) < numRows) {
                var x = (u.selectedColumn * (dotDiameter + xMargin)) + dotMargin + (xMargin / 2) + dotRadius;
                var y = ((i + u.currentColumnIndex) * (dotDiameter + yMargin)) + dotMargin + (yMargin / 2) + dotRadius;
                overwriteDot(x, y, dotRadius);
                drawDot(x, y, u.dotRadii[i]);
            }
            if (u.currentColumnIndex > numRows) {
                u.active = false;
            }
        }
        var previousY = ((u.currentColumnIndex) * (dotDiameter + yMargin)) + dotMargin + (yMargin / 2) + dotRadius;
        drawDot(x, previousY, dotRadius * 0.4);
        u.currentColumnIndex++;
        var newUpdates = updates.filter(u => u.active);
        updates = newUpdates;
    });
}

for (var i = 0; i < numRows; i++) {
    for (var j = 0; j < numCols; j++) {
        var x = (j * (dotDiameter + xMargin)) + dotMargin + (xMargin / 2) + dotRadius;
        var y = (i * (dotDiameter + yMargin)) + dotMargin + (yMargin / 2) + dotRadius;
        drawDot(x, y, dotRadius * 0.4);
    }
}

function drawDot(x, y, radius) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = '#00FEFF';
    context.fill();
}


function overwriteDot(x, y, radius) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = '#000000';
    context.fill();
}

updateDots();