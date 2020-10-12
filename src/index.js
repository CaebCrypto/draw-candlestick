// samples
// AbandonBaby
// var input = {
//   open: [30.10,27.18,29.87],
//   high: [32.40,28.32,30.70],
//   close:[29.30,27.00,30.62],
//   low:  [28.50,24.67,29.30],
// }

// BullishEngulfing
// var input = {
//   open: [23.25,15.36],
//   high: [25.10,30.87],
//   close: [21.44,27.89],
//   low: [20.82,14.93],
// }

// Bearish Engulfing
// var input = {
//   open: [21.44,27.89],
//   high: [25.10,30.87],
//   low: [20.82,14.93],
//   close: [23.25,15.36]
// }

// Dragonflydoji
// var input = {
//   open: [30.10],
//   high: [30.10],
//   close: [30.13],
//   low: [28.10],
// }

function defaults () {
    return {
        height: 400,
        barWidth: 10,
        barPadding: 6,
        barMinHeight: 2,
        imagePaddingX: 12,
        imagePaddingTop: 70,
        imagePaddingBottom: 20,
        positiveColor: '#2dbd85',
        negativeColor: '#e0294b',
    };
}
module.exports = function drawCandleStick (input, _opts = {}) {

    // Statics
    const options = Object.assign({}, defaults(), _opts);
    const { height, barWidth, barPadding, barMinHeight, imagePaddingX, imagePaddingTop, imagePaddingBottom, positiveColor, negativeColor } = options;

    // Responsive
    const barsCount = input.close.length;
    const width = barsCount * (barWidth + barPadding) + imagePaddingX;

    // Create canvas
    const d3 = require('d3');
    const d3Scale = require('d3-scale');
    const Canvas = require('canvas').Canvas;
    const canvas = new Canvas(width, height);
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.strokeRect(0, 0, width, height);
    ctx.translate(0, height);
    ctx.scale(1, -1);

    // Configure Y scaling (from low & high)
    const y = d3Scale.scaleLinear()
        .domain([d3.min(input.low), d3.max(input.high)])
        .range([imagePaddingBottom, height - imagePaddingTop]);

    for (let i = 0; i < barsCount; i++) {
        const open = input.open[i];
        const high = input.high[i];
        const low = input.low[i];
        const close = input.close[i];
        let height = Math.abs(y(open) - y(close));
        height = height > barMinHeight ? height : barMinHeight;
        const xValue = imagePaddingX + ((barWidth + barPadding) * i);
        const colo = open > close ? negativeColor : positiveColor;
        const start = open > close ? y(close) : y(open);
        ctx.strokeStyle = colo;
        ctx.fillStyle = colo;
        ctx.beginPath();
        ctx.moveTo(xValue, y(high));
        ctx.lineTo(xValue, y(low));
        ctx.fillRect(xValue - (barWidth / 2), start, barWidth, height);
        ctx.fill();
        ctx.stroke();
    }
    return canvas.toBuffer();
};
