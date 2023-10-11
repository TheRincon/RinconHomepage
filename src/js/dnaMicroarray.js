var dotMargin = 0.1;
var numRows = 50;
var numCols = 100;
var concurrentUpdates = 200;
var canvas = document.getElementById("c");
var context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var updates = [];
var cachedDots = {};

var dotWidth = ((canvasWidth - (2 * dotMargin)) / numCols) - dotMargin;
var dotHeight = ((canvasHeight - (2 * dotMargin)) / numRows) - dotMargin;

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

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
        intervals.push(Math.floor(min + delta * i));
    }

    return intervals;
}

function getRandomIntervalInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
  

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : '';
}

function microDot(color, coordinates) {
    this.color = color;
    this.coordinates = coordinates;
}

function updateDots() {
    window.requestAnimationFrame(updateDots);

    while(updates.length < concurrentUpdates) {
        var candidateDot = cachedDots[String(getRandomInt(numRows)) + String(getRandomInt(numCols))];

        if (candidateDot.spectrum) {
            continue;
        } else {
            var spectrumLength = getRandomIntervalInt(0, 100);
            var beginColor = hexToRgb(candidateDot.color);
            if (!beginColor) {
                beginColor = [getRandomIntervalInt(0, 255), getRandomIntervalInt(0, 255)];
            }
            var endColor = [getRandomIntervalInt(0, 255), getRandomIntervalInt(0, 255)];
            var raw = zip(calculateIntervals(beginColor[0], endColor[0], spectrumLength), calculateIntervals(beginColor[1], endColor[1], spectrumLength));
            var spectrum = raw.map(c => rgbToHex(c[0], c[1], 0));
            candidateDot.spectrum = spectrum;
            candidateDot.status = [0, spectrumLength - 1];
            updates.push(candidateDot);
        }
    };

    updates.forEach(dot => {
        if (dot.status[0] >= dot.status[1]) {
            dot.color = hexToRgb(dot.spectrum[dot.status[1]]);
            dot.spectrum = '';
            dot.status = [];
            cachedDots[String(dot.coordinates[0]) + String(dot.coordinates[1])] = dot;
        } else {
            drawDot(
                (dot.coordinates[1] * (dotDiameter + xMargin)) + dotMargin + (xMargin / 2) + dotRadius,
                (dot.coordinates[0] * (dotDiameter + yMargin)) + dotMargin + (yMargin / 2) + dotRadius,
                dotRadius,
                dot.spectrum[dot.status[0]]
            );
        }
        dot.status[0]++;
    });

    var newUpdates = updates.filter(u => u.spectrum);
    updates = newUpdates;
}

for (var i = 0; i < numRows; i++) {
    for (var j = 0; j < numCols; j++) {
        var x = (j * (dotDiameter + xMargin)) + dotMargin + (xMargin / 2) + dotRadius;
        var y = (i * (dotDiameter + yMargin)) + dotMargin + (yMargin / 2) + dotRadius;
        var startColor = rgbToHex(getRandomIntervalInt(0, 255), getRandomIntervalInt(0, 255));
        cachedDots[String(i) + String(j)] = new microDot(startColor, [i, j]);
        drawDot(x, y, dotRadius, startColor);
    }
}

function drawDot(x, y, radius, color) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
}

updateDots();