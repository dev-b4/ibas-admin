import fs from 'fs';
const file = 'src/api/mockData.js';
let content = fs.readFileSync(file, 'utf8');
const oldMock = fs.readFileSync('old_mock.js', 'utf8');

const oldFetchMatch = oldMock.match(/(export const fetchIbasData = async \(\) => {[\s\S]*?}\n};\n)/);
if (!oldFetchMatch) {
  console.log("Failed to extract old fetchIbasData");
  process.exit(1);
}

// Convert old fetchIbasData into a fallback function
let fallbackFunc = oldFetchMatch[1].replace("export const fetchIbasData = async () => {", "export const getApiFallbackAssets = async () => {");
// We only want the assets array, so replace the return statements
fallbackFunc = fallbackFunc.replace(/return \{\n\s*moedaBase:.*\n\s*ptax:.*\n\s*fatorNormalizacao:.*\n\s*ativos: (.*)\n\s*\};/g, "return $1;");

if (!content.includes("export const getApiFallbackAssets = async () => {")) {
  content = content.replace("export function getFallbackAssets() {", fallbackFunc + "\n\nexport function getFallbackAssets() {");
}

// Now replace the fetchIbasData fallback logic to await getApiFallbackAssets()
content = content.replace(/ativos: validAssets\.length > 0 \? validAssets : getFallbackAssets\(\)/, "ativos: validAssets.length > 0 ? validAssets : await getApiFallbackAssets()");
content = content.replace(/ativos: getFallbackAssets\(\)/g, "ativos: await getApiFallbackAssets()");

fs.writeFileSync(file, content);
console.log("Patched projects fallback!");
