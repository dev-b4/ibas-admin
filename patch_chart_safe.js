import fs from 'fs';
const file = 'src/components/Dashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// Add historyList state
content = content.replace(
  /const \[historyData, setHistoryData\] = useState\(\{ max24h: 0, min24h: 0, max30d: 0, min30d: 0, variation: 0 \}\);/,
  "const [historyData, setHistoryData] = useState({ max24h: 0, min24h: 0, max30d: 0, min30d: 0, variation: 0 });\n  const [historyList, setHistoryList] = useState([]);"
);

// Add setHistoryList in useEffect
content = content.replace(
  /const history = registerDailyIbasIndex\(currentIbas\);/,
  "const history = registerDailyIbasIndex(currentIbas);\n      setHistoryList(history);"
);

// Fix getChartData block
content = content.replace(
  /const getChartData = \(\) => {[\s\S]*?console\.error\("Error formatting chart data", e\);\n      return \[\];\n    }\n  };/,
  `const getChartData = () => {
    if (!historyList || !Array.isArray(historyList) || historyList.length === 0) {
      return [];
    }

    const formatData = (dataSlice) => {
      if (!Array.isArray(dataSlice)) return [];
      return dataSlice.map(h => ({
        time: h && h.date ? h.date.substring(0, 5) : '00/00',
        pts: h ? h.close : 0
      }));
    };

    try {
      switch (timeFilter) {
        case '1D': 
          const todayPts = historyList.length > 0 ? historyList[historyList.length - 1].close : 0;
          return [
            { time: '08:00', pts: todayPts },
            { time: '10:00', pts: todayPts },
            { time: '12:00', pts: todayPts },
            { time: '14:00', pts: todayPts },
            { time: '16:00', pts: todayPts },
            { time: '18:00', pts: todayPts }
          ];
        case '1S':
          return formatData(historyList.slice(-7));
        case '1M': 
          return formatData(historyList.slice(-30));
        case '3M': 
          return formatData(historyList.slice(-90));
        case '6M': 
          return formatData(historyList.slice(-180));
        default: 
          return formatData(historyList.slice(-7));
      }
    } catch(e) {
      console.error("Error formatting chart data", e);
      return [];
    }
  };`
);

fs.writeFileSync(file, content);
console.log("Chart safely patched!");
