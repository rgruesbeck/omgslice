function renderTable({ color, w, h, d }) {
    push();
    translate(w / 2.5, 0);
    noStroke();
    fill(color);
    box(w, h, d);
    pop();
}

function renderKnife() {
    push();

    rotateY(radians(-90));
    translate(this.width * 0.5, -this.height);

    rotate(this.r, [0, 0, 1]); // slicer angle & rotation
    translate(-this.width / 3, 0); // rotation origin: (half of width)

    texture(this.image);
    plane(this.width, this.height);
    pop();
}

function renderVeggie() {
    push();
    translate(this.x, this.y, this.z);
    rotateX(radians(90));
    rotateZ(radians(0));

    texture(this.image);
    plane(this.width, this.height);
    pop();
}

function renderSlice() {
    push();
    translate(this.x, this.y, this.z);
    rotateX(radians(90));
    rotateZ(radians(0));

    texture(this.image);
    plane(this.width, this.height);
    pop();
}

function renderChunk() {
    let size = this.width;

    push();
    translate(this.x, this.y, this.z);
    rotateY(this.r);

    fill(this.color);
    box(size, size, size * 5);
    pop();
}