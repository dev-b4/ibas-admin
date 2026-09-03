import React from 'react';


import { useLanguage } from "../context/LanguageContext";
export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="w-full bg-[#181B26] text-slate-300 pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Left Column: Brand, Stamps & Actions (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Logo */}
            <div className="flex items-center justify-start">
              <a href="https://bolsa.b4.capital" target="_blank" rel="noopener noreferrer" className="inline-block -ml-9 sm:-ml-7">
                <img
                  src="https://b4.capital/pt/wp-content/uploads/2024/06/b4-logo-em-alta-1536x1191.png"
                  alt="B4 Bolsa de Ação Climática"
                  referrerPolicy="no-referrer"
                  className="h-24 sm:h-20 w-auto object-contain"
                />
              </a>
            </div>

            {/* Slogan */}
            <p className="text-slate-300 text-sm sm:text-base font-normal max-w-md leading-relaxed">
              <span className="block">{t('footer.slogan1')}</span>
              <span className="block">{t('footer.slogan2')}</span>
            </p>

            {/* Contact Email */}
            <div>
              <a
                href="mailto:contato@b4.capital"
                className="font-bold text-white text-base hover:text-[#7C2DFF] transition-colors"
              >
                contato@b4.capital
              </a>
            </div>

            {/* Badges / Stamps Row */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Reclame Aqui Stamp */}
              <a
                href="https://www.reclameaqui.com.br/empresa/b4-capital-plataforma-exchange-s-a/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-90 transition-opacity"
              >
                <img
                  src="https://b4.capital/pt/wp-content/uploads/2024/11/midiakit_b4_generic_stamp-1-1.png"
                  alt="Empresa verificada por Reclame AQUI"
                  referrerPolicy="no-referrer"
                  className="h-12 w-auto object-contain"
                />
              </a>

              {/* GHG Protocol Stamp */}
              <a
                href="https://b4.capital/pt/wp-content/uploads/2024/11/Membro-2025-copiar-1536x1536.png"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-90 transition-opacity"
              >
                <img
                  src="https://b4.capital/pt/wp-content/uploads/2024/11/Membro-2025-copiar-1536x1536.png"
                  alt="Programa Brasileiro GHG Protocol Membro 2025"
                  referrerPolicy="no-referrer"
                  className="h-14 w-auto object-contain"
                />
              </a>
            </div>

            {/* SBCE Conformity Stamp */}
            <div className="pt-1">
              <img
                src="https://b4.capital/pt/wp-content/uploads/2024/11/selo-sbce-b4-1536x407.png"
                alt="Plataforma em conformidade com SBCE Lei Nº 15.042/2024"
                referrerPolicy="no-referrer"
                className="h-16 sm:h-20 w-auto object-contain max-w-full"
              />
            </div>

            {/* Social Links & Signup Button */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <a
                  href="https://www.youtube.com/@B4Capital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800/80 hover:bg-[#7C2DFF] text-slate-200 hover:text-white flex items-center justify-center transition-all duration-200"
                  aria-label="YouTube B4 Capital"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 8.432v7.136L15.818 12 9.545 8.432z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/empresa-b4-capital/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800/80 hover:bg-[#7C2DFF] text-slate-200 hover:text-white flex items-center justify-center transition-all duration-200"
                  aria-label="LinkedIn B4 Capital"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a
                  href="https://www.instagram.com/b4.capital?igsh=YTZsdTEyeDlkNm53"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800/80 hover:bg-[#7C2DFF] text-slate-200 hover:text-white flex items-center justify-center transition-all duration-200"
                  aria-label="Instagram B4 Capital"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>

              <a
                href="https://bolsa.b4.capital/account/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#7C2DFF] hover:bg-[#6C23E8] text-white font-extrabold text-sm px-6 py-3 rounded-full shadow-lg shadow-purple-900/30 hover:scale-[1.02] transition-all duration-200"
              >
                {t('footer.createAccountBtn')}
              </a>
            </div>
          </div>

          {/* Right Columns: Navigation Grid (7 cols on lg) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            
            {/* Column 1: {t('header.market')} & {t('header.listings')} */}
            <div className="space-y-8">
              <div>
                <h3 className="text-white font-extrabold text-base mb-4 tracking-tight">
                  {t('header.market')}
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                  <li>
                    <a href="https://www.youtube.com/@B4Capital" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      {t('footer.whoWeAre')}
                    </a>
                  </li>
                  <li>
                    <a href="https://bolsa.b4.capital" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      {t('footer.compensate')}
                    </a>
                  </li>
                  <li>
                    <a href="https://b4.capital/pt/relogio-de-acao-climatica/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      {t('footer.indicators')}
                    </a>
                  </li>
                  <li>
                    <a href="https://bolsa.b4.capital" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      {t('footer.climateProject')}
                    </a>
                  </li>
                  <li>
                    <a href="https://b4.capital/pt/homologacao/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      {t('footer.homologated')}
                    </a>
                  </li>
                  <li>
                    <a href="https://b4.capital/pt/taxas-de-negociacao" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      {t('footer.fees')}
                    </a>
                  </li>
                  <li>
                    <a href="http://b4.capital/pt/vagas/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      {t('footer.workWithUs')}
                    </a>
                  </li>
                  <li>
                    <a href="/#/" className="hover:text-white transition-colors">
                      {t('footer.ibasLink')}
                    </a>
                  </li>
                  <li>
                    <a href="/#/" className="hover:text-white transition-colors">
                      {t('footer.projectScoreLink')}
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-extrabold text-base mb-4 tracking-tight">
                  {t('header.listings')}
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                  <li>
                    <a href="https://b4.capital/pt/listagens-b4/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      {t('footer.sustainableAssets')}
                    </a>
                  </li>
                  <li>
                    <a href="https://b4.capital/pt/listagens-b4/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      {t('footer.carbonCredits')}
                    </a>
                  </li>
                  <li>
                    <a href="https://b4.capital/pt/category/boletim/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      {t('footer.dailyBulletin')}
                    </a>
                  </li>
                  <li>
                    <a href="https://b4.capital/pt/listagens-b4/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      {t('footer.index')}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 2: {t('header.sustainability')} & {t('header.help')} */}
            <div className="space-y-8">
              <div>
                <h3 className="text-white font-extrabold text-base mb-4 tracking-tight">
                  {t('header.sustainability')}
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                  <li>
                    <a href="https://brasil.un.org/pt-br/sdgs" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      {t('footer.ods')}
                    </a>
                  </li>
                  <li>
                    <a href="https://b4.capital/pt/relogio-de-acao-climatica/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      {t('footer.climateClock')}
                    </a>
                  </li>
                  <li>
                    <a href="https://agentedoclima.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      {t('footer.climateAgent')}
                    </a>
                  </li>
                  <li>
                    <a href="https://b4.capital/pt/projetos-especiais-b4/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      {t('footer.specialProjects')}
                    </a>
                  </li>
                  <li>
                    <a href="https://b4.capital/pt/painel-corporativo/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      {t('footer.corporatePanel')}
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-extrabold text-base mb-4 tracking-tight">
                  {t('header.help')}
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                  <li>
                    <a href="mailto:imprensa@b4.capital" className="hover:text-white transition-colors">
                      {t('footer.press')}
                    </a>
                  </li>
                  <li>
                    <a href="https://b4.capital/pt/blog" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      {t('footer.blog')}
                    </a>
                  </li>
                  <li>
                    <a href="mailto:suporte@b4.capital" className="hover:text-white transition-colors">
                      {t('footer.support')}
                    </a>
                  </li>
                  <li>
                    <a href="mailto:denuncia@b4.capital" className="hover:text-white transition-colors">
                      {t('footer.whistleblower')}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 3: Blockchain */}
            <div>
              <h3 className="text-white font-extrabold text-base mb-4 tracking-tight">
                Blockchain
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                <li>
                  <a href="https://b4.capital/pt/refi/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    {t('footer.refi')}
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Rights & Legal Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400 text-left">
          <p>{t('footer.rights')}</p>
          <a
            href="https://b4.capital/pt/documentos/termos_de_uso.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white underline transition-colors"
          >
            {t('footer.terms')}
          </a>
        </div>
      </div>
    </footer>
  );
}
