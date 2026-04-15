export interface Company {
  rank: number;
  name: string;
  fullName: string;
  inn: string;
  revenue: number;
  revenue2023: number;
  profit: number;
  ebitda: number;
  equity: number;
  debt: number;
  cagr: number;
  experience: number;
  yearChange: number;
  capitalAttraction: 'public' | 'corporate' | 'none';
  napka: boolean | null; // true = член НАПКА, false = не член, null = нет данных
  investRate?: number;
  investMinSum?: number;
  investTerm?: string;
  reliability: 'A' | 'B' | 'C' | 'D';
  investStatus: 'open' | 'closed' | 'paused';
  region: string;
  founded: number;
  pl: Record<number, PLRow>;
  assets: Record<number, AssetsRow>;
}

export interface PLRow {
  revenue: number;           // Выручка
  otherIncome: number;       // Прочие доходы
  cogs: number;              // Себестоимость
  grossProfit: number;       // Валовая прибыль
  commercialExpenses: number;// Коммерч. расходы
  adminExpenses: number;     // Управленч. расходы
  operatingProfit: number;   // Прибыль от продаж
  interestExpense: number;   // Проценты по долгам
  pretaxProfit: number;      // Прибыль до налога
  netProfit: number;         // Чистая прибыль
}

export interface AssetsRow {
  totalAssets: number;       // Всего активов
  currentAssets: number;     // Оборотные активы
  fixedAssets: number;       // Внеоборотные активы
  equity: number;            // Капитал
  longTermDebt: number;      // Долгосрочные обязательства
  shortTermDebt: number;     // Краткосрочные обязательства
  totalDebt: number;         // Всего обязательств
}

// Helper: generate stub historical rows scaled from 2024
function stubPL(base: PLRow, ratios: number[]): Record<number, PLRow> {
  const years = [2020, 2021, 2022, 2023, 2024];
  const result: Record<number, PLRow> = {};
  years.forEach((y, i) => {
    const r = ratios[i];
    result[y] = {
      revenue: Math.round(base.revenue * r),
      otherIncome: Math.round(base.otherIncome * r),
      cogs: Math.round(base.cogs * r),
      grossProfit: Math.round(base.grossProfit * r),
      commercialExpenses: Math.round(base.commercialExpenses * r),
      adminExpenses: Math.round(base.adminExpenses * r),
      operatingProfit: Math.round(base.operatingProfit * r),
      interestExpense: Math.round(base.interestExpense * r),
      pretaxProfit: Math.round(base.pretaxProfit * r),
      netProfit: Math.round(base.netProfit * r),
    };
  });
  return result;
}

function stubAssets(base: AssetsRow, ratios: number[]): Record<number, AssetsRow> {
  const years = [2020, 2021, 2022, 2023, 2024];
  const result: Record<number, AssetsRow> = {};
  years.forEach((y, i) => {
    const r = ratios[i];
    result[y] = {
      totalAssets: Math.round(base.totalAssets * r),
      currentAssets: Math.round(base.currentAssets * r),
      fixedAssets: Math.round(base.fixedAssets * r),
      equity: Math.round(base.equity * r),
      longTermDebt: Math.round(base.longTermDebt * r),
      shortTermDebt: Math.round(base.shortTermDebt * r),
      totalDebt: Math.round(base.totalDebt * r),
    };
  });
  return result;
}

