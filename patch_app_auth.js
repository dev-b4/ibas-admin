import fs from 'fs';
const file = 'src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// We need to replace the AdminAuthWrapper completely.
const oldWrapperStart = "function AdminAuthWrapper({ children }) {";
const oldWrapperEndMatch = content.match(/(function AdminAuthWrapper\(\{\s*children\s*\}\) \{[\s\S]*?\n\s*return children;\n\})/);

if (oldWrapperEndMatch) {
  const oldWrapper = oldWrapperEndMatch[1];
  
  const newWrapper = `import { supabase } from './api/supabaseClient';

function AdminAuthWrapper({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/login');
          return;
        }
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        // Check MFA status
        const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
        const totpFactor = factors?.totp?.[0] || factors?.all?.find(f => f.factor_type === 'totp');
        
        if (!totpFactor || totpFactor.status !== 'verified') {
          navigate('/setup-totp');
          return;
        }

        const { data: { assuranceLevel } } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (assuranceLevel?.currentLevel === 'aal1') {
          navigate('/verify-totp');
          return;
        }

        setAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 text-slate-500 font-bold">Verificando segurança...</div>;
  }

  if (!authenticated) {
    return null;
  }

  return children;
}`;

  content = content.replace(oldWrapper, newWrapper);
  
  // Make sure we have the supabase import at the top of App.jsx if it's missing
  if (!content.includes("import { supabase }")) {
    content = content.replace("import React,", "import React,\nimport { supabase } from './api/supabaseClient';\n");
  }
  
  fs.writeFileSync(file, content);
  console.log("Patched App.jsx AdminAuthWrapper");
} else {
  console.log("Could not find AdminAuthWrapper");
}
