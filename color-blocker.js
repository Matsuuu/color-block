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
        console.log(url);
        const pathname = url.pathname;
        const color = "#" + pathname.substring(1, 7);
        console.log("COLOR: ", color);

        res.writeHead(200, { "Content-Type": "image/png" });
        res.write(getColorBlockImage(color));
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
