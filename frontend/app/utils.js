
// resize frame
function resizeFrame({ force } = {}) {
    // todo: simplify
    // todo: move to canvas.parentNode.clientWidth
    // ignore already sized screens
    let sized = canvas.width === (window.innerWidth) && (canvas.height === window.innerHeight);
    if (!sized || force) {


        // update game screen
        gameScreen = [{
            // width and height
            width: window.innerWidth,
            height: window.innerHeight
        }]
        .map(s => Object.assign(s, {
            // scale
            scale: ((s.width + s.height) / 2) * 0.002
        }))
        .map(s => Object.assign(s, {
            // position
            // x: horizontal from origin
            // y: height from origin
            // z: offset from origin
            /*
            position: [
                constrain(-s.width, -700, 0),
                constrain(-s.height / s.scale / 2, -500, 500),
                constrain(s.width / 8, -500, 500),
            ],
            */
            // hardcoded position
            position: [-700, -296.1726746773476, 114.5],

            // perspective
            // fov:
            // aspect ratio: 
            // near: 
            // far: 
            perspective: [
                PI / 5,
                s.width / s.height,
                0.1,
                5000
            ]
        }))
        .reduce(s => s)

        // resize canvas
        resizeCanvas(gameScreen.width, gameScreen.height);
    }
}

// toggle developer modes
function setDeveloperMode(mode) {
    // dev mode off
    if (mode === 0) {
        noStroke();
    }

    // dev mode orientation grid and outlines
    if (mode === 1) {
        debugMode();
    }

    // dev mode orientation grid and outlines
    // no game loop
    if (mode === 2) {
        orbitControl();
        debugMode();
        noLoop();
    }
}

// slice an image in two
function sliceImage(img, ratio) {
    return [{ source: img, ratio: ratio }]
    .map(r => {
        return {
            ...r,
            ...{ // calculate fragment widths
                leftWidth: r.source.width * r.ratio,
                rightWidth: r.source.width * (1 - r.ratio)
            }
        };
    })
    .map(r => {
        return {
            ...r,
            ...{ // copy from source image to fragments
                left: r.source.get(0, 0, r.leftWidth, r.source.height),
                right: r.source.get(r.leftWidth, 0, r.rightWidth, r.source.height)
            }
        };
    }).reduce(r => r);
}

// quickly extract a color from the image
function quickColor(img) {
    return [img]
    .map(r => {
        r.loadPixels();
        return {
            color: (r.height / 2) * Math.round(r.width) * 4,
            pixels: r.pixels
        };
    })
    .map(r => {
        return [
            r.pixels[r.color],
            r.pixels[r.color+1],
            r.pixels[r.color+2],
            r.pixels[r.color+3]
        ];
    }).reduce(r => r);
}

// create throttled function
const throttled = (delay, fn) => {
    let lastCall = 0;
    return function (...args) {
        const now = (new Date).getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return fn(...args);
    }
}

// create throttled function by value
const nonConsecutive = (target, bump, fn) => {
    let current = 0;
    let prev = 0;

    return function (...args) {
        prev = current;
        current = fn(...args);

        if (current === prev && current === target) {
            return current + bump;
        }
        return current;
    }
}


// get random number between min and max
const randomBetween = (min, max, int = false) => {
    const rand = Math.random() * (max - min) + min;
    return int ? Math.round(rand) : rand;
}

// pick random element from a list
const pickFromList = (list) => {
    if (!Array.isArray(list) || list.length < 1) { return; }

    let index = randomBetween(0, list.length - 1, 'int');
    return list[index];
}

function submitScore() {
    window.setScore(score);
    window.setAppView("setScore");
}