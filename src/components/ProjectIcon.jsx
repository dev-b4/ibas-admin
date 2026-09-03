import React from 'react';

const LOGOS = {
  'BF Terra': './bf-terra-coin.png',
  'Apoena Kaa': './apoena-kaa-coin.png',
  'Arace iba': './arace-iba-coin.png',
  'Dowedi': './dowedi-coin.png',
  'Owie': './owie-bitioni-coin.png',
  'Tonca': './tonca-coin.png',
  'Yaku': './yaku-coin.png',
  'Green Guardians': './green-guardians-coin.png',
  'B4': 'https://b4.capital/pt/wp-content/uploads/2024/06/b4-icone-site.png'
};

export default function ProjectIcon({ project, className = "", imgClassName = "" }) {
  if (!project) return null;
  
  let match = null;
  for (const [key, url] of Object.entries(LOGOS)) {
    if (project.nome && project.nome.toLowerCase().includes(key.toLowerCase())) {
      match = url;
      break;
    }
  }

  // Se for Apoena Kaa ou BF Terra, usamos bg-transparent para aparecer o hexágono/redondo limpo
  // Nos outros, mantemos a cor de fundo original caso seja fallback de texto
  const hasLogo = !!match;
  
  if (hasLogo) {
    return (
      <div className={`shrink-0 overflow-hidden flex items-center justify-center ${className} bg-transparent`}>
        <img src={match} alt={project.nome} className={`w-full h-full object-contain drop-shadow-sm scale-110 ${imgClassName}`} />
      </div>
    );
  }

  // Fallback text
  const text = project.nome ? project.nome.replace('Projeto ', '').substring(0, 2).toUpperCase() : 'B4';
  
  return (
    <div className={`shrink-0 overflow-hidden flex items-center justify-center font-bold text-xs ${className}`}>
      {text}
    </div>
  );
}

export const hasProjectLogo = (name) => {
  if (!name) return false;
  for (const key of Object.keys(LOGOS)) {
    if (name.toLowerCase().includes(key.toLowerCase()) && key !== 'B4') return true;
  }
  return false;
};
