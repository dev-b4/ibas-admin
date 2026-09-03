import fs from 'fs';
const file = 'src/pages/ResetPassword.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import { supabase }")) {
  content = content.replace("import { motion } from 'framer-motion';", "import { motion } from 'framer-motion';\nimport { supabase } from '../api/supabaseClient';");
}

const oldHandleSubmit = /const handleSubmit = \(e\) => \{[\s\S]*?1500\);\n  \};/;
const newHandleSubmit = `const handleSubmit = async (e) => {
    e.preventDefault();
    if(password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if(password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      
      if (updateError) throw updateError;
      
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };`;

content = content.replace(oldHandleSubmit, newHandleSubmit);

fs.writeFileSync(file, content);
console.log("Patched ResetPassword.jsx");
