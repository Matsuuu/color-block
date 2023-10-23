const urlParams = new URLSearchParams(window.location.search);
const color = '#' + urlParams.get("color") ?? "#FF6D00";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
ctx.fillStyle = color;
ctx.fillRect(0, 0, canvas.width, canvas.height);

const imgUrl = canvas.toDataURL("image/png");


const image = /** @type { HTMLImageElement } */ (document.createElement("img"));
image.src = imgUrl;

document.body.appendChild(image);
