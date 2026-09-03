import fs from 'fs';
const file = 'src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

const routeToInject = '            <Route path="/admin" element={<motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:1.05}} transition={{duration:0.3}}><AdminAuthWrapper><AdminPanel /></AdminAuthWrapper></motion.div>} />\n';

if (content.includes('path="/admin"') && !content.includes(routeToInject.trim())) {
  content = content.replace(
    '<Route path="/register" element={<Register />} />\n            <Route path="*" element={<Navigate to="/" replace />} />',
    '<Route path="/register" element={<Register />} />\n' + routeToInject + '            <Route path="*" element={<Navigate to="/" replace />} />'
  );
  fs.writeFileSync(file, content);
  console.log("Admin route added to public mode!");
} else {
  console.log("Could not patch App.jsx");
}
