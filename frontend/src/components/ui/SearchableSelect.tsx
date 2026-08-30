import React, { useEffect, useRef, useState } from 'react';

const useOutsideClick = <T extends HTMLElement>(isOpen: boolean, onClose: () => void) => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isOpen, onClose]);

  return ref;
};

export interface SearchableSelectOption {
  value: string | number;
  label: string;
  meta?: string;
}

export const SearchableSelect: React.FC<{
  value: string | number | undefined;
  onChange: (value: string | number) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchable?: boolean;
  className?: string;
  buttonClassName?: string;
}> = ({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  searchable = false,
  className = '',
  buttonClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const dropdownRef = useOutsideClick<HTMLDivElement>(isOpen, () => setIsOpen(false));

  const selectedOption = options.find((option) => String(option.value) === String(value ?? ''));

  const filteredOptions = searchable
    ? options.filter((option) => {
        const searchText = `${option.label} ${option.meta ?? ''}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
      })
    : options;

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-left text-xs font-semibold text-slate-900 dark:text-white shadow-sm transition-all hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500 ${buttonClassName}`}
      >
        <span className="truncate">{selectedOption?.label ?? placeholder}</span>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path d="M5 7.5L10 12.5L15 7.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        className={`absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900/95 text-white shadow-2xl shadow-slate-950/50 backdrop-blur-sm transition-all duration-200 ease-out ${
          isOpen
            ? 'pointer-events-auto max-h-80 opacity-100 translate-y-0'
            : 'pointer-events-none max-h-0 translate-y-1 opacity-0 border-transparent'
        }`}
      >
        {searchable && (
          <div className="border-b border-slate-700 p-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-white placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
            />
          </div>
        )}

        <div className="max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const isSelected = String(option.value) === String(value ?? '');
              return (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-brand-600/20 text-brand-300'
                      : 'text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {option.meta && <span className="text-[10px] text-slate-400">{option.meta}</span>}
                </button>
              );
            })
          ) : (
            <div className="px-3 py-3 text-xs text-slate-400">No matching option found.</div>
          )}
        </div>
      </div>
    </div>
  );
};
