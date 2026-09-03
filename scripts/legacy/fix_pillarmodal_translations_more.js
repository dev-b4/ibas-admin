import fs from 'fs';

const path = 'src/components/PillarModal.jsx';
let content = fs.readFileSync(path, 'utf8');

const additionalDict = `
      'Auditoria Independente': 'Independent Auditing',
      'Relatório de Auditoria Independente': 'Independent Audit Report',
      'Avaliação independente das métricas de sequestro de carbono.': 'Independent evaluation of carbon sequestration metrics.',
      'Auditoria de Impacto Social': 'Social Impact Audit',
      'Avaliação das condições da comunidade local.': 'Evaluation of local community conditions.',
`;

content = content.replace(
  "'Ver Log de Alterações': 'View Change Log',",
  "'Ver Log de Alterações': 'View Change Log',\n" + additionalDict
);

fs.writeFileSync(path, content);
