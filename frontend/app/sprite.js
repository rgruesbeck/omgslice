// check if n is a number
const isNumber = (n) => {
    return n !== undefined && !Number.isNaN(n);
}

// sprite prototype
const SpritePrototype = {
    // sprite attributes
    active: true,
    x: 0,
    y: 0,
    z: 0,
    r: 1,
    width: 100,
    height: 100,
    depth: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    vr: 0,
    // initialize
    init: function({ x, y, z, r, vx, vy, vz, vr, width, height, depth }) {
        this.id = Math.random().toString(16).slice(2);

        if (x) { this.x = x; }
        if (y) { this.y = y; }
        if (z) { this.z = z; }
        if (r) { this.r = r; }

        if (vx) { this.vx = vx; }
        if (vy) { this.vy = vy; }
        if (vz) { this.vz = vz; }
        if (vr) { this.vr = vr; }

        if (width) { this.width = width; }
        if (height) { this.height = height; }
        if (depth) { this.depth = depth; }

        return this;
    },
    // call render method
    render: function(opts) {
        if (!this.active) { return; }

        this.renderMethod.call(this, opts);
    },
    // update with a function
    update: function(fn) {
        if (!fn && !(typeof fn === 'function')) { return this; }

        let updates = fn({
            x: this.x,
            y: this.y,
            z: this.z,
            r: this.r,
            width: this.width,
            height: this.height,
            depth: this.depth,
            vx: this.vx,
            vy: this.vy,
            vz: this.vz,
            vr: this.vr,
            active: this.active,
            type: this.type,
            geometry: this.geometry,
            image: this.image,
            color: this.color
        });

        return this.set(updates);
    },
    // move some distance
    move: function(x = 0, y = 0, z = 0) {
        if (!isNumber(x + y + z)) { return; }

        return this.set({
            x: this.x + x,
            y: this.y + y,
            z: this.z + z
        });
    },
    // do something with state
    then: function(fn) {
        if (!fn && !(typeof fn === 'function')) { return; }

        fn({
            x: this.x,
            y: this.y,
            z: this.z,
            r: this.r,
            width: this.width,
            height: this.height,
            depth: this.depth,
            vx: this.vx,
            vy: this.vy,
            vz: this.vz,
            vr: this.vr,
            active: this.active,
            type: this.type,
            geometry: this.geometry,
            image: this.image,
            color: this.color
        });

        return this;
    },
    // set position, rotation, and size
    set: function({ x, y, z, r, width, height, depth, vx, vy, vz, vr, active, image, color }) {
        // set position
        this.setX(x);
        this.setY(y);
        this.setZ(z);

        // set rotation
        if (isNumber(r)) { this.r = parseFloat(r); }

        // set dimensions
        if (isNumber(width)) { this.width = Math.round(width); }
        if (isNumber(height)) { this.height = Math.round(height); }
        if (isNumber(depth)) { this.depth = Math.round(depth); }


        // set velocity
        // plus 0.0001 hack to avoid 0 velocity
        if (isNumber(vx)) { this.vx = parseFloat(vx) + 0.0001; }
        if (isNumber(vy)) { this.vy = parseFloat(vy) + 0.0001; }
        if (isNumber(vz)) { this.vz = parseFloat(vz) + 0.0001; }
        if (isNumber(vr)) { this.vr = parseFloat(vr) + 0.0001; }

        // set active flag
        this.active = active === undefined ? this.active : active

        // set image
        this.image = image === undefined ? this.image : image;

        // set color
        this.color = color === undefined ? this.color : color;

        return this;
    },
    setX: function(x) {
        if (isNumber(x)) {
            this.x = x;
        }
    },
    setY: function(y) {
        if (isNumber(y)) {
            this.y = y;
        }
    },
    setZ: function(z) {
        if (isNumber(z)) {
            this.z = z;
        }
    }
}

createSprite = ({
    type = '',
    geometry = 'plane',
    image = null,
    color = null,
    x, y, z, r,
    vx, vy, vz, vr,
    width, height, depth
}, renderMethod) => {
    return Object.create(SpritePrototype, {
        type: {
            writable: true,
            value: type
        },
        geometry: {
            writable: true,
            value: geometry
        },
        image: {
            writable: true,
            value: image
        },
        color: {
            writable: true,
            value: color
        },
        renderMethod: {
            writable: true,
            value: renderMethod
        }
    }).init({
        x, y, z, r,
        vx, vy, vz, vr,
        width, height, depth
    });
};