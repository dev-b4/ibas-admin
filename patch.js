const fs = require('fs');
const file = 'src/components/Dashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const loadData = async \(\) => {[\s\S]*?setLoading\(false\);\n    };/,
  `const loadData = async () => {
      try {
        console.log("Fetching IBAS data...");
        const result = await fetchIbasData();
        console.log("Fetch result:", result);
        setData(result);
        if (result.ativos && result.ativos.length > 0) {
          setSelectedAsset(result.ativos[0]);
        }
      } catch (e) {
        console.error("Error in loadData:", e);
      } finally {
        setLoading(false);
      }
    };`
);
fs.writeFileSync(file, content);
