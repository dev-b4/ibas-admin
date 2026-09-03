import fs from 'fs';

const path = 'src/components/PillarModal.jsx';
let content = fs.readFileSync(path, 'utf8');

const translateFunc = `
  const translateMock = (text) => {
    if (language === 'pt') return text;
    const dict = {
      'Certificado de Crédito de Carbono NFT': 'NFT Carbon Credit Certificate',
      'Certificado do Crédito de Carbono': 'Carbon Credit Certificate',
      'Link do Explorer (Acesso ao Crédito)': 'Explorer Link (Credit Access)',
      'Contrato Inteligente no Polygonscan': 'Smart Contract on Polygonscan',
      'Token ERC-721 representando o crédito de carbono registrado na Blockchain Polygon': 'ERC-721 Token representing the carbon credit registered on the Polygon Blockchain',
      'Verificação on-chain do contrato do token na rede Polygon': 'On-chain verification of the token contract on the Polygon network',
      'Aguardando...': 'Waiting...',
      'Aguardando': 'Waiting',
      'Laudo': 'Report',
      'Documento': 'Document',
      'Documento Adicional': 'Additional Document',
      'Projetos de Preservação Florestal e Sequestro de Carbono': 'Forest Preservation and Carbon Sequestration Projects',
      'Avaliação de impactos ambientais e sociais do projeto': 'Assessment of environmental and social impacts of the project',
      'Avalie os registros imutáveis dos ativos sustentáveis do projeto, assegurando segurança, transparência e rastreabilidade em cada etapa.': 'Evaluate the immutable records of the project\\'s sustainable assets, ensuring security, transparency, and traceability at each stage.',
      'Em Análise': 'In Analysis',
      'Registrado': 'Registered',
      'Pilar': 'Pillar',
      'Ver Documento': 'View Document',
      'Ver Log de Alterações': 'View Change Log',
      'Evidências de': 'Evidences of'
    };
    return dict[text] || text;
  };
`;

if (!content.includes('translateMock')) {
  content = content.replace(
    '  const [isLogOpen, setIsLogOpen] = useState(false);',
    '  const [isLogOpen, setIsLogOpen] = useState(false);\n' + translateFunc
  );
}

// Replace exact strings with translateMock()
content = content.replace(
  'Avalie os registros imutáveis dos ativos sustentáveis do projeto, assegurando segurança, transparência e rastreabilidade em cada etapa.',
  "{translateMock('Avalie os registros imutáveis dos ativos sustentáveis do projeto, assegurando segurança, transparência e rastreabilidade em cada etapa.')}"
);
content = content.replace(
  /Pilar \{pillar\.num\}/g,
  "{translateMock('Pilar')} {pillar.num}"
);
content = content.replace(
  /'Documento Adicional'/g,
  "translateMock('Documento Adicional')"
);
content = content.replace(
  /'Aguardando\.\.\.'/g,
  "translateMock('Aguardando...')"
);
content = content.replace(
  /'Projetos de Preservação Florestal e Sequestro de Carbono'/g,
  "translateMock('Projetos de Preservação Florestal e Sequestro de Carbono')"
);
content = content.replace(
  /'Avaliação de impactos ambientais e sociais do projeto'/g,
  "translateMock('Avaliação de impactos ambientais e sociais do projeto')"
);
content = content.replace(
  />Aguardando</g,
  ">{translateMock('Aguardando')}<"
);
content = content.replace(
  /'Laudo'/g,
  "translateMock('Laudo')"
);
content = content.replace(
  /'Documento'/g,
  "translateMock('Documento')"
);
content = content.replace(
  />Ver Documento</g,
  ">{translateMock('Ver Documento')}<"
);
content = content.replace(
  /⏳ Em Análise/g,
  "⏳ {translateMock('Em Análise')}"
);
content = content.replace(
  /📄 Registrado/g,
  "📄 {translateMock('Registrado')}"
);
content = content.replace(
  /\{doc\.label\}/g,
  "{translateMock(doc.label)}"
);
content = content.replace(
  /\{doc\.title\}/g,
  "{translateMock(doc.title)}"
);
content = content.replace(
  /\{doc\.desc\}/g,
  "{translateMock(doc.desc)}"
);

fs.writeFileSync(path, content);
