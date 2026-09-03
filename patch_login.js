import fs from 'fs';
const file = 'src/pages/Login.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import { supabase }")) {
  content = content.replace("import { motion } from 'framer-motion';", "import { motion } from 'framer-motion';\nimport { supabase } from '../api/supabaseClient';");
}

const oldLoginFunc = /const handleLogin = async \(e\) => \{[\s\S]*?1000\);\n  \};/;
const newLoginFunc = `const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (!email || !password) {
        throw new Error('Por favor, preencha todos os campos.');
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
      if (factorsError) throw factorsError;

      const totpFactor = factors?.totp?.[0] || factors?.all?.find(f => f.factor_type === 'totp');

      if (!totpFactor || totpFactor.status !== 'verified') {
        navigate('/setup-totp');
      } else {
        navigate('/verify-totp');
      }
    } catch (err) {
      console.error(err);
      setError(err.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : err.message);
    } finally {
      setLoading(false);
    }
  };`;

content = content.replace(oldLoginFunc, newLoginFunc);
fs.writeFileSync(file, content);
console.log("Patched Login.jsx");
