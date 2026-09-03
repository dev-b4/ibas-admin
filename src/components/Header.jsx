import React, { useState, useRef } from 'react';
import { ChevronDown, Menu, X, ArrowUpRight } from 'lucide-react';
import { B4Logo } from './B4Logo';



import { useLanguage } from "../context/LanguageContext";

export const Header = ({
  isMobilePreview = false,
}) => {
  const { t } = useLanguage();
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = (catId) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveMenu(catId);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 350);
  };

  const handleLinkClick = (url) => {
    if (url.startsWith('mailto:')) {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const navCategories = [
    {
      label: t('header.forCompanies') || 'Para empresas',
      id: 'empresas',
      items: [
        {
          title: t('header.dropdowns.wantToCompensate'),
          url: 'https://bolsa.b4.capital/',
        },
        {
          title: t('header.dropdowns.carbonInventory'),
          url: 'https://agentedoclima.com/',
        },
        {
          title: t('header.dropdowns.homologation'),
          url: 'https://b4.capital/pt/homologacao/',
        },
      ],
    },
    {
      label: t('header.forPeople') || 'Para pessoas',
      id: 'pessoas',
      items: [
        {
          title: t('header.dropdowns.calcCarbon'),
          url: 'https://agentedoclima.com/',
        },
      ],
    },
    {
      label: t('header.insights') || 'Insights',
      id: 'insights',
      items: [
        {
          title: t('header.dropdowns.blog'),
          url: 'https://b4.capital/pt/blog/',
        },
        {
          title: t('header.dropdowns.portal'),
          url: 'https://portalb4.capital/',
        },
      ],
    },
    {
      label: t('header.projects') || 'Projetos',
      id: 'projetos',
      items: [
        {
          title: t('header.dropdowns.specials'),
          url: 'https://b4.capital/pt/projetos-especiais-b4/#especiais',
        },
        {
          title: t('header.dropdowns.listed'),
          url: 'https://b4.capital/pt/projetos-especiais-b4/',
        },
      ],
    },
    {
      label: t('header.listings'),
      id: 'listagens',
      items: [
        {
          title: t('header.dropdowns.applyListing'),
          url: 'https://b4.capital/pt/listagens-b4/',
        },
      ],
    },
    {
      label: t('header.refi') || 'ReFi',
      id: 'refi',
      items: [
        {
          title: 'IBAS',
          url: '/',
        },
        {
          title: t('header.dropdowns.climateClock'),
          url: 'https://b4.capital/pt/relogio-de-acao-climatica/',
        },
        {
          title: t('header.dropdowns.regenFinance'),
          url: 'https://b4.capital/pt/refi/',
        },
        {
          title: t('header.dropdowns.academy'),
          url: 'https://www.instagram.com/b4.capital',
        },
        {
          title: t('header.dropdowns.events'),
          url: 'https://www.instagram.com/b4.capital',
        },
      ],
    },
    {
      label: t('header.help'),
      id: 'ajuda',
      items: [
        {
          title: t('header.dropdowns.support'),
          url: 'https://tawk.to/chat/644ec71d4247f20fefeea08e/1gv9rjjo4',
        },
        {
          title: t('header.dropdowns.press'),
          url: 'mailto:imprensa@b4.capital',
        },
        {
          title: t('header.dropdowns.report'),
          url: 'mailto:denuncia@b4.capital',
        },
      ],
    },
  ];

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100/80 sticky top-0 z-40 transition-all duration-200 animate-menu-reveal">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <B4Logo size={isMobilePreview ? 'sm' : 'md'} />
        </div>

        {/* Center Navigation Links - Desktop Only */}
        {!isMobilePreview && (
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navCategories.map((cat) => (
              <div
                key={cat.id}
                className="relative py-3"
                onMouseEnter={() => handleMouseEnter(cat.id)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (activeMenu === cat.id) {
                      setActiveMenu(null);
                    } else {
                      handleMouseEnter(cat.id);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#7C2DFF] transition-colors rounded-lg ${
                    activeMenu === cat.id ? 'text-[#7C2DFF] bg-purple-50/60' : ''
                  }`}
                >
                  <span>{cat.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMenu === cat.id ? 'rotate-180 text-[#7C2DFF]' : 'text-slate-400'
                  }`} />
                </button>

                {/* Dropdown Menu with Seamless Invisible Hover Bridge */}
                {activeMenu === cat.id && (
                  <div
                    className="absolute top-full left-0 w-72 z-50 pt-1 before:content-[''] before:absolute before:-top-5 before:left-0 before:w-full before:h-6"
                  >
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100/90 p-2 animate-fade-in-down">
                      <div className="space-y-1">
                        {cat.items.map((item, idx) => (
                          <a
                            key={idx}
                            href={item.url}
                            target={item.url.startsWith('mailto:') ? '_self' : '_blank'}
                            rel="noopener noreferrer"
                            onClick={() => {
                              setActiveMenu(null);
                            }}
                            className="w-full text-left p-2.5 rounded-xl hover:bg-purple-50/80 transition-all group flex items-center justify-between"
                          >
                            <span className="text-sm font-normal text-slate-700 group-hover:text-[#7C2DFF] transition-colors">
                              {item.title}
                            </span>
                            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#7C2DFF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-0 group-hover:opacity-100 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="https://bolsa.b4.capital/account/login"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-[#8B31FF] border-2 border-[#8B31FF] rounded-full hover:bg-purple-50 hover:-translate-y-1 hover:shadow-md hover:shadow-purple-200/50 transition-all duration-200 active:translate-y-0 active:scale-95 whitespace-nowrap shadow-xs inline-block transform-gpu"
          >
            {t('header.accessMarket')}
          </a>

          <a
            href="https://bolsa.b4.capital/account/signup-v2"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#7C2DFF] rounded-full hover:bg-[#6C1EEF] hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-300/60 transition-all duration-200 active:translate-y-0 active:scale-95 whitespace-nowrap inline-block transform-gpu"
          >
            {t('header.createAccount')}
          </a>

          {/* Hamburger Menu Toggle (Mobile View) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xl p-4 animate-fade-in-down">
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {navCategories.map((cat) => (
              <div key={cat.id} className="border-b border-slate-100 pb-3">
                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 px-2">
                  {cat.label}
                </div>
                <div className="space-y-1">
                  {cat.items.map((item, i) => (
                    <a
                      key={i}
                      href={item.url}
                      target={item.url.startsWith('mailto:') ? '_self' : '_blank'}
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-left py-2 px-2.5 rounded-lg text-sm font-normal text-slate-700 hover:text-[#7C2DFF] hover:bg-purple-50 flex items-center justify-between"
                    >
                      <span>{item.title}</span>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

