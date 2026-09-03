import fs from 'fs';
const file = 'src/pages/ForgotPassword.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import { supabase }")) {
  content = content.replace("import { motion } from 'framer-motion';", "import { motion } from 'framer-motion';\nimport { supabase } from '../api/supabaseClient';");
}

content = content.replace("const [loading, setLoading] = useState(false);", "const [loading, setLoading] = useState(false);\n  const [error, setError] = useState('');");

const oldHandleSubmit = /const handleSubmit = \(e\) => \{[\s\S]*?1000\);\n  \};/;
const newHandleSubmit = `const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (!email) throw new Error('Por favor, informe o seu email.');
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/#/reset-password'
      });
      
      if (resetError) throw resetError;
      
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };`;

content = content.replace(oldHandleSubmit, newHandleSubmit);

// Add error rendering
content = content.replace('<div className="text-center mb-8">', '<div className="text-center mb-8">\n              {error && <div className="mb-4 p-3 bg-red-900/50 text-red-300 text-sm rounded-lg border border-red-500/50">{error}</div>}');

fs.writeFileSync(file, content);
console.log("Patched ForgotPassword.jsx");
