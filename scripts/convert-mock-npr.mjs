import fs from "fs";

const npr = (v) => Math.round((v * 133) / 50) * 50;
const path = "lib/mock-data.ts";
let s = fs.readFileSync(path, "utf8");

s = s.replace(/price: ([\d.]+)/g, (_, v) => `price: ${npr(parseFloat(v))}`);
s = s.replace(/originalPrice: ([\d.]+)/g, (_, v) => `originalPrice: ${npr(parseFloat(v))}`);
s = s.replace(/denominations: \[([^\]]+)\]/g, (m, inner) => {
  const vals = inner.split(",").map((x) => npr(parseFloat(x.trim())));
  return `denominations: [${vals.join(", ")}]`;
});

fs.writeFileSync(path, s, "utf8");
console.log("Converted mock-data prices to NPR amounts");
