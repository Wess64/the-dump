const express = require('express');
const fs = require('fs');
const readline = require('readline');
const { spawn } = require('child_process');
                                                const app = express();
const html = fs.readFileSync('lmth.html', 'utf-8');

app.get('/', (req, res) => {
    res.send(html);
});

function startInfiniteRainbow(text) {
    let tick = 0;
    let speed = 50;
    const minSpeed = 10;
    const maxSpeed = 200;

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Put terminal in raw mode to detect arrow keypresses
    readline.emitKeypressEvents(process.stdin, rl);
    process.stdin.setRawMode(true);

    let interval;

    function render() {
        const gradient = (i, total, offset) => {
            const freq = Math.PI * 2 / total;
            const red   = Math.sin(freq * i + offset) * 127 + 128;
            const green = Math.sin(freq * i + 2 + offset) * 127 + 128;
            const blue  = Math.sin(freq * i + 4 + offset) * 127 + 128;
            return `\x1b[38;2;${Math.floor(red)};${Math.floor(green)};${Math.floor(blue)}m`;
        };

        const reset = "\x1b[0m";
        let out = "";

        for (let i = 0; i < text.length; i++) {
            out += gradient(i, text.length, tick / 4) + text[i];
        }

        // Render the line below
        const dim = "\x1b[2m";
        const bright = "\x1b[1m";
        const leftArrow = speed > minSpeed ? bright + "<" : dim + "<";
        const rightArrow = speed < maxSpeed ? bright + ">" : dim + ">";
        const label = `\n${speed} ˢˡᵒʷⁿᵉˢˢ  ${leftArrow}${dim} ${rightArrow}${reset}`;

        process.stdout.write("\x1b[2J\x1b[H"); // clear + move cursor home
        process.stdout.write(out + reset + label);
        tick++;
    }
    function startLoop() {
        if (interval) clearInterval(interval);
        interval = setInterval(render, speed);
    }

    process.stdin.on('keypress', (str, key) => {
        if (key.name === 'right' && speed < maxSpeed) {
            speed += 10;
            startLoop();
        } else if (key.name === 'left' && speed > minSpeed) {
            speed -= 10;
            startLoop();
        } else if (key.ctrl && key.name === 'c') {
            process.stdout.write("\x1b[0m");
            process.stdout.write("\x1b[2J\x1b[H");
            process.stdout.write("\x1b[0mno server :<\n");
            process.exit();
        }
    });

    startLoop();
}

app.listen(8080, () => {
    startInfiniteRainbow("server!!!");
});