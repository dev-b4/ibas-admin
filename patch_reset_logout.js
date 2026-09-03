import fs from 'fs';
const file = 'src/pages/ResetPassword.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldCode = "setSuccess(true);\n      setTimeout(() => navigate('/login'), 2000);";
const newCode = "setSuccess(true);\n      await supabase.auth.signOut();\n      setTimeout(() => navigate('/login'), 2000);";

content = content.replace(oldCode, newCode);
fs.writeFileSync(file, content);
console.log("Patched ResetPassword with signOut");
