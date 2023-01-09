let cnv = document.getElementById("cnv");
let ctx = cnv.getContext("2d");
cnv.width = 500;
cnv.height = 500;
const size = 20;

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

document.addEventListener("keydown", keydownListener) 

let key = [-1, 0]
function keydownListener(event) {
    const keyStr = JSON.stringify(key)
    if(JSON.stringify(snake[0].direction) == keyStr) {
        if(event.key == "w" && keyStr !== "[0,1]") {
            key = [0, -1]
        } else if(event.key == "s" && keyStr !== "[0,-1]") {
            key = [0, 1]
        } else if(event.key == "a" && keyStr !== "[1,0]") {
            key = [-1, 0]
        } else if(event.key == "d" && keyStr !== "[-1,0]") {
            key = [1, 0]
        }
    }
}


class snakeBlock {
    constructor(coords, index, direction) {
        this.coords = coords
        this.index = index
        this.direction = direction
    } 
    display() {
        if(this.index % 2 == 0) {
            ctx.fillStyle = "green";
        } else {
            ctx.fillStyle = "red"
        }
        ctx.fillRect(this.coords[0], this.coords[1], size, size);
        if((snake[0].coords[0] % size) + (snake[0].coords[1] % size) == 0) {
            if(this.index == 0) {
                if(this.direction[0] !== key[0] || this.direction[1] !== key[1]) {
                    this.direction = key
                }
            } else {
                if(this.direction[0] !== snake[this.index - 1].direction[0] || this.direction[1] !== snake[this.index - 1].direction[1]) {
                    this.direction = snake[this.index - 1].direction
                }
            }
        }
        if(this.index == 0) {
            this.eatApple()
            this.collision()
        }

        this.coords[0] += this.direction[0] * 2
        this.coords[1] += this.direction[1] * 2
    }
    eatApple() {
        if(this.coords[0] == apple.x && this.coords[1] == apple.y) {
            const lastBlock = snake[snake.length - 1]
            snake.push(new snakeBlock([lastBlock.coords[0] + (size * lastBlock.direction[0] * -1), lastBlock.coords[1] + (size * lastBlock.direction[1] * -1)], lastBlock.index + 1, lastBlock.direction))
            randomApple()
        }
    } 
    collision() {
        if(this.coords[0] < 0 || this.coords[1] < 0 || this.coords[0] > cnv.width || this.coords[1] > cnv.height) {
            newGame()
            return
        }
        for(let i = 1; i < snake.length; i++) {
            if(this.coords[0] == snake[i].coords[0]) {
                if(Math.abs(this.coords[1] - snake[i].coords[1]) < 3) {
                    newGame()
                    return
                }
            }
        }
    }
}


let snake = [new snakeBlock([300, 100], 0, key), new snakeBlock([300 + size, 100], 1, key), new snakeBlock([300 + (2 * size), 100], 2, key)]
const apple = {
    x: randInt(0, cnv.width / size) * size,
    y: randInt(0, cnv.height / size) * size,
    display: function() {
        ctx.fillStyle = "red"
        ctx.fillRect(this.x, this.y, size, size)
    }
}

function randomApple() {
    apple.x = randInt(0, cnv.width / size) * size
    apple.y = randInt(0, cnv.height / size) * size
}

function newGame() {
    key = [-1, 0]
    snake = [new snakeBlock([300, 100], 0, key), new snakeBlock([300 + size, 100], 1, key), new snakeBlock([300 + (2 * size), 100], 2, key)]
    randomApple()
}

requestAnimationFrame(loop)
function loop() {
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, cnv.width, cnv.height)
    for(let x = 0; x < cnv.width; x += size) {
        for(let y = 0; y < cnv.height; y += size) {
            ctx.strokeRect(x, y, size, size)
        }
    }
    for(let i = snake.length - 1; i >= 0; i--) {
        snake[i].display()
    }
    apple.display()
    requestAnimationFrame(loop)
}