import fs from 'fs';

const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf-8');

if (!content.includes('import { AnimatePresence, motion } from "framer-motion";')) {
  content = content.replace(
    'import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";',
    'import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";\nimport { AnimatePresence, motion } from "framer-motion";'
  );
}

const animatedRoutesCode = `
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} transition={{duration:0.3}}><PublicLayout><Dashboard /></PublicLayout></motion.div>} />
        <Route path="/projeto/:id" element={<motion.div initial={{opacity:0, x:50}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-50}} transition={{duration:0.3}}><PublicLayout><ProjectDetails /></PublicLayout></motion.div>} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </AnimatePresence>
  );
}
`;

content = content.replace(
  /<Routes>[\s\S]*?<\/Routes>/,
  '<AnimatedRoutes />'
);

if (!content.includes('function AnimatedRoutes()')) {
  content = content.replace('function App() {', animatedRoutesCode + '\nfunction App() {');
}

fs.writeFileSync(path, content);
