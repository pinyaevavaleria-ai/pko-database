import { useRef, useState, useEffect } from 'react';
import { TabId } from './TabBar';
import { FinanceMode, FinanceYear } from './FinanceTable';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

// ── Filter interfaces ────────────────────────────────────────────

export type SortDirection = 'desc' | 'asc';

export interface RatingFilters {
  sortDir: SortDirection;
  revenueFrom: string;
  revenueTo: string;
  profitFrom: string;
  profitTo: string;
  debtLoadTo: string;
  capitalPublic: boolean;
  capitalCorporate: boolean;
  capitalNone: boolean;
  napka: 'ignore' | 'yes' | 'no';
  experienceFrom: string;
  experienceTo: string;
}

export interface FinanceFilters {
  sortDir: SortDirection;
  revenueFrom: string;
  revenueTo: string;
  profitFrom: string;
  profitTo: string;
  ebitdaFrom: string;
  ebitdaTo: string;
  debtLoadFrom: string;
  debtLoadTo: string;
}

export interface InvestmentFilters {
  status: 'all' | 'open' | 'closed' | 'paused';
  reliability: 'all' | 'A' | 'B' | 'C' | 'D';
  maxRate: number;
}

interface FilterBarProps {
  activeTab: TabId;
  ratingFilters: RatingFilters;
  onRatingFiltersChange: (f: RatingFilters) => void;
  ratingPreset: 'overview' | 'pl' | 'balance' | 'capital';
  onRatingPresetChange: (p: 'overview' | 'pl' | 'balance' | 'capital') => void;
  financeFilters: FinanceFilters;
  onFinanceFiltersChange: (f: FinanceFilters) => void;
  financeMode: FinanceMode;
  onFinanceModeChange: (m: FinanceMode) => void;
  financeYear: FinanceYear;
  onFinanceYearChange: (y: FinanceYear) => void;
  investmentFilters: InvestmentFilters;
  onInvestmentFiltersChange: (f: InvestmentFilters) => void;
}

// ── Hooks ────────────────────────────────────────────

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) {
        return;
      }
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// ── Shared primitives ────────────────────────────────────────────

function Divider() {
  return <div style={{ width: '1px', height: '22px', background: '#e5e7eb', flexShrink: 0 }} />;
}

// Generic Popover Button
function PopoverFilter({
  label,
  isActive,
  activeCount,
  children
}: {
  label: string;
  isActive: boolean;
  activeCount?: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '8px',
          border: `1px solid ${isActive || open ? '#111' : '#e5e7eb'}`,
          background: isActive ? '#f9fafb' : '#fff',
          fontSize: '13px',
          fontWeight: 500,
          color: isActive || open ? '#111' : '#374151',
          cursor: 'pointer',
          outline: 'none',
          whiteSpace: 'nowrap',
          transition: 'all 0.1s'
        }}
      >
        {label}
        {activeCount !== undefined && activeCount > 0 && (
          <span style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: '#111',
            color: '#fff',
            fontSize: '10px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
          }}>
            {activeCount}
          </span>
        )}
        {open ? (
          <ChevronUp style={{ width: '14px', height: '14px', color: isActive || open ? '#111' : '#9ca3af' }} />
        ) : (
          <ChevronDown style={{ width: '14px', height: '14px', color: isActive || open ? '#111' : '#9ca3af' }} />
        )}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 200,
            minWidth: 'max-content',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// Custom Radio Option
