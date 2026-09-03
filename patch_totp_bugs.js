import fs from 'fs';

const filesToPatchFind = ['src/App.jsx', 'src/pages/ResetPassword.jsx', 'src/pages/VerifyTOTP.jsx', 'src/pages/Login.jsx'];

for (const file of filesToPatchFind) {
  let content = fs.readFileSync(file, 'utf8');
  // Replace the bad find logic
  content = content.replace(/const totpFactor = factors\?\.totp\?\.\[0\] \|\| factors\?\.all\?\.find\(f => f\.factor_type === 'totp'\);/g, "const totpFactor = factors?.all?.find(f => f.factor_type === 'totp' && f.status === 'verified');");
  content = content.replace(/const totp = factors\?\.totp\?\.\[0\] \|\| factors\?\.all\?\.find\(f => f\.factor_type === 'totp' && f\.status === 'verified'\);/g, "const totp = factors?.all?.find(f => f.factor_type === 'totp' && f.status === 'verified');");
  fs.writeFileSync(file, content);
}

// Now let's fix SetupTOTP.jsx
const setupFile = 'src/pages/SetupTOTP.jsx';
let setupContent = fs.readFileSync(setupFile, 'utf8');

const oldEnroll = /const \{ data, error \} = await supabase\.auth\.mfa\.enroll\(\{ factorType: 'totp' \}\);/;
const newEnroll = `const { data: factors } = await supabase.auth.mfa.listFactors();
        const unverified = factors?.all?.filter(f => f.factor_type === 'totp' && f.status === 'unverified') || [];
        for (const f of unverified) {
          await supabase.auth.mfa.unenroll({ factorId: f.id });
        }
        
        const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });`;

setupContent = setupContent.replace(oldEnroll, newEnroll);
fs.writeFileSync(setupFile, setupContent);

console.log("Patched all TOTP logic");
