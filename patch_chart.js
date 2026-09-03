import fs from 'fs';
const file = 'src/components/Dashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// Add historyList state
content = content.replace(
  /const \[historyData, setHistoryData\] = useState\(\{ max24h: 0, min24h: 0, max30d: 0, min30d: 0, variation: 0 \}\);/,
  "const [historyData, setHistoryData] = useState({ max24h: 0, min24h: 0, max30d: 0, min30d: 0, variation: 0 });\n  const [historyList, setHistoryList] = useState([]);"
);

// Fix useEffect variable name
content = content.replace(
  /const history = registerDailyIbasIndex\(currentIbas\);/g,
  "const history = registerDailyIbasIndex(currentIbas);\n      setHistoryList(history);"
);

// Fix getChartData
content = content.replace(
  /if \(!history \|\| !Array\.isArray\(history\)/,
  "if (!historyList || !Array.isArray(historyList)"
);
content = content.replace(
  /history\.length/g,
  "historyList.length"
);
content = content.replace(
  /history\[historyList\.length - 1\]/g,
  "historyList[historyList.length - 1]"
);
content = content.replace(
  /history\.slice/g,
  "historyList.slice"
);

fs.writeFileSync(file, content);
console.log("Chart patched!");
