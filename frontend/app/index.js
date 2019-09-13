// wrapped helpers
const playSound300 = throttled('300', (snd) => { snd.play(); });
const playSound100 = throttled('100', (snd) => { snd.play(); });

// load game assets
function preload() {

    colors = {
        backgroundColor: color(Koji.config.colors.backgroundColor),
        primaryColor: color(Koji.config.colors.backgroundColor),
        secondaryColor: color(Koji.config.colors.secondaryColor),
        tertiaryColor: color(Koji.config.colors.tertiaryColor),
        boardColor: color(Koji.config.colors.boardColor)
    };

    images = {
        slicer: loadImage(Koji.config.images.slicer),
        avoid: loadImage(Koji.config.images.avoid),
        item1: loadImage(Koji.config.images.item1),
        item2: loadImage(Koji.config.images.item2),
        item3: loadImage(Koji.config.images.item3),
        item4: loadImage(Koji.config.images.item4),
        item5: loadImage(Koji.config.images.item5),
        item6: loadImage(Koji.config.images.item6),
        item7: loadImage(Koji.config.images.item7),
        item8: loadImage(Koji.config.images.item8),
        item9: loadImage(Koji.config.images.item9),
        item10: loadImage(Koji.config.images.item10)
    };

    sounds = {
        backgroundMusic: loadSound(Koji.config.sounds.backgroundMusic),
        sliceSound: loadSound(Koji.config.sounds.sliceSound),
        whooshSound: loadSound(Koji.config.sounds.whooshSound)
    };

    state = {
        current: 'play',
        score: 0,
        lives: parseInt(Koji.config.settings.lives),
        slicerSpeed: 7, // 1 to 10
        slicerAngle: 0.6,
        slicerFrame: 0
    };
}


// setup game and create game characters
function setup() {
    // set frame and canvas size
    resizeFrame({ force: true });

    // create rendering context and camera
    mainContext = createCanvas(width, height, WEBGL);
    mainCamera = createCamera();

    // set overlay
    setOverlay({
        visible: true,
        lives: parseInt(state.lives),
        score: parseInt(state.score)
    });

    // create slicer
    slicer = createSprite({
        type: 'slicer',
        image: images.slicer,
        x: 0, y: 0, z: 0, r: state.slicerAngle,
        width: 250, height: 55 
    }, renderKnife);

    // items
    items = [];

    // allocate slices: 10
    slices = Array.apply(null, { length: 10 })
    .map(() => createSprite({
        type: 'slice',
        active: false
    }, renderSlice));

    // allocate chunks: 10 
    chunks = Array.apply(null, { length: 30 })
    .map(() => createSprite({
        type: 'chunk',
        active: false,
        color: color(0, 0, 0),
        width: randomBetween(4, 6, true),
        vx: randomBetween(-5, -10),
        vy: randomBetween(0, 1),
        vz: randomBetween(-2, 2),
        vr: randomBetween(-0.25, 0.25)
    }, renderChunk));

    // developer modes:
    // 0 = off
    // 1 = show grid
    // 2 = show grid, no-loop
    setDeveloperMode(0);
}

// main game loop
function draw() {
    resizeFrame();
    background(colors.backgroundColor);
    setLighting();

    // update camera position
    mainCamera.setPosition(...gameScreen.position);
    mainCamera.perspective(...gameScreen.perspective);
    mainCamera.lookAt(0, 0, 0);

    // check for game-over
    if (parseInt(state.lives) === 0) {
        gameOver();
    }

    // add new item every second
    if (frameCount % 60 === 0) {
        // if available item exists, recycle one
        // else create new item

        let availableVeggie = items.find(a => !a.active)

       // pick a random item image
        let randomItem = pickFromList([
            'avoid',
            'avoid',
            'avoid',
            'item1',
            'item2',
            'item3',
            'item4',
            'item5',
            'item6',
            'item7',
            'item8',
            'item9',
            'item10'
        ])

        if (availableVeggie) {
            availableVeggie.update(a => {
                return {
                    active: true,
                    type: `item-${randomItem}`,
                    image: images[randomItem],
                    width: 150, height: 150,
                    x: 2000
                };
            });
        } else {
            items.push(createSprite({
                type: `item-${randomItem}`,
                image: images[randomItem],
                x: 2000, y: -55, z: 12, r: 0,
                width: 150, height: 150,
                vx: 1
            }, renderVeggie));
        }
    }

    renderTable({ color: colors.boardColor, w: 5000, h: 50, d: 125 });

    [slicer].concat(items, slices, chunks)
    .filter(a => a.active)
    .sort((a, b) => a.order < b.order ? 1 : -1)
    .forEach(actor => {
        // render game objects
        actor.render();

        // update slicer
        if (actor.type === 'slicer') {
            actor
            .update(a => {
                // update slicer state
                let angle = getKnifeAngle(0.4);
                let canSlice = mouseIsPressed && state.current !== 'over';
                if (canSlice) {
                    state.slicerFrame += 1;
                    playSound300(sounds.whooshSound);

                    let btm = bottomed(angle);
                    actor.bottomed = btm;
                } else {
                    if (angle < 0.8) {
                        state.slicerFrame += 1;
                    }
                }

                return {
                    r: Math.max(angle, 0),
                    order: 0
                }
            })
        }

        // update items
        if (actor.type.includes('item')) {
            actor.move(-5, 0, 0)
            .update(a => {
                // slice
                let sliced;
                let sliceRatio = Math.abs(a.x) / a.width;
                let slicing = 
                    a.x < 0 &&
                    (a.x + a.width) > 0 &&
                    slicer.r === 0 &&
                    slicer.bottomed;

                if (slicing) {

                    sliced = sliceImage(a.image, sliceRatio);
                    slicedColor = quickColor(sliced.right);

                    playSound100(sounds.sliceSound);

                    // take 1 slice
                    // emit slices from origin
                    let availableSlice = slices.find(sl => !sl.active)
                    if (availableSlice) {
                        availableSlice
                        .update(sl => {
                            return {
                                active: true,
                                image: sliced.left,
                                x: a.x - 10, y: a.y, z: a.z, r: 0,
                                width: a.width * sliceRatio,
                                height: a.height
                            };
                        })
                    }

                    // take 15 chunks
                    // emit chunks from origin
                    chunks
                    .filter(ck => !ck.active)
                    .filter((ck, idx) => idx < 15)
                    .forEach(ck => {
                        ck.update(c => {
                            return {
                                active: true,
                                color: color(slicedColor[0], slicedColor[1], slicedColor[2]),
                                x: randomBetween(a.x, a.x + a.width),
                                y: -50,
                                z: randomBetween(0, 50)
                            };
                        })
                    })

                    if (a.type.includes('avoid')) {

                        state.lives = Math.max(state.lives - 0.5, 0);
                        state.score = Math.max(state.score - (Math.random() * 5), 0);

                        setOverlay({
                            lives: parseInt(state.lives),
                            score: parseInt(state.score)
                        });
                    } else {

                        state.score += Math.random() * 5 + 5;
                        setOverlay({ score: parseInt(state.score) });
                    }

                    // setback half a frame
                    let newX = 2;
                    let newW = a.width * (1 - sliceRatio);

                    return {
                        x: newX,
                        order: newX - a.width,
                        image: sliced.right,
                        width: newW
                    };

                } else {

                    return {
                        active: a.x > -500,
                        order: a.x - a.width
                    };
                }

            })
        }

        // update slices
        if (actor.type === 'slice') {
            actor
            .move(-10, 0, 0)
            .update(a => {
                let onScreen = a.x > -500;
                let gameStarted = frameCount > 90;
                return {
                    active: onScreen && gameStarted,
                    order: a.x
                };
            })
        }

        // update chunks
        if (actor.type === 'chunk') {
            actor.update(a => {
            let onScreen = a.x > -500;
            let gameStarted = frameCount > 90;
            return {
                x: a.x + a.vx,
                y: a.y + a.vy,
                z: a.z + a.vz,
                r: a.r + a.vr,
                active: onScreen && gameStarted,
                order: a.x
            };
        })
    }
})

}

function startGame() {
    loop();
    sounds.backgroundMusic.loop();
    setOverlay({
        banner: '',
        message: '',
        startButton: '',
        viewLeaderBoardText: ''
    });
}

function gameOver() {
    state.current = 'over';
    sounds.backgroundMusic.pause();
    setOverlay({
        banner: Koji.config.settings.gameoverText,
        restartButton: Koji.config.settings.restartButton,
        submitScoreText: 'submit score ->'
    })
}

function setLighting() {
    ambientLight(210, 210, 210);
    pointLight(255, 255, 255, -(width), -(height / 2), 0);
}

function getKnifeAngle(c) {
    return [cos(state.slicerFrame / (10 / state.slicerSpeed))] // original cycle
    .map(a => a / 2) // reduce motion
    .map(a => a + c) // add constant angle
    .reduce(a => a);
}