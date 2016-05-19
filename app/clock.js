var PADDING = 20;

var renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight);
var stage = new PIXI.Container();
var filter = new PIXI.filters.BloomFilter();
var g = new PIXI.Graphics();

window.onresize = function () {
    renderer.resize(window.innerWidth, window.innerHeight);
}

stage.addChild(g);
stage.filters = [filter];

document.body.appendChild(renderer.view);

function drawHand(g, centerX, centerY, offset, angle, length) {
    g.moveTo(centerX + offset * Math.cos(angle), centerY + offset * Math.sin(angle));
    g.lineTo(centerX + length * Math.cos(angle), centerY + length * Math.sin(angle));
}

function getHandAngle(time, maximum) {
    return ((time / maximum) * 360 - 90) * Math.PI / 180;
}

function drawClock(g, hours, minutes, seconds) {
    var centerX = window.innerWidth / 2;
    var centerY = window.innerHeight / 2;
    var radius = window.innerHeight / 2 - PADDING;

    g.lineStyle(2, 0xFFFFFF, 0.75);
    g.drawCircle(centerX, centerY, radius / 6);

    hourAngle = getHandAngle(hours + (minutes + (seconds / 60)) / 60, 12);
    hourLength = radius * 0.5;

    minuteAngle = getHandAngle(minutes + seconds / 60, 60);
    minuteLength = radius * 0.833;

    secondAngle = getHandAngle(seconds, 60);
    secondLength = radius * 0.875;

    drawHand(g, centerX, centerY, radius / 5, hourAngle, hourLength);
    drawHand(g, centerX, centerY, radius / 5, minuteAngle, minuteLength);
    drawHand(g, centerX, centerY, radius / 5, secondAngle, secondLength);

    for (var i = 0; i < 60; i++) {
        var angle = ((i / 60) * 360 + 180) * Math.PI / 180;
        var d = 35;
        var l = radius / d;

        if (i % 5 == 0) {
            g.lineStyle(2, 0xFFFFFF, 1);
            g.moveTo(centerX + (l * (d-3) * Math.cos(angle)), centerY + (l * (d-3) * Math.sin(angle)));
        } else {
            g.lineStyle(1, 0xFFFFFF, 0.75);
            g.moveTo(centerX + (l * (d-2) * Math.cos(angle)), centerY + (l * (d-2) * Math.sin(angle)));
        }

        g.lineTo(centerX + (l * (d-1) * Math.cos(angle)), centerY + (l * (d-1) * Math.sin(angle)));
    }
}

function getColorFromTime(hours, minutes, seconds) {
    hoursHex = (hours / 24) * 255;
    minutesHex = (minutes / 60) * 255;
    secondsHex = (seconds / 60) * 255;

    return (hoursHex & 0xFF) << 16 | (minutesHex & 0xFF) << 8 | (secondsHex & 0xFF);
}

function draw() {
    var time = new Date();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();

    g.clear();

    renderer.backgroundColor = getColorFromTime(hours, minutes, seconds);

    drawClock(g, hours, minutes, seconds);

    renderer.render(stage);
}

setInterval(draw, 1000);
draw();
