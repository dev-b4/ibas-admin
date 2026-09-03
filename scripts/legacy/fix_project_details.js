import fs from 'fs';
const path = 'src/components/ProjectDetails.jsx';
let content = fs.readFileSync(path, 'utf8');

// The labels in the component are title case or similar
content = content.replace(
  '<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Pontuação Total</p>',
  '<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t("projectDetails.totalScore")}</p>'
);
content = content.replace(
  '<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Impacto no IBAS</p>',
  '<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t("projectDetails.impactIbas")}</p>'
);
content = content.replace(
  '<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Total de Créditos de Carbono</p>',
  '<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t("projectDetails.totalCredits")}</p>'
);

// Under the score there is a small label? Wait, "Total volume" is there, let's fix that.
content = content.replace(
  '<p className="text-xs text-slate-500 font-medium">Volume total</p>',
  '<p className="text-xs text-slate-500 font-medium">{t("projectDetails.volumeTotal")}</p>'
);
content = content.replace(
  '<p className="text-xs text-slate-500 font-medium">do peso do índice</p>',
  '<p className="text-xs text-slate-500 font-medium">{t("projectDetails.weightIndex")}</p>'
);

fs.writeFileSync(path, content);
