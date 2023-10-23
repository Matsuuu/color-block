import http from "http";
import { createCanvas } from "canvas";
import { writeFileSync } from "fs";

/**
 * @param {string} color
 */
function getColorBlockImage(color) {
    const width = 80;
    const height = 80;

    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    context.fillStyle = color;
    context.fillRect(0, 0, width, height);

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

        res.writeHead(200, { "Content-Type": "image/png" });
        res.write(getColorBlockImage(colorHex));
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
