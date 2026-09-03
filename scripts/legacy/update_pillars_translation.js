const fs = require('fs');
const path = './src/locales/translations.js';
let content = fs.readFileSync(path, 'utf8');

const ptPillars = `
      "Impacto Socioambiental": "Impacto Socioambiental",
      "Compromisso do Originador": "Compromisso do Originador",
      "Governança e Conformidade": "Governança e Conformidade",
      "Adicionalidade": "Adicionalidade",
      "Integridade Documental": "Integridade Documental",
      "Auditoria": "Auditoria",
      "Rastreabilidade Blockchain": "Rastreabilidade Blockchain",
      "Transparência Financeira": "Transparência Financeira",
      "Reputação e Relacionamento": "Reputação e Relacionamento",
      "Rating de Integridade": "Rating de Integridade",
      "Capacidade Operacional": "Capacidade Operacional"
`;

const enPillars = `
      "Impacto Socioambiental": "Socio-environmental Impact",
      "Compromisso do Originador": "Originator Commitment",
      "Governança e Conformidade": "Governance and Compliance",
      "Adicionalidade": "Additionality",
      "Integridade Documental": "Documentary Integrity",
      "Auditoria": "Auditing",
      "Rastreabilidade Blockchain": "Blockchain Traceability",
      "Transparência Financeira": "Financial Transparency",
      "Reputação e Relacionamento": "Reputation and Relationship",
      "Rating de Integridade": "Integrity Rating",
      "Capacidade Operacional": "Operational Capacity"
`;

// Replace pt pillars block
content = content.replace(/pillars: \{[^}]+\}/, `pillars: {\n${ptPillars}\n    }`);

// Replace en pillars block (it's the second occurrence, but regex will just find the first if we use the above. Let's do it smarter)
// We can just use string replacement on the exact blocks
fs.writeFileSync(path, content);
