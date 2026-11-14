import { writeFileSync } from "node:fs";

const url = process.argv[2] ?? "http://localhost:3100";
const output = process.argv[3] ?? "/private/tmp/hen-mobile-cdp.png";
const width = Number(process.argv[4] ?? 390);
const height = Number(process.argv[5] ?? 844);

const tab = await fetch(`http://127.0.0.1:9222/json/new?${encodeURIComponent(url)}`, { method: "PUT" }).then((response) => response.json());
const socket = new WebSocket(tab.webSocketDebuggerUrl);
const pending = new Map();
let sequence = 0;

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  }
});

await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

function send(method, params = {}) {
  const id = ++sequence;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: true });
await send("Page.navigate", { url });
await new Promise((resolve) => setTimeout(resolve, 800));

const expression = `JSON.stringify({
  innerWidth: window.innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  bodyWidth: document.body.scrollWidth,
  overflows: [...document.querySelectorAll('*')]
    .filter((element) => { const rect = element.getBoundingClientRect(); return rect.right > window.innerWidth + 2 || rect.left < -2; })
    .slice(0, 12)
    .map((element) => ({ tag: element.tagName, className: String(element.className).slice(0, 80), left: Math.round(element.getBoundingClientRect().left), right: Math.round(element.getBoundingClientRect().right) }))
})`;
const evaluation = await send("Runtime.evaluate", { expression, returnByValue: true });
const screenshot = await send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false });
writeFileSync(output, Buffer.from(screenshot.data, "base64"));
console.log(evaluation.result.value);
console.log(output);
socket.close();
