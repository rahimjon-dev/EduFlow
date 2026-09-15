import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { useTranslation } from '../../i18n';
import type { Language } from '../../i18n/types';
import { cn } from '../../utils/cn';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'navbar' | 'minimal' | 'footer';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className, variant = 'navbar' }) => {
  const { language, setLanguage, supportedLanguages, currentLanguageOption } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setOpen(false);
  };

  return (
    <div className={cn('relative inline-block text-left', className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors',
          variant === 'navbar' &&
            'bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 shadow-2xs',
          variant === 'minimal' &&
            'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70',
          variant === 'footer' &&
            'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="text-sm shrink-0">{currentLanguageOption.flag}</span>
        <span className="hidden sm:inline font-medium">{currentLanguageOption.nativeName}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white shadow-soft-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-1.5 border-b border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Tilni tanlang / Язык / Language
            </p>
          </div>
          <div className="p-1 space-y-0.5">
            {supportedLanguages.map((item) => {
              const isSelected = item.code === language;
              return (
                <button
                  key={item.code}
                  onClick={() => handleSelect(item.code)}
                  className={cn(
                    'w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors text-left',
                    isSelected
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{item.flag}</span>
                    <div>
                      <p className="font-medium text-slate-800 leading-none">{item.nativeName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.name}</p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
