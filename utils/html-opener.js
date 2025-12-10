import {exec} from "node:child_process";
import path from "node:path";

const opener = {
  win32: "start",
  darwin: "open",
  linux: "xdg-open"
}[process.platform];

export default function openHTMLReport(filePath) {
  const file = filePath || path.join(__dirname, "output/dailyReport.html");
  exec(`${opener} "${file}"`);
}

