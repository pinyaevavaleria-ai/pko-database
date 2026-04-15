import { useMemo, useState } from 'react';
import { HeroScreen } from './components/HeroScreen';
import {
  PresetTabs,
  SearchFilterBar,
  Preset,
  RatingFilters,
} from './components/FilterBar';
import { RatingTable, ExtraColumn } from './components/RatingTable';
import { InvestmentTable } from './components/InvestmentTable';
import { Sidebar } from './components/Sidebar';
import { CompanyCard } from './components/CompanyCard';
import { ratingData, RatingCompany } from './data/ratingData';
import { companyDetailsMap } from './data/companyDetails';
import { Footer } from './components/Footer';
import { CompareModal } from './components/CompareModal';
import { CompareFloatingBar } from './components/CompareFloatingBar';
import { useIsMobile } from './components/ui/use-mobile';

export default function App() {
  const isMobile = useIsMobile();
  const [preset, setPreset] = useState<Preset>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyInn, setSelectedCompanyInn] = useState<string | null>(null);
  const handleCompanyClick = (inn: string) => {
    setSelectedCompanyInn(inn);
    window.scrollTo(0, 0);
  };

  // ── Compare mode ─────────────────────────────────────────────
  const [compareMode, setCompareMode] = useState(false);
  const [selectedInns, setSelectedInns] = useState<Set<string>>(new Set());
  const [showCompareModal, setShowCompareModal] = useState(false);

  // ── Rating filters ────────────────────────────────────────────
  const [ratingFilters, setRatingFilters] = useState<RatingFilters>({
    sortDir: 'desc',
    napka: 'ignore',
    experienceFrom: '', experienceTo: '',
    capitalPublic: true, capitalCorporate: true, capitalNone: true,
    revenueFrom: '', revenueTo: '',
    profitFrom: '', profitTo: '',
    deFrom: '', deTo: '',
    growthRateFrom: '', growthRateTo: '',
    cagrFrom: '', cagrTo: '',
  });

  // ── Rating: real data, filter + sort ──────────────────────────
  const ratingCompanies: RatingCompany[] = (() => {
    const f = ratingFilters;

    const filtered = ratingData.filter(c => {
      // ── Search ──
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.inn.includes(q)) return false;
      }
      // ── Сквозные фильтры ──
      if (f.napka === 'yes' && c.napka !== true)  return false;
      if (f.napka === 'no'  && c.napka !== false) return false;
      if (f.experienceFrom !== '' && c.experience < Number(f.experienceFrom)) return false;
      if (f.experienceTo   !== '' && c.experience > Number(f.experienceTo))   return false;
      const allChecked = f.capitalPublic && f.capitalCorporate && f.capitalNone;
      if (!allChecked) {
        if (c.capitalAttraction === 'public'    && !f.capitalPublic)    return false;
        if (c.capitalAttraction === 'corporate' && !f.capitalCorporate) return false;
        if (c.capitalAttraction === 'none'      && !f.capitalNone)      return false;
      }
      // ── Метрики ──
      if (f.revenueFrom !== '' && c.revenue < Number(f.revenueFrom)) return false;
      if (f.revenueTo   !== '' && c.revenue > Number(f.revenueTo))   return false;
      if (f.profitFrom !== '' && c.profit < Number(f.profitFrom)) return false;
      if (f.profitTo   !== '' && c.profit > Number(f.profitTo))   return false;
      // D/E
      if (f.deFrom !== '' && c.de < Number(f.deFrom)) return false;
      if (f.deTo   !== '' && c.de > Number(f.deTo))   return false;
      // Рост фин. активов
      if (f.growthRateFrom !== '' && c.growthRate < Number(f.growthRateFrom)) return false;
      if (f.growthRateTo   !== '' && c.growthRate > Number(f.growthRateTo))   return false;
      // CAGR (в данных хранится как доля, напр. 0.33 = 33%, а пользователь вводит %)
      if (f.cagrFrom !== '' && c.cagr * 100 < Number(f.cagrFrom)) return false;
      if (f.cagrTo   !== '' && c.cagr * 100 > Number(f.cagrTo))   return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (f.sortDir === 'desc') return a.rank - b.rank;
      return b.rank - a.rank;
    });
  })();

  // ── Dynamic extra columns (based on active filters) ──────────
  const extraColumns = useMemo<ExtraColumn[]>(() => {
    const cols: ExtraColumn[] = [];
    const f = ratingFilters;
    const fmt = (n: number) => Math.abs(n).toLocaleString('ru-RU');

    if (f.deFrom !== '' || f.deTo !== '') {
      cols.push({
        key: 'de',
        header: 'D/E',
        format: c => c.de.toFixed(2),
      });
    }
    if (f.growthRateFrom !== '' || f.growthRateTo !== '') {
      cols.push({
        key: 'growthRate',
        header: 'Рост фин. акт., %',
        format: c => `${Number(c.growthRate.toFixed(1)).toLocaleString('ru-RU')}%`,
      });
    }
    if (f.cagrFrom !== '' || f.cagrTo !== '') {
      cols.push({
        key: 'cagr',
        header: 'CAGR 5 лет, %',
        format: c => `${Number((c.cagr * 100).toFixed(1)).toLocaleString('ru-RU')}%`,
      });
    }
    return cols;
  }, [ratingFilters]);

  // ── Company Card (отдельная страница) ────────────────────────
  if (selectedCompanyInn) {
    const comp = ratingData.find(c => c.inn === selectedCompanyInn);
    const det = companyDetailsMap[selectedCompanyInn];
    if (comp && det) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0a0f15',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: '#fff',
          overflowY: 'auto',
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '0 12px' : '0 32px' }}>
            <CompanyCard company={comp} details={det} onBack={() => setSelectedCompanyInn(null)} />
          </div>
          <Footer />
        </div>
      );
    }
  }

  // ── Main view (рейтинг) ─────────────────────────────────────
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      background: '#0a0f15',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#fff',
    }}>
      <HeroScreen />

      {/* Sticky табы — прилипают к верху при скролле */}
      <div style={{
        position: 'sticky',
        top: 0,
        background: '#0a0f15',
        zIndex: 20,
        padding: isMobile ? '12px 12px 8px' : '16px 32px 12px',
      }}>
        <PresetTabs preset={preset} onPresetChange={setPreset} />
      </div>

      {/* Основной контент — страница скроллится нативно */}
      <main style={{ padding: isMobile ? '0 8px 16px' : '0 32px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: preset === 'overview' && !isMobile ? '1fr 230px' : '1fr',
          gap: isMobile ? '16px' : '24px',
          alignItems: 'start',
        }}>
          {/* Left — Карточка: поиск + фильтры + таблица */}
          <div style={{
            minWidth: 0,
            background: '#111920',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            {/* Поиск + фильтры */}
            <SearchFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              ratingFilters={ratingFilters}
              onRatingFiltersChange={setRatingFilters}
              preset={preset}
              compareMode={compareMode}
              onCompareModeToggle={() => {
                if (compareMode) {
                  setCompareMode(false);
                  setSelectedInns(new Set());
                } else {
                  setCompareMode(true);
                }
              }}
              selectedCount={selectedInns.size}
            />

            {/* Таблица — часть нативного скролла страницы */}
            {preset === 'overview' ? (
              ratingCompanies.length === 0 ? (
                <div
                  style={{
                    padding: '64px 0',
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '14px',
                  }}
                >
                  По вашему запросу ничего не найдено
                </div>
              ) : (
                <RatingTable
                  companies={ratingCompanies}
                  onCompanyClick={handleCompanyClick}
                  compareMode={compareMode}
                  selectedInns={selectedInns}
                  onToggleSelect={(inn) => {
                    setSelectedInns(prev => {
                      const next = new Set(prev);
                      if (next.has(inn)) next.delete(inn);
                      else if (next.size < 5) next.add(inn);
                      return next;
                    });
                  }}
                  maxSelected={5}
                  extraColumns={extraColumns}
                />
              )
            ) : (
              <InvestmentTable onCompanyClick={handleCompanyClick} />
            )}

            {preset === 'overview' && (
              <p style={{ padding: '16px 32px 20px', margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
                Данные на основе отчётности ФНС. Только для информационных целей.
              </p>
            )}
          </div>

          {/* Right — Sidebar (sticky on desktop, below table on mobile) */}
          {preset === 'overview' && !isMobile && (
            <aside style={{ position: 'sticky', top: '70px', alignSelf: 'start' }}>
              <Sidebar />
            </aside>
          )}
        </div>

        {/* Sidebar under table on mobile */}
        {preset === 'overview' && isMobile && (
          <div style={{ marginTop: '8px' }}>
            <Sidebar />
          </div>
        )}
      </main>
      <Footer />

      {/* Compare floating bar */}
      {compareMode && selectedInns.size > 0 && (
        <CompareFloatingBar
          selectedCompanies={ratingData.filter(c => selectedInns.has(c.inn))}
          onRemove={(inn) => {
            setSelectedInns(prev => {
              const next = new Set(prev);
              next.delete(inn);
              return next;
            });
          }}
          onCompare={() => setShowCompareModal(true)}
          onCancel={() => {
            setCompareMode(false);
            setSelectedInns(new Set());
          }}
        />
      )}

      {/* Compare modal */}
      {showCompareModal && (
        <CompareModal
          companies={ratingData.filter(c => selectedInns.has(c.inn))}
          onClose={() => setShowCompareModal(false)}
        />
      )}
    </div>
  );
}