export const mockCompanies: Company[] = [
  {
    rank: 1, name: 'ПКБ', fullName: 'Первое коллекторское бюро', inn: '7709723456',
    revenue: 17486370, revenue2023: 12763774, profit: 7017168, ebitda: 9823000,
    equity: 14200000, debt: 3100000, cagr: 16.4, experience: 16, yearChange: 37,
    capitalAttraction: 'public', napka: true,
    investRate: 17.5, investMinSum: 50, investTerm: '12–36 мес.',
    reliability: 'A', investStatus: 'open', region: 'Москва', founded: 2008,
    pl: stubPL({
      revenue: 15819586, otherIncome: 1666784, cogs: 3542236, grossProfit: 12277350,
      commercialExpenses: 0, adminExpenses: 1404829, operatingProfit: 10872521,
      interestExpense: 1464996, pretaxProfit: 8735827, netProfit: 7017168,
    }, [0.42, 0.58, 0.73, 0.73, 1]),
    assets: stubAssets({
      totalAssets: 32100000, currentAssets: 24800000, fixedAssets: 7300000,
      equity: 14200000, longTermDebt: 2100000, shortTermDebt: 1000000, totalDebt: 15900000,
    }, [0.40, 0.55, 0.70, 0.78, 1]),
  },
  {
    rank: 2, name: 'Феникс', fullName: 'Феникс', inn: '7702345678',
    revenue: 12835953, revenue2023: 12294015, profit: 8229971, ebitda: 9500000,
    equity: 11300000, debt: 2200000, cagr: 13.5, experience: 10, yearChange: 4.4,
    capitalAttraction: 'corporate', napka: true,
    reliability: 'A', investStatus: 'closed',
    region: 'Москва', founded: 2014,
    pl: stubPL({
      revenue: 12825050, otherIncome: 10903, cogs: 664083, grossProfit: 12160967,
      commercialExpenses: 0, adminExpenses: 590122, operatingProfit: 11570845,
      interestExpense: 204056, pretaxProfit: 10318525, netProfit: 8229971,
    }, [0.55, 0.65, 0.78, 0.96, 1]),
    assets: stubAssets({
      totalAssets: 24500000, currentAssets: 18200000, fixedAssets: 6300000,
      equity: 11300000, longTermDebt: 1500000, shortTermDebt: 700000, totalDebt: 13200000,
    }, [0.50, 0.62, 0.75, 0.92, 1]),
  },
  {
    rank: 3, name: 'АйДи Коллект', fullName: 'АйДи Коллект', inn: '9701234567',
    revenue: 12362455, revenue2023: 8330000, profit: 3863869, ebitda: 5100000,
    equity: 6800000, debt: 4500000, cagr: 105.4, experience: 8, yearChange: 48.4,
    capitalAttraction: 'public', napka: true,
    investRate: 21.0, investMinSum: 10, investTerm: '3–24 мес.',
    reliability: 'B', investStatus: 'open', region: 'Москва', founded: 2016,
    pl: stubPL({
      revenue: 12228725, otherIncome: 133730, cogs: 3248825, grossProfit: 8979900,
      commercialExpenses: 4091, adminExpenses: 763987, operatingProfit: 8211822,
      interestExpense: 2649292, preaxProfit: 4983053, netProfit: 3863869,
    } as PLRow, [0.08, 0.18, 0.38, 0.67, 1]),
    assets: stubAssets({
      totalAssets: 18700000, currentAssets: 13400000, fixedAssets: 5300000,
      equity: 6800000, longTermDebt: 3200000, shortTermDebt: 1300000, totalDebt: 11900000,
    }, [0.10, 0.22, 0.44, 0.68, 1]),
  },
  {
    rank: 4, name: 'ЭОС', fullName: 'Европейская объединённая система', inn: '7728901234',
    revenue: 9784245, revenue2023: 11045000, profit: 4762878, ebitda: 6200000,
    equity: 8900000, debt: 1800000, cagr: 11.4, experience: 17, yearChange: -11.4,
    capitalAttraction: 'corporate', napka: true,
    reliability: 'A', investStatus: 'closed',
    region: 'Москва', founded: 2007,
    pl: stubPL({
      revenue: 9575128, otherIncome: 209117, cogs: 2892127, grossProfit: 6683001,
      commercialExpenses: 0, adminExpenses: 1416770, operatingProfit: 5266231,
      interestExpense: 341934, preaxProfit: 5847058, netProfit: 4762878,
    } as PLRow, [0.68, 0.75, 0.88, 1.13, 1]),
    assets: stubAssets({
      totalAssets: 19800000, currentAssets: 14600000, fixedAssets: 5200000,
      equity: 8900000, longTermDebt: 1200000, shortTermDebt: 600000, totalDebt: 10900000,
    }, [0.65, 0.72, 0.84, 1.10, 1]),
  },
  {
    rank: 5, name: 'НФИ', fullName: 'Национальная финансовая инициатива', inn: '7743456789',
    revenue: 8753853, revenue2023: 8538000, profit: -776176, ebitda: 1200000,
    equity: 4300000, debt: 6700000, cagr: -0.4, experience: 7, yearChange: 2.5,
    capitalAttraction: 'corporate', napka: false,
    reliability: 'C', investStatus: 'paused',
    region: 'Санкт-Петербург', founded: 2017,
    pl: stubPL({
      revenue: 8561086, otherIncome: 192767, cogs: 6235285, grossProfit: 2325801,
      commercialExpenses: 0, adminExpenses: 534338, operatingProfit: 1791463,
      interestExpense: 2809575, preaxProfit: -1034976, netProfit: -776176,
    } as PLRow, [0.92, 1.08, 1.14, 0.99, 1]),
    assets: stubAssets({
      totalAssets: 16400000, currentAssets: 10100000, fixedAssets: 6300000,
      equity: 4300000, longTermDebt: 4800000, shortTermDebt: 1900000, totalDebt: 12100000,
    }, [0.88, 1.02, 1.10, 0.98, 1]),
  },
  {
    rank: 6, name: 'Право онлайн', fullName: 'Право онлайн', inn: '7734567890',
    revenue: 7129755, revenue2023: 4626000, profit: 1879565, ebitda: 2800000,
    equity: 3400000, debt: 2100000, cagr: 139.9, experience: 6, yearChange: 54.1,
    capitalAttraction: 'corporate', napka: false,
    reliability: 'B', investStatus: 'closed',
    region: 'Москва', founded: 2018,
    pl: stubPL({
      revenue: 6929255, otherIncome: 200500, cogs: 1732532, grossProfit: 5196723,
      commercialExpenses: 0, adminExpenses: 0, operatingProfit: 5196723,
      interestExpense: 581757, preaxProfit: 2358953, netProfit: 1879565,
    } as PLRow, [0.04, 0.12, 0.30, 0.65, 1]),
    assets: stubAssets({
      totalAssets: 8900000, currentAssets: 6200000, fixedAssets: 2700000,
      equity: 3400000, longTermDebt: 1500000, shortTermDebt: 600000, totalDebt: 5500000,
    }, [0.05, 0.14, 0.35, 0.67, 1]),
  },
  {
    rank: 7, name: 'Филберт', fullName: 'Филберт', inn: '7714567891',
    revenue: 6148318, revenue2023: 4799000, profit: 2568638, ebitda: 3500000,
    equity: 5200000, debt: 1400000, cagr: 36.5, experience: 14, yearChange: 28.1,
    capitalAttraction: 'public', napka: true,
    investRate: 19.5, investMinSum: 100, investTerm: '6–24 мес.',
    reliability: 'A', investStatus: 'open', region: 'Москва', founded: 2010,
    pl: stubPL({
      revenue: 6087396, otherIncome: 60922, cogs: 424779, grossProfit: 5662617,
      commercialExpenses: 0, adminExpenses: 1066680, operatingProfit: 4595937,
      interestExpense: 516642, preaxProfit: 3232861, netProfit: 2568638,
    } as PLRow, [0.32, 0.44, 0.58, 0.78, 1]),
    assets: stubAssets({
      totalAssets: 12600000, currentAssets: 9100000, fixedAssets: 3500000,
      equity: 5200000, longTermDebt: 1000000, shortTermDebt: 400000, totalDebt: 7400000,
    }, [0.30, 0.42, 0.56, 0.76, 1]),
  },
  {
    rank: 8, name: 'РСВ', fullName: 'РСВ', inn: '7701234568',
    revenue: 5864105, revenue2023: 5278000, profit: 3204091, ebitda: 4100000,
    equity: 6100000, debt: 900000, cagr: 54.3, experience: 12, yearChange: 11.1,
    capitalAttraction: 'corporate', napka: true,
    reliability: 'A', investStatus: 'closed',
    region: 'Москва', founded: 2012,
    pl: stubPL({
      revenue: 4683543, otherIncome: 1180562, cogs: 1169081, grossProfit: 3514462,
      commercialExpenses: 0, adminExpenses: 72378, operatingProfit: 3442084,
      interestExpense: 134707, preaxProfit: 4056512, netProfit: 3204091,
    } as PLRow, [0.28, 0.40, 0.55, 0.90, 1]),
    assets: stubAssets({
      totalAssets: 11200000, currentAssets: 8400000, fixedAssets: 2800000,
      equity: 6100000, longTermDebt: 600000, shortTermDebt: 300000, totalDebt: 5100000,
    }, [0.25, 0.38, 0.52, 0.88, 1]),
  },
  {
    rank: 9, name: 'ЦДУ', fullName: 'Центр долгового урегулирования', inn: '7722345679',
    revenue: 4706406, revenue2023: 3768000, profit: 1384779, ebitda: 2100000,
    equity: 2900000, debt: 1600000, cagr: 63.2, experience: 16, yearChange: 24.9,
    capitalAttraction: 'none', napka: null,
    reliability: 'B', investStatus: 'closed',
    region: 'Екатеринбург', founded: 2008,
    pl: stubPL({
      revenue: 4664854, otherIncome: 41552, cogs: 2632146, grossProfit: 2032708,
      commercialExpenses: 0, adminExpenses: 0, operatingProfit: 2032708,
      interestExpense: 1959, preaxProfit: 1738483, netProfit: 1384779,
    } as PLRow, [0.22, 0.33, 0.48, 0.80, 1]),
    assets: stubAssets({
      totalAssets: 7400000, currentAssets: 5200000, fixedAssets: 2200000,
      equity: 2900000, longTermDebt: 1100000, shortTermDebt: 500000, totalDebt: 4500000,
    }, [0.20, 0.32, 0.47, 0.78, 1]),
  },
  {
    rank: 10, name: 'Траст', fullName: 'Траст', inn: '7708901235',
    revenue: 3666014, revenue2023: 3241000, profit: 1296597, ebitda: 1900000,
    equity: 3100000, debt: 700000, cagr: 29.2, experience: 18, yearChange: 13.1,
    capitalAttraction: 'none', napka: true,
    reliability: 'B', investStatus: 'closed',
    region: 'Москва', founded: 2006,
    pl: stubPL({
      revenue: 3635704, otherIncome: 30310, cogs: 759371, grossProfit: 2876333,
      commercialExpenses: 0, adminExpenses: 366287, operatingProfit: 2510046,
      interestExpense: 32403, preaxProfit: 1693251, netProfit: 1296597,
    } as PLRow, [0.48, 0.58, 0.68, 0.88, 1]),
    assets: stubAssets({
      totalAssets: 8200000, currentAssets: 5900000, fixedAssets: 2300000,
      equity: 3100000, longTermDebt: 480000, shortTermDebt: 220000, totalDebt: 5100000,
    }, [0.45, 0.55, 0.65, 0.86, 1]),
  },
  {
    rank: 11, name: 'ДА «Фемида»', fullName: 'Долговое агентство Фемида', inn: '7736789012',
    revenue: 3049049, revenue2023: 2104000, profit: 835826, ebitda: 1350000,
    equity: 2100000, debt: 890000, cagr: 118.8, experience: 11, yearChange: 44.9,
    capitalAttraction: 'none', napka: false,
    reliability: 'B', investStatus: 'closed',
    region: 'Москва', founded: 2013,
    pl: stubPL({
      revenue: 3019599, otherIncome: 29450, cogs: 506759, grossProfit: 2512840,
      commercialExpenses: 0, adminExpenses: 821369, operatingProfit: 1691471,
      interestExpense: 2750, preaxProfit: 1050908, netProfit: 835826,
    } as PLRow, [0.12, 0.22, 0.40, 0.70, 1]),
    assets: stubAssets({
      totalAssets: 5400000, currentAssets: 3800000, fixedAssets: 1600000,
      equity: 2100000, longTermDebt: 620000, shortTermDebt: 270000, totalDebt: 3300000,
    }, [0.11, 0.20, 0.38, 0.68, 1]),
  },
  {
    rank: 12, name: 'М.Б.А. Финансы', fullName: 'М.Б.А. Финансы', inn: '7730123456',
    revenue: 2977193, revenue2023: 2301000, profit: 749259, ebitda: 1180000,
    equity: 1900000, debt: 760000, cagr: 26.1, experience: 16, yearChange: 29.4,
    capitalAttraction: 'public', napka: true,
    investRate: 18.0, investMinSum: 25, investTerm: '12–24 мес.',
    reliability: 'B', investStatus: 'open', region: 'Москва', founded: 2008,
    pl: stubPL({
      revenue: 2921979, otherIncome: 55214, cogs: 1249349, grossProfit: 1672630,
      commercialExpenses: 0, adminExpenses: 719882, operatingProfit: 952748,
      interestExpense: 55618, preaxProfit: 936574, netProfit: 749259,
    } as PLRow, [0.44, 0.55, 0.66, 0.77, 1]),
    assets: stubAssets({
      totalAssets: 5100000, currentAssets: 3600000, fixedAssets: 1500000,
      equity: 1900000, longTermDebt: 530000, shortTermDebt: 230000, totalDebt: 3200000,
    }, [0.42, 0.53, 0.64, 0.75, 1]),
  },
  {
    rank: 13, name: 'ЦДУ Инвест', fullName: 'ЦДУ Инвест', inn: '7709876543',
    revenue: 2413732, revenue2023: 1541000, profit: 768428, ebitda: 1050000,
    equity: 1600000, debt: 620000, cagr: 115.7, experience: 10, yearChange: 56.6,
    capitalAttraction: 'none', napka: null,
    reliability: 'B', investStatus: 'closed',
    region: 'Москва', founded: 2014,
    pl: stubPL({
      revenue: 2389741, otherIncome: 23991, cogs: 1211589, grossProfit: 1178152,
      commercialExpenses: 0, adminExpenses: 0, operatingProfit: 1178152,
      interestExpense: 34850, preaxProfit: 960955, netProfit: 768428,
    } as PLRow, [0.14, 0.24, 0.42, 0.64, 1]),
    assets: stubAssets({
      totalAssets: 4200000, currentAssets: 3000000, fixedAssets: 1200000,
      equity: 1600000, longTermDebt: 430000, shortTermDebt: 190000, totalDebt: 2600000,
    }, [0.13, 0.22, 0.40, 0.62, 1]),
  },
  {
    rank: 14, name: 'АСВ', fullName: 'АСВ', inn: '7737890123',
    revenue: 2330001, revenue2023: 1470000, profit: 210834, ebitda: 490000,
    equity: 1100000, debt: 1400000, cagr: 48.2, experience: 10, yearChange: 58.6,
    capitalAttraction: 'public', napka: false,
    investRate: 22.0, investMinSum: 5, investTerm: '6–12 мес.',
    reliability: 'C', investStatus: 'open', region: 'Краснодар', founded: 2014,
    pl: stubPL({
      revenue: 2323579, otherIncome: 6422, cogs: 767562, grossProfit: 1556017,
      commercialExpenses: 0, adminExpenses: 794884, operatingProfit: 761133,
      interestExpense: 432283, preaxProfit: 281120, netProfit: 210834,
    } as PLRow, [0.15, 0.25, 0.44, 0.63, 1]),
    assets: stubAssets({
      totalAssets: 5900000, currentAssets: 3800000, fixedAssets: 2100000,
      equity: 1100000, longTermDebt: 980000, shortTermDebt: 420000, totalDebt: 4800000,
    }, [0.14, 0.23, 0.42, 0.62, 1]),
  },
  {
    rank: 15, name: 'АБК', fullName: 'АБК', inn: '7706543210',
    revenue: 2316584, revenue2023: 2351000, profit: 458487, ebitda: 820000,
    equity: 1500000, debt: 540000, cagr: 12.3, experience: 11, yearChange: -1.5,
    capitalAttraction: 'corporate', napka: true,
    reliability: 'B', investStatus: 'closed',
    region: 'Москва', founded: 2013,
    pl: stubPL({
      revenue: 2145685, otherIncome: 170899, cogs: 923280, grossProfit: 1222405,
      commercialExpenses: 0, adminExpenses: 540010, operatingProfit: 682395,
      interestExpense: 253201, preaxProfit: 606274, netProfit: 458487,
    } as PLRow, [0.50, 0.62, 0.74, 1.01, 1]),
    assets: stubAssets({
      totalAssets: 4300000, currentAssets: 3000000, fixedAssets: 1300000,
      equity: 1500000, longTermDebt: 380000, shortTermDebt: 160000, totalDebt: 2800000,
    }, [0.48, 0.60, 0.72, 1.00, 1]),
  },
  {
    rank: 16, name: 'Защита Онлайн', fullName: 'Защита Онлайн', inn: '7718901234',
    revenue: 1885826, revenue2023: 522000, profit: 500453, ebitda: 720000,
    equity: 1050000, debt: 480000, cagr: 97.9, experience: 6, yearChange: 261.2,
    capitalAttraction: 'public', napka: false,
    investRate: 23.5, investMinSum: 10, investTerm: '3–12 мес.',
    reliability: 'C', investStatus: 'open', region: 'Ростов-на-Дону', founded: 2018,
    pl: stubPL({
      revenue: 1885603, otherIncome: 223, cogs: 688904, grossProfit: 1196699,
      commercialExpenses: 0, adminExpenses: 0, operatingProfit: 1196699,
      interestExpense: 226331, preaxProfit: 626064, netProfit: 500453,
    } as PLRow, [0.04, 0.10, 0.20, 0.28, 1]),
    assets: stubAssets({
      totalAssets: 3200000, currentAssets: 2200000, fixedAssets: 1000000,
      equity: 1050000, longTermDebt: 340000, shortTermDebt: 140000, totalDebt: 2150000,
    }, [0.04, 0.09, 0.19, 0.27, 1]),
  },
  {
    rank: 17, name: 'СКМ', fullName: 'СКМ', inn: '7716789012',
    revenue: 1611463, revenue2023: 2694000, profit: 569404, ebitda: 890000,
    equity: 1400000, debt: 310000, cagr: 13.5, experience: 15, yearChange: -40.2,
    capitalAttraction: 'corporate', napka: null,
    reliability: 'B', investStatus: 'closed',
    region: 'Москва', founded: 2009,
    pl: stubPL({
      revenue: 1510557, otherIncome: 100906, cogs: 240421, grossProfit: 1270136,
      commercialExpenses: 0, adminExpenses: 406275, operatingProfit: 863861,
      interestExpense: 83421, preaxProfit: 717898, netProfit: 569404,
    } as PLRow, [0.60, 0.72, 0.84, 1.67, 1]),
    assets: stubAssets({
      totalAssets: 3800000, currentAssets: 2700000, fixedAssets: 1100000,
      equity: 1400000, longTermDebt: 220000, shortTermDebt: 90000, totalDebt: 2400000,
    }, [0.58, 0.70, 0.82, 1.65, 1]),
  },
  {
    rank: 18, name: 'Фабула', fullName: 'Фабула', inn: '7723456780',
    revenue: 1584330, revenue2023: 1375000, profit: 577076, ebitda: 810000,
    equity: 1200000, debt: 390000, cagr: 38.4, experience: 9, yearChange: 15.3,
    capitalAttraction: 'none', napka: null,
    reliability: 'B', investStatus: 'closed',
    region: 'Санкт-Петербург', founded: 2015,
    pl: stubPL({
      revenue: 0, otherIncome: 1584330, cogs: 0, grossProfit: 0,
      commercialExpenses: 0, adminExpenses: 222451, operatingProfit: -222451,
      interestExpense: 771, preaxProfit: 720945, netProfit: 577076,
    } as PLRow, [0.40, 0.55, 0.68, 0.87, 1]),
    assets: stubAssets({
      totalAssets: 3400000, currentAssets: 2400000, fixedAssets: 1000000,
      equity: 1200000, longTermDebt: 275000, shortTermDebt: 115000, totalDebt: 2200000,
    }, [0.38, 0.52, 0.65, 0.85, 1]),
  },
  {
    rank: 19, name: 'ФинТраст', fullName: 'ФинТраст', inn: '7735678901',
    revenue: 1394242, revenue2023: 6215000, profit: -86162, ebitda: 180000,
    equity: 620000, debt: 1900000, cagr: -20.9, experience: 15, yearChange: -77.7,
    capitalAttraction: 'none', napka: false,
    reliability: 'D', investStatus: 'closed',
    region: 'Новосибирск', founded: 2009,
    pl: stubPL({
      revenue: 1282239, otherIncome: 112003, cogs: 257409, grossProfit: 1024830,
      commercialExpenses: 0, adminExpenses: 55355, operatingProfit: 969475,
      interestExpense: 1010987, preaxProfit: -86364, netProfit: -86162,
    } as PLRow, [1.62, 1.98, 2.20, 4.46, 1]),
    assets: stubAssets({
      totalAssets: 6800000, currentAssets: 4200000, fixedAssets: 2600000,
      equity: 620000, longTermDebt: 1340000, shortTermDebt: 560000, totalDebt: 6180000,
    }, [1.55, 1.90, 2.10, 4.40, 1]),
  },
  {
    rank: 20, name: 'Юнона', fullName: 'Юнона', inn: '7721234570',
    revenue: 1370904, revenue2023: 1500000, profit: 2490, ebitda: 210000,
    equity: 740000, debt: 880000, cagr: 19.8, experience: 8, yearChange: -8.7,
    capitalAttraction: 'none', napka: null,
    reliability: 'C', investStatus: 'closed',
    region: 'Казань', founded: 2016,
    pl: stubPL({
      revenue: 4, otherIncome: 1370900, cogs: 96943, grossProfit: -96939,
      commercialExpenses: 0, adminExpenses: 0, operatingProfit: -96939,
      interestExpense: 8113, preaxProfit: 3535, netProfit: 2490,
    } as PLRow, [0.80, 0.92, 1.05, 1.09, 1]),
    assets: stubAssets({
      totalAssets: 2900000, currentAssets: 1900000, fixedAssets: 1000000,
      equity: 740000, longTermDebt: 620000, shortTermDebt: 260000, totalDebt: 2160000,
    }, [0.78, 0.90, 1.02, 1.08, 1]),
  },
];