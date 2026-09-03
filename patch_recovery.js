import fs from 'fs';
const file = 'src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldApp = "function App() {\\n  const [loadingApp, setLoadingApp] = useState(true);";
const newApp = `function App() {
  const [loadingApp, setLoadingApp] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        window.location.hash = '/reset-password';
      }
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);`;

content = content.replace(/function App\(\) \{\n\s*const \[loadingApp, setLoadingApp\] = useState\(true\);/, newApp);
fs.writeFileSync(file, content);
console.log("Patched App.jsx with PASSWORD_RECOVERY");
