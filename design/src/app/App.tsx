import { useState } from 'react';
import { HeroScreen } from './components/HeroScreen';
import {
  PresetTabs,
  SearchFilterBar,
  Preset,
  RatingFilters,
} from './components/FilterBar';
import { RatingTable } from './components/RatingTable';
import { InvestmentTable } from './components/InvestmentTable';
import { Sidebar } from './components/Sidebar';
import { ratingData, RatingCompany } from './data/ratingData';

export default function App() {
  const [preset, setPreset] = useState<Preset>('overview');
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#0a0f15',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#fff',
    }}>
      <HeroScreen />

      {/* Sticky секция: табы + контент — прилипает к верху при скролле */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#0a0f15',
        zIndex: 20,
      }}>
        {/* Табы */}
        <div style={{
          padding: '16px 32px 12px',
          flexShrink: 0,
        }}>
          <PresetTabs preset={preset} onPresetChange={setPreset} />
        </div>

        {/* Основной контент */}
        <main style={{ padding: '0 32px 20px', flex: 1, minHeight: 0, display: 'flex' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: preset === 'overview' ? '1fr 230px' : '1fr',
            gap: '24px',
            flex: 1,
            minHeight: 0,
          }}>
            {/* Left — Карточка: поиск + фильтры + таблица */}
            <div style={{
              minWidth: 0,
              minHeight: 0,
              background: '#111920',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}>
              {/* Поиск + фильтры — фиксированы */}
              <div style={{ flexShrink: 0 }}>
                <SearchFilterBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  ratingFilters={ratingFilters}
                  onRatingFiltersChange={setRatingFilters}
                  preset={preset}
                />
              </div>

              {/* Таблица — скроллится */}
              <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
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
                    <RatingTable companies={ratingCompanies} />
                  )
                ) : (
                  <InvestmentTable />
                )}

                <p style={{ padding: '16px 20px 20px', margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
                  Данные на основе публичной бухгалтерской отчётности (РСБУ). Только для информационных целей.
                </p>
              </div>
            </div>

            {/* Right — Sidebar (only on overview) */}
            {preset === 'overview' && (
              <aside style={{ overflowY: 'auto', minHeight: 0 }}>
                <Sidebar />
              </aside>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
