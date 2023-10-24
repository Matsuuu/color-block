import http from "http";
import { createCanvas } from "@napi-rs/canvas";

const DEFAULT_WIDTH = 80;
const DEFAULT_HEIGHT = 80;

const canvas = createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT);
const context = canvas.getContext("2d");

/**
 * @param {string} color
 * @param {number} x
 * @param {number} y
 */
function getColorBlockImage(color, x, y) {
    console.log({ color, x, y })

    context.fillStyle = color;
    context.fillRect(0, 0, x, y);

    const buffer = canvas.toBuffer("image/png");
    return buffer;
}

/**
 * @param {RegExpMatchArray[]} colors
 * @param {number} x
 * @param {number} y
 */
function getColorPaletteImage(colors, x, y) {
    const colorCodes = colors.map(match => "#" + match.at(0));
    const col1 = colorCodes.slice(0, colorCodes.length / 2);
    const col2 = colorCodes.slice(colorCodes.length / 2);

    console.log({ colorCodes, x, y });
    console.log({ col1, col2 })

    let offsetY = 0;
    const blockWidth = x / 2;
    const blockHeight = y / col1.length;
    for (const block of col1) {
        context.fillStyle = block;
        context.fillRect(0, offsetY, blockHeight, blockWidth);
        offsetY += blockHeight;
    }

    offsetY = 0;
    for (const block of col2) {
        context.fillStyle = block;
        context.fillRect(blockWidth, offsetY, blockHeight, blockWidth);
        offsetY += blockHeight;
    }

    const buffer = canvas.toBuffer("image/png");
    return buffer;
}

const server = http.createServer(async (req, res) => {

    if (req.method === "GET") {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathname = url.pathname;

        const queryParams = url.searchParams;
        let x = parseInt(queryParams.get("x"));
        let y = parseInt(queryParams.get("y"));
        if (isNaN(x)) x = DEFAULT_WIDTH;
        if (isNaN(y)) y = DEFAULT_HEIGHT;

        const colorRegex = new RegExp("(?:[0-9a-fA-F]{3}){1,2}", "g");
        console.log(pathname)
        const colors = [...pathname.matchAll(colorRegex)];
        console.log("COLORS ", colors)

        if (colors.length === 0) {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Please provide a color HEX code.", examples: [`${url.protocol}//${url.host}/FF6D00`, `${url.protocol}//${url.host}/55AA44?x=80&y=40`] }));
            return;
        }

        if (x !== canvas.width) {
            canvas.width = x;
        }
        if (y !== canvas.height) {
            canvas.height = y;
        }

        res.writeHead(200, { "Content-Type": "image/png" });
        if (colors.length === 1) {
            res.write(getColorBlockImage("#" + colors[0], x, y));
        } else {
            res.write(getColorPaletteImage(colors, x, y));
        }
        res.end();
        return;
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});


server.listen(4000, () => {
    console.log("Server running @ 4000");
})
