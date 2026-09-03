import fs from 'fs';
const file = 'src/pages/ResetPassword.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldUseEffect = /useEffect\(\(\) => \{[\s\S]*?checkMFA\(\);\n  \}, \[\]\);/;
const newUseEffect = `useEffect(() => {
    const checkMFA = async () => {
      try {
        const { data: factors } = await supabase.auth.mfa.listFactors();
        const totp = factors?.totp?.[0] || factors?.all?.find(f => f.factor_type === 'totp' && f.status === 'verified');
        
        if (totp) {
          setNeedsMFA(true);
          setFactorId(totp.id);
        }
      } catch (err) {
        console.error('Erro ao verificar MFA', err);
      }
    };
    checkMFA();
  }, []);`;

content = content.replace(oldUseEffect, newUseEffect);

const oldTryCatch = /try \{[\s\S]*?if \(verify\.error\) throw new Error\('Código Authy inválido ou expirado.'\);\n      \}\n\n      const \{ error: updateError \} = await supabase\.auth\.updateUser\(\{ password \}\);[\s\S]*?finally \{/
const newTryCatch = `try {
      if (needsMFA && factorId) {
        const challenge = await supabase.auth.mfa.challenge({ factorId });
        if (challenge.error) throw challenge.error;
        
        const verify = await supabase.auth.mfa.verify({
          factorId,
          challengeId: challenge.data.id,
          code: mfaCode
        });
        
        if (verify.error) throw new Error('Código Authy inválido ou expirado.');
      }

      const { error: updateError } = await supabase.auth.updateUser({ password });
      
      if (updateError) {
        if (updateError.message.includes('AAL2') || updateError.message.includes('MFA')) {
          setNeedsMFA(true);
          const { data: factors } = await supabase.auth.mfa.listFactors();
          const totp = factors?.totp?.[0] || factors?.all?.find(f => f.factor_type === 'totp' && f.status === 'verified');
          if (totp) setFactorId(totp.id);
          throw new Error('Código Authy necessário. Por favor, digite o código de 6 dígitos que apareceu abaixo.');
        }
        throw updateError;
      }
      
      setSuccess(true);
      await supabase.auth.signOut();
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error(err);
      setError(err.message === 'New password should be different from the old password.' ? 'A nova senha deve ser diferente da antiga.' : err.message);
    } finally {`;

content = content.replace(oldTryCatch, newTryCatch);

fs.writeFileSync(file, content);
console.log("Patched ResetPassword with AAL2 fallback");
