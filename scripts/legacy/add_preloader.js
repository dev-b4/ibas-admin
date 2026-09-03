import fs from 'fs';

const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf-8');

const preloaderCode = `
function Preloader({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-[#150B2D] flex items-center justify-center flex-col"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-white text-5xl font-extrabold tracking-tighter flex items-center justify-center gap-1"
      >
        IBAS
        <span className="text-sm font-semibold tracking-normal text-[#7C2DFF] mt-1 relative -top-2">B4</span>
      </motion.div>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: 100 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="h-1 bg-[#7C2DFF] rounded-full mt-4"
      />
    </motion.div>
  );
}
`;

if (!content.includes('function Preloader')) {
  content = content.replace('function App() {', preloaderCode + '\nfunction App() {');
}

// Add state to App
content = content.replace(
  'function App() {',
  'function App() {\n  const [loadingApp, setLoadingApp] = useState(true);\n'
);

content = content.replace(
  '<GlobalAuthWrapper>',
  '<GlobalAuthWrapper>\n      <AnimatePresence>{loadingApp && <Preloader onComplete={() => setLoadingApp(false)} />}</AnimatePresence>\n      {!loadingApp && ('
);

content = content.replace(
  '</GlobalAuthWrapper>',
  ')}\n    </GlobalAuthWrapper>'
);

fs.writeFileSync(path, content);
