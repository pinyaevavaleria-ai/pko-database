import { useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { HeroScreen } from './components/HeroScreen';
import { TabBar, TabId } from './components/TabBar';
import {
  FilterBar,
  RatingFilters,
  FinanceFilters,
  InvestmentFilters,
} from './components/FilterBar';
import { RatingTable } from './components/RatingTable';
import { FinanceTable, FinanceMode, FinanceYear } from './components/FinanceTable';
import { InvestmentTable } from './components/InvestmentTable';
import { mockCompanies, Company } from './data/mockData';
import { ratingData, RatingCompany } from './data/ratingData';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('rating');
  const [searchQuery, setSearchQuery] = useState('');

  // ── Rating filters ────────────────────────────────────────────
  const [ratingFilters, setRatingFilters] = useState<RatingFilters>({
    sortDir: 'desc',
    revenueFrom: '', revenueTo: '',
    profitFrom: '', profitTo: '',
    debtLoadTo: '',
    capitalPublic: true, capitalCorporate: true, capitalNone: true,
    napka: 'ignore',
    experienceFrom: '', experienceTo: '',
  });

  const [ratingPreset, setRatingPreset] = useState<'overview'|'pl'|'balance'|'capital'>('overview');

  // ── Finance ───���───────────────────────────────────────────────
  const [financeFilters, setFinanceFilters] = useState<FinanceFilters>({
    sortDir: 'desc',
    revenueFrom: '', revenueTo: '',
    profitFrom: '', profitTo: '',
    ebitdaFrom: '', ebitdaTo: '',
    debtLoadFrom: '', debtLoadTo: '',
  });
  const [financeMode, setFinanceMode] = useState<FinanceMode>('pl');
  const [financeYear, setFinanceYear] = useState<FinanceYear>(2024);

  // ── Investment ────────────────────────────────────────────────
  const [investmentFilters, setInvestmentFilters] = useState<InvestmentFilters>({
    status: 'all',
    reliability: 'all',
    maxRate: 99,
  });

  // ── Search (mock for finance/invest, real for rating) ──────────
  const searched = mockCompanies.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.inn.includes(q);
  });

  // ── Rating: real data, filter + sort ──────────────────────────
  const ratingCompanies: RatingCompany[] = (() => {
    const f = ratingFilters;

    const filtered = ratingData.filter(c => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.inn.includes(q)) return false;
      }

      // Revenue range
      if (f.revenueFrom !== '' && c.revenue < Number(f.revenueFrom)) return false;
      if (f.revenueTo   !== '' && c.revenue > Number(f.revenueTo))   return false;

      // Profit range
      if (f.profitFrom !== '' && c.profit < Number(f.profitFrom)) return false;
      if (f.profitTo   !== '' && c.profit > Number(f.profitTo))   return false;

      // НАПКА
      if (f.napka === 'yes' && c.napka !== true)  return false;
      if (f.napka === 'no'  && c.napka !== false) return false;

      // Experience range
      if (f.experienceFrom !== '' && c.experience < Number(f.experienceFrom)) return false;
      if (f.experienceTo   !== '' && c.experience > Number(f.experienceTo))   return false;

      // Capital checkboxes
      const allChecked = f.capitalPublic && f.capitalCorporate && f.capitalNone;
      if (!allChecked) {
        if (c.capitalAttraction === 'public'    && !f.capitalPublic)    return false;
        if (c.capitalAttraction === 'corporate' && !f.capitalCorporate) return false;
        if (c.capitalAttraction === 'none'      && !f.capitalNone)      return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (f.sortDir === 'desc') return a.rank - b.rank;
      return b.rank - a.rank;
    });
  })();

  // ── Finance: filter ───────────────────────────────���────────────
  const financeCompanies = (() => {
    const f = financeFilters;
    let filtered = searched.filter(c => {
      const pl = c.pl[financeYear];
      const a = c.assets[financeYear];
      
      if (financeMode === 'pl' && !pl) return false;
      if ((financeMode === 'assets' || financeMode === 'capital') && !a) return false;

      // Выручка + пр. доходы
      const rev = pl ? pl.revenue + pl.otherIncome : null;
      if (rev !== null) {
        if (f.revenueFrom !== '' && rev < Number(f.revenueFrom)) return false;
        if (f.revenueTo !== '' && rev > Number(f.revenueTo)) return false;
      }

      // Чистая прибыль
      const prof = pl ? pl.netProfit : null;
      if (prof !== null) {
        if (f.profitFrom !== '' && prof < Number(f.profitFrom)) return false;
        if (f.profitTo !== '' && prof > Number(f.profitTo)) return false;
      }

      // EBITDA
      const ebitda = c.ebitda; // use general EBITDA or try to calc from pl? The mockData has `ebitda` on Company
      if (ebitda !== null && ebitda !== undefined) {
        if (f.ebitdaFrom !== '' && ebitda < Number(f.ebitdaFrom)) return false;
        if (f.ebitdaTo !== '' && ebitda > Number(f.ebitdaTo)) return false;
      }

      // Долговая нагрузка
      const debt = a ? (a.equity > 0 ? a.totalDebt / a.equity : null) : null;
      if (debt !== null) {
        if (f.debtLoadFrom !== '' && debt < Number(f.debtLoadFrom)) return false;
        if (f.debtLoadTo !== '' && debt > Number(f.debtLoadTo)) return false;
      }

      return true;
    });
    
    return [...filtered].sort((a, b) => {
      if (financeFilters.sortDir === 'desc') return a.rank - b.rank;
      return b.rank - a.rank;
    });
  })();

  // ── Investment: filter ─────────────────────────────────────────
  const investmentCompanies = searched.filter(c => {
    if (investmentFilters.status      !== 'all' && c.investStatus   !== investmentFilters.status)      return false;
    if (investmentFilters.reliability !== 'all' && c.reliability    !== investmentFilters.reliability) return false;
    if (c.investRate && c.investRate > investmentFilters.maxRate) return false;
    return true;
  });

  const tableCompanies: Company[] =
    activeTab === 'finance'    ? financeCompanies :
    investmentCompanies;

  return (
    <>
      <HeroScreen />
      <div
        style={{
          minHeight: '100vh',
          background: '#ffffff',
          borderTop: '1px solid #e5e7eb',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <AppHeader />
      <FilterBar
        activeTab={activeTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        ratingFilters={ratingFilters}
        onRatingFiltersChange={setRatingFilters}
        ratingPreset={ratingPreset}
        onRatingPresetChange={setRatingPreset}
        financeFilters={financeFilters}
        onFinanceFiltersChange={setFinanceFilters}
        financeMode={financeMode}
        onFinanceModeChange={setFinanceMode}
        financeYear={financeYear}
        onFinanceYearChange={setFinanceYear}
        investmentFilters={investmentFilters}
        onInvestmentFiltersChange={setInvestmentFilters}
      />

      <main style={{ padding: '20px 32px 40px' }}>
        {activeTab === 'rating' ? (
          ratingPreset === 'capital' ? (
            <InvestmentTable />
          ) : ratingCompanies.length === 0 ? (
            <div
              style={{
                background: '#fff',
                borderRadius: '12px',
                border: '1px solid #f0f0f0',
                padding: '64px 0',
                textAlign: 'center',
                color: '#9ca3af',
                fontSize: '14px',
              }}
            >
              По вашему запросу ничего не найдено
            </div>
          ) : (
            <RatingTable companies={ratingCompanies} />
          )
        ) : activeTab === 'finance' ? (
          <FinanceTable companies={tableCompanies} mode={financeMode} year={financeYear} />
        ) : (
          <InvestmentTable />
        )}

        <p style={{ marginTop: '16px', fontSize: '11px', color: '#d1d5db', textAlign: 'center' }}>
          Данные на основе публичной бухгалтерской отчётности (РСБУ). Только для информационных целей.
        </p>
      </main>
    </div>
    </>
  );
}
