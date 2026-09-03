import fs from 'fs';
const file = 'src/pages/VerifyTOTP.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import { supabase }")) {
  content = content.replace("import { motion } from 'framer-motion';", "import { motion } from 'framer-motion';\nimport { supabase } from '../api/supabaseClient';");
}

content = content.replace("const [loading, setLoading] = useState(false);", "const [loading, setLoading] = useState(false);\n  const [error, setError] = useState('');");

const oldHandleVerify = /const handleVerify = \(e\) => \{[\s\S]*?1000\);\n  \};/;
const newHandleVerify = `const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
      if (factorsError) throw factorsError;
      
      const totpFactor = factors?.totp?.[0] || factors?.all?.find(f => f.factor_type === 'totp');
      if (!totpFactor) throw new Error('Nenhum dispositivo 2FA configurado.');
      
      const challenge = await supabase.auth.mfa.challenge({ factorId: totpFactor.id });
      if (challenge.error) throw challenge.error;
      
      const verify = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challenge.data.id,
        code
      });
      
      if (verify.error) throw verify.error;
      
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError('Código inválido ou expirado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };`;

content = content.replace(oldHandleVerify, newHandleVerify);

// And add error rendering
content = content.replace('<div className="text-center mb-8">', '<div className="text-center mb-8">\n        {error && <div className="mb-4 p-3 bg-red-900/50 text-red-300 text-sm rounded-lg border border-red-500/50">{error}</div>}');

fs.writeFileSync(file, content);
console.log("Patched VerifyTOTP.jsx");
