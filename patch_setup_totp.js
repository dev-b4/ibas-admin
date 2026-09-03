import fs from 'fs';
const file = 'src/pages/SetupTOTP.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import { supabase }")) {
  content = content.replace("import { motion } from 'framer-motion';", "import { motion } from 'framer-motion';\nimport { supabase } from '../api/supabaseClient';");
}

// Add state for qrCodeUrl and factorId
content = content.replace("const [secret, setSecret] = useState('JBSWY3DPEHPK3PXP'); // Mock secret", "const [secret, setSecret] = useState('');\n  const [qrCodeUrl, setQrCodeUrl] = useState('');\n  const [factorId, setFactorId] = useState('');\n  const [error, setError] = useState('');");

// We need to add useEffect to enroll MFA on mount
const useEffectHook = `
  useEffect(() => {
    const enrollMFA = async () => {
      try {
        const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
        if (error) throw error;
        
        setFactorId(data.id);
        setQrCodeUrl(data.totp.qr_code);
        setSecret(data.totp.secret);
      } catch (err) {
        console.error(err);
        setError('Erro ao iniciar configuração do Authy: ' + err.message);
      }
    };
    enrollMFA();
  }, []);
`;

// Insert after useNavigate()
content = content.replace("const navigate = useNavigate();", "const navigate = useNavigate();\n" + useEffectHook);

const oldHandleVerify = /const handleVerify = \(e\) => \{[\s\S]*?1000\);\n  \};/;
const newHandleVerify = `const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const challenge = await supabase.auth.mfa.challenge({ factorId });
      if (challenge.error) throw challenge.error;
      
      const verify = await supabase.auth.mfa.verify({
        factorId,
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

// Also render error message if it exists, and replace QRCodeSVG value with the real one
content = content.replace("<QRCodeSVG value={`otpauth://totp/B4%20Admin?secret=${secret}&issuer=B4%20Capital`} size={160} />", "{qrCodeUrl ? <img src={qrCodeUrl} alt=\"QR Code\" width=\"160\" height=\"160\" /> : <div className=\"w-[160px] h-[160px] animate-pulse bg-slate-800 rounded-lg\"></div>}");

// And add error rendering
content = content.replace('<div className="text-center mb-8">', '<div className="text-center mb-8">\n        {error && <div className="mb-4 p-3 bg-red-900/50 text-red-300 text-sm rounded-lg border border-red-500/50">{error}</div>}');

fs.writeFileSync(file, content);
console.log("Patched SetupTOTP.jsx");
