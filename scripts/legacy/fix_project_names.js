import fs from 'fs';

const path = 'src/components/Dashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  '>{(ativo.nome)}<',
  '>{language === "en" ? ativo.nome.replace("Projeto ", "Project ") : ativo.nome}<'
);
content = content.replace(
  'title={ativo.nome}>{ativo.nome}</span>',
  'title={ativo.nome}>{language === "en" ? ativo.nome.replace("Projeto ", "Project ") : ativo.nome}</span>'
);
content = content.replace(
  '<h3 className="font-bold text-[#150B2D] text-lg md:text-xl leading-tight break-words">{selectedAsset.nome}</h3>',
  '<h3 className="font-bold text-[#150B2D] text-lg md:text-xl leading-tight break-words">{language === "en" ? selectedAsset.nome.replace("Projeto ", "Project ") : selectedAsset.nome}</h3>'
);

fs.writeFileSync(path, content);