function CustomRadio({ checked, label, onChange }: { checked: boolean; label: string; onChange: () => void }) {
  return (
    <label onClick={onChange} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 4px' }}>
      <div style={{
        width: '18px', height: '18px', borderRadius: '50%', border: `1.5px solid ${checked ? '#111' : '#d1d5db'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {checked && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#111' }} />}
      </div>
      <span style={{ fontSize: '13px', color: checked ? '#111' : '#374151', fontWeight: checked ? 500 : 400 }}>
        {label}
      </span>
    </label>
  );
}

// Checkbox Option
function CustomCheckbox({ checked, label, color, onChange }: { checked: boolean; label: string; color?: string; onChange: () => void }) {
  return (
    <label onClick={onChange} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 4px' }}>
      <div style={{
        width: '18px', height: '18px', borderRadius: '4px', border: `1.5px solid ${checked ? '#111' : '#d1d5db'}`,
        backgroundColor: checked ? '#111' : '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {checked && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {color && <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color }} />}
        <span style={{ fontSize: '13px', color: checked ? '#111' : '#374151', fontWeight: checked ? 500 : 400 }}>
          {label}
        </span>
      </div>
    </label>
  );
}

// Range Inputs inside Popover
function RangeInputs({ fromVal, toVal, onFromChange, onToChange }: { fromVal: string; toVal: string; onFromChange: (v: string) => void; onToChange: (v: string) => void }) {
  const inputStyle: React.CSSProperties = {
    width: '100px', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e5e7eb',
    fontSize: '13px', color: '#111', outline: 'none', fontFamily: 'inherit'
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <input
        type="number" value={fromVal} onChange={e => onFromChange(e.target.value)}
        placeholder="от" style={inputStyle}
        onFocus={e => e.currentTarget.style.borderColor = '#111'}
        onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
      />
      <span style={{ color: '#9ca3af' }}>—</span>
      <input
        type="number" value={toVal} onChange={e => onToChange(e.target.value)}
        placeholder="до" style={inputStyle}
        onFocus={e => e.currentTarget.style.borderColor = '#111'}
        onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
      />
      {(fromVal || toVal) && (
        <button
          onClick={() => { onFromChange(''); onToChange(''); }}
          style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f3f4f6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X style={{ width: '14px', height: '14px', color: '#6b7280' }} />
        </button>
      )}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────

export function FilterBar({
  activeTab,
  ratingFilters, onRatingFiltersChange,
  ratingPreset, onRatingPresetChange,
  financeFilters, onFinanceFiltersChange,
  financeMode, onFinanceModeChange,
  financeYear, onFinanceYearChange,
}: FilterBarProps) {

  const setR = (patch: Partial<RatingFilters>) => onRatingFiltersChange({ ...ratingFilters, ...patch });
  const setF = (patch: Partial<FinanceFilters>) => onFinanceFiltersChange({ ...financeFilters, ...patch });

  const presets = [
    { id: 'overview', label: 'Обзор' },
    { id: 'pl', label: 'P&L' },
    { id: 'balance', label: 'Баланс' },
    { id: 'capital', label: 'Привлечение капитала' },
  ] as const;

  return (
    <div style={{
      background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '12px 32px',
      display: 'flex', flexDirection: 'column', gap: '12px'
    }}>
      
      {/* ── РЕЙТИНГ ────────────────────────────────────────────── */}
      {activeTab === 'rating' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', minHeight: '36px' }}>
            <PopoverFilter label="Фильтры" isActive={false}>
            <div style={{ padding: '4px', display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '200px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Быстрые фильтры</div>
                <CustomCheckbox checked={ratingFilters.profitFrom === '0'} label="Прибыльные (> 0)" onChange={() => setR({ profitFrom: ratingFilters.profitFrom === '0' ? '' : '0' })} />
                <CustomCheckbox checked={ratingFilters.debtLoadTo === '1'} label="D/E ≤ 1" onChange={() => setR({ debtLoadTo: ratingFilters.debtLoadTo === '1' ? '' : '1' })} />
              </div>
              <Divider />
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Сортировка</div>
                <CustomRadio checked={ratingFilters.sortDir === 'desc'} label="По убыванию" onChange={() => setR({ sortDir: 'desc' })} />
                <CustomRadio checked={ratingFilters.sortDir === 'asc'} label="По возрастанию" onChange={() => setR({ sortDir: 'asc' })} />
              </div>
            </div>
          </PopoverFilter>

          {ratingFilters.profitFrom === '0' && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '6px 12px', background: '#f4f4f5', borderRadius: '100px',
              fontSize: '13px', fontWeight: 500, color: '#111'
            }}>
              Прибыльные
              <button onClick={() => setR({ profitFrom: '' })} style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <X style={{ width: '14px', height: '14px', color: '#6b7280' }} />
              </button>
            </div>
          )}

          {ratingFilters.debtLoadTo === '1' && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '6px 12px', background: '#f4f4f5', borderRadius: '100px',
              fontSize: '13px', fontWeight: 500, color: '#111'
            }}>
              D/E ≤ 1
              <button onClick={() => setR({ debtLoadTo: '' })} style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <X style={{ width: '14px', height: '14px', color: '#6b7280' }} />
              </button>
            </div>
          )}

          {ratingFilters.sortDir !== 'desc' && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '6px 12px', background: '#f4f4f5', borderRadius: '100px',
              fontSize: '13px', fontWeight: 500, color: '#111'
            }}>
              Сорт: По возрастанию
              <button onClick={() => setR({ sortDir: 'desc' })} style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <X style={{ width: '14px', height: '14px', color: '#6b7280' }} />
              </button>
            </div>
          )}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px', overflowX: 'auto', paddingBottom: '4px' }}>
            {presets.map(p => (
              <button
                key={p.id}
                onClick={() => onRatingPresetChange(p.id)}
                style={{
                  padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: p.id === ratingPreset ? 500 : 400,
                  background: p.id === ratingPreset ? '#111' : '#f9fafb',
                  color: p.id === ratingPreset ? '#fff' : '#6b7280',
                  border: '1px solid', borderColor: p.id === ratingPreset ? '#111' : '#f0f0f0',
                  cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── ФИНАНСЫ ────────────────────────────────────────────── */}
      {activeTab === 'finance' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <PopoverFilter label="Показать" isActive={false}>
            <CustomRadio checked={financeMode === 'capital'} label="Структура капитала" onChange={() => onFinanceModeChange('capital')} />
            <CustomRadio checked={financeMode === 'pl'} label="Доходы и расходы" onChange={() => onFinanceModeChange('pl')} />
            <CustomRadio checked={financeMode === 'assets'} label="Активы и долги" onChange={() => onFinanceModeChange('assets')} />
          </PopoverFilter>

          <PopoverFilter label={`Год`} isActive={false}>
            {[2024, 2023, 2022, 2021, 2020].map(y => (
              <CustomRadio key={y} checked={financeYear === y} label={String(y)} onChange={() => onFinanceYearChange(y as FinanceYear)} />
            ))}
          </PopoverFilter>

          <PopoverFilter label="Выручка + пр. доходы" isActive={!!financeFilters.revenueFrom || !!financeFilters.revenueTo}>
            <RangeInputs fromVal={financeFilters.revenueFrom} toVal={financeFilters.revenueTo} onFromChange={v => setF({ revenueFrom: v })} onToChange={v => setF({ revenueTo: v })} />
          </PopoverFilter>

          <PopoverFilter label="Чистая прибыль" isActive={!!financeFilters.profitFrom || !!financeFilters.profitTo}>
            <RangeInputs fromVal={financeFilters.profitFrom} toVal={financeFilters.profitTo} onFromChange={v => setF({ profitFrom: v })} onToChange={v => setF({ profitTo: v })} />
          </PopoverFilter>

          <PopoverFilter label="EBITDA" isActive={!!financeFilters.ebitdaFrom || !!financeFilters.ebitdaTo}>
            <RangeInputs fromVal={financeFilters.ebitdaFrom} toVal={financeFilters.ebitdaTo} onFromChange={v => setF({ ebitdaFrom: v })} onToChange={v => setF({ ebitdaTo: v })} />
          </PopoverFilter>

          <PopoverFilter label="Долговая нагрузка" isActive={!!financeFilters.debtLoadFrom || !!financeFilters.debtLoadTo}>
            <RangeInputs fromVal={financeFilters.debtLoadFrom} toVal={financeFilters.debtLoadTo} onFromChange={v => setF({ debtLoadFrom: v })} onToChange={v => setF({ debtLoadTo: v })} />
          </PopoverFilter>

          <PopoverFilter label="Сортировка" isActive={financeFilters.sortDir !== 'desc'}>
            <CustomRadio checked={financeFilters.sortDir === 'desc'} label="По убыванию" onChange={() => setF({ sortDir: 'desc' })} />
            <CustomRadio checked={financeFilters.sortDir === 'asc'} label="По возрастанию" onChange={() => setF({ sortDir: 'asc' })} />
          </PopoverFilter>

          {(financeFilters.sortDir !== 'desc' || financeFilters.revenueFrom || financeFilters.revenueTo || financeFilters.profitFrom || financeFilters.profitTo || financeFilters.ebitdaFrom || financeFilters.ebitdaTo || financeFilters.debtLoadFrom || financeFilters.debtLoadTo) ? (
            <>
              <Divider />
              <button
                onClick={() => setF({ sortDir: 'desc', revenueFrom: '', revenueTo: '', profitFrom: '', profitTo: '', ebitdaFrom: '', ebitdaTo: '', debtLoadFrom: '', debtLoadTo: '' })}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#6b7280',
                  background: 'none', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', whiteSpace: 'nowrap'
                }}
              >
                <X style={{ width: '14px', height: '14px' }} /> Сбросить
              </button>
            </>
          ) : null}
        </div>
      )}

      {/* ── ИНВЕСТИЦИИ ──────────��───────────────────────────────── */}
      {activeTab === 'investment' && (
        <span style={{ fontSize: '13px', color: '#9ca3af' }}>
          Выберите тип инструмента в таблице ниже
        </span>
      )}
    </div>
  );
}
