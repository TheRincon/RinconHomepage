const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
const backgroundColor = 0;
const positionIncrement = 10;
const colorIncrement = 3;

let x = canvasWidth / 2;
let y = canvasHeight / 2;
let red = 128;
let green = 128;
let blue = 128;

function mousePressed() {
    noLoop();
}

function keyPressed() {
    setup();
}

function mouseReleased() {
    loop();
}

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    background(backgroundColor);
    stroke(red, green, blue);
}

function draw() {
    let x1 = randomChange(x, positionIncrement, 0, canvasWidth - 1);
    let y1 = randomChange(y, positionIncrement, 0, canvasHeight - 1);
    strokeWeight(2);
    line(x, y, x1, y1);
    x = x1;
    y = y1

    red = randomChange(red, colorIncrement, 0, 255);
    green = randomChange(green, colorIncrement, 0, 255);
    blue = randomChange(blue, colorIncrement, 0, 255);
    stroke(red, green, blue);
}

function randomChange(original, increment, min, max) {
    let v = original + Math.floor(random(-increment, increment+1));
    if (v < min) {
        v = v + increment;
    }
    if (v > max) {
        v = v - increment;
    }

    return v;
}