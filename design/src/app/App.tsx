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

  // ── Search ─────────────────────────────────────────────────────
  const searched = mockCompanies.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.inn.includes(q);
  });

  // ── Rating: filter + sort ──────────────────────────────────────
  const ratingCompanies: Company[] = (() => {
    const f = ratingFilters;

    const filtered = searched.filter(c => {
      // Revenue range
      const revFrom = f.revenueFrom !== '' ? Number(f.revenueFrom) : null;
      const revTo   = f.revenueTo   !== '' ? Number(f.revenueTo)   : null;
      if (revFrom !== null && c.revenue < revFrom) return false;
      if (revTo   !== null && c.revenue > revTo)   return false;

      // Profit range
      const profFrom = f.profitFrom !== '' ? Number(f.profitFrom) : null;
      const profTo   = f.profitTo   !== '' ? Number(f.profitTo)   : null;
      if (profFrom !== null && c.profit < profFrom) return false;
      if (profTo   !== null && c.profit > profTo)   return false;

      // Debt Load
      if (f.debtLoadTo !== '') {
        const a = c.assets[2024];
        if (a && a.equity > 0) {
          const debtLoad = a.totalDebt / a.equity;
          if (debtLoad > Number(f.debtLoadTo)) return false;
        }
      }

      // Capital checkboxes
      const allChecked = f.capitalPublic && f.capitalCorporate && f.capitalNone;
      if (!allChecked) {
        if (c.capitalAttraction === 'public'    && !f.capitalPublic)    return false;
        if (c.capitalAttraction === 'corporate' && !f.capitalCorporate) return false;
        if (c.capitalAttraction === 'none'      && !f.capitalNone)      return false;
      }

      // НАПКА
      if (f.napka === 'yes' && c.napka !== true)  return false;
      if (f.napka === 'no'  && c.napka !== false) return false;

      // Experience range (years)
      const expFrom = f.experienceFrom !== '' ? Number(f.experienceFrom) : null;
      const expTo   = f.experienceTo   !== '' ? Number(f.experienceTo)   : null;
      if (expFrom !== null && c.experience < expFrom) return false;
      if (expTo   !== null && c.experience > expTo)   return false;

      return true;
    });

    // Default sorting by Rank (1 is top), if desc, we show Rank 1 first. If asc, we show Rank 20 first? 
    // Usually desc means best first (high revenue). Asc means worst first. Rank is inverted.
    return [...filtered].sort((a, b) => {
      if (f.sortDir === 'desc') return a.rank - b.rank; // 1, 2, 3 (Best first)
      return b.rank - a.rank; // 20, 19, 18
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
    activeTab === 'rating'     ? ratingCompanies :
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
        <AppHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <FilterBar
        activeTab={activeTab}
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
        {tableCompanies.length === 0 ? (
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
        ) : activeTab === 'rating' ? (
          <RatingTable companies={tableCompanies} />
        ) : activeTab === 'finance' ? (
          <FinanceTable companies={tableCompanies} mode={financeMode} year={financeYear} />
        ) : (
          <InvestmentTable companies={tableCompanies} />
        )}

        <p style={{ marginTop: '16px', fontSize: '11px', color: '#d1d5db', textAlign: 'center' }}>
          Данные на основе публичной бухгалтерской отчётности (РСБУ). Только для информационных целей.
        </p>
      </main>
    </div>
    </>
  );
}
