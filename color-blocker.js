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

    if (x !== canvas.width) {
        canvas.width = x;
    }
    if (y !== canvas.height) {
        canvas.height = y;
    }

    context.fillStyle = color;
    context.fillRect(0, 0, x, y);

    const buffer = canvas.toBuffer("image/png");
    return buffer;
}

const server = http.createServer(async (req, res) => {

    if (req.method === "GET") {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathname = url.pathname;
        const color = pathname.substring(1, 7);
        const colorHex = "#" + color;
        const colorRegex = new RegExp("^#(?:[0-9a-fA-F]{3}){1,2}$");

        if (!colorRegex.test(colorHex)) {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Please provide a color HEX code." }));
            return;
        }

        const queryParams = url.searchParams;
        let x = parseInt(queryParams.get("x"));
        let y = parseInt(queryParams.get("y"));
        if (isNaN(x)) x = 80;
        if (isNaN(y)) y = 80;

        res.writeHead(200, { "Content-Type": "image/png" });
        res.write(getColorBlockImage(colorHex, x, y));
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
