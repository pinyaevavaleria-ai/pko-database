// ── Облигации ────────────────────────────────────────────────────
export interface Bond {
  company: string;
  rating: string;
  isin: string;
  coupon: string;
  volume: number | null; // млн ₽, null = нет данных
  platform: string;
  status: 'active' | 'placing';
  repayment: string;
}

export const bonds: Bond[] = [
  { company: 'Первое клиентское бюро',  rating: 'ruA- / A.ru', isin: 'RU000A108CC9', coupon: '14.1%',   volume: 1668, platform: 'Мосбиржа', status: 'active', repayment: '23.04.2027' },
  { company: 'Первое клиентское бюро',  rating: 'ruA- / A.ru', isin: 'RU000A10BGW7', coupon: 'КС+4%',   volume: 2000, platform: 'Мосбиржа', status: 'active', repayment: '06.10.2028' },
  { company: 'АйДи Коллект',     rating: 'ruBBB-',      isin: 'RU000A107C34', coupon: '25.1%',   volume: 1658, platform: 'Мосбиржа', status: 'active', repayment: '21.11.2026' },
  { company: 'АйДи Коллект',     rating: 'ruBBB-',      isin: 'RU000A10B2P6', coupon: '23.4%',   volume: 1300, platform: 'Мосбиржа', status: 'active', repayment: '27.02.2028' },
  { company: 'Агентство Судебного Взыскания',              rating: 'BB+(ru)',     isin: 'RU000A106RB3', coupon: '28.4%',   volume:  200, platform: 'Мосбиржа', status: 'active', repayment: '14.08.2026' },
  { company: 'Агентство Судебного Взыскания',              rating: 'BB+(ru)',     isin: 'RU000A10DLC5', coupon: '25.0%',   volume:  200, platform: 'Мосбиржа', status: 'active', repayment: '10.11.2028' },
  { company: 'Финэква',          rating: '—',           isin: 'RU000A10DLN2', coupon: '24%',     volume:  600, platform: 'Мосбиржа', status: 'active', repayment: '06.11.2029' },
  { company: 'Служба защиты активов',              rating: 'BB-',         isin: 'RU000A10AA77', coupon: '31%',     volume:  100, platform: 'Мосбиржа', status: 'active', repayment: '25.11.2027' },
  { company: 'Защита Онлайн',    rating: '—',           isin: 'RU000A10DRV2', coupon: '26.5%',   volume:  200, platform: 'Мосбиржа', status: 'active', repayment: '24.11.2028' },
  { company: 'Интел коллект',    rating: 'ruB+',        isin: 'RU000A10CT09', coupon: '25–26%',  volume:  500, platform: 'Мосбиржа', status: 'active', repayment: '07.09.2028' },
  { company: 'Вернём',           rating: 'B|ru|',       isin: 'RU000A10ED62', coupon: '26.5%',   volume:  150, platform: 'Мосбиржа', status: 'placing', repayment: '10.02.2029' },
  { company: 'Бустер.Ру',        rating: '—',           isin: 'RU000A10DRE8', coupon: '24–26%',  volume:  300, platform: 'Мосбиржа', status: 'active', repayment: '24.11.2028' },
  { company: 'Юридическая служба взыскания',              rating: 'BBB-',        isin: 'RU000A10CN62', coupon: 'ВДО',     volume: null, platform: 'Мосбиржа', status: 'active', repayment: '20.08.2028' },
];

// ── Займы через сайт ─────────────────────────────────────────────
export interface SiteLoan {
  company: string;
  type: string;
  sites: string[];
}

export const siteLoans: SiteLoan[] = [
  { company: 'Филберт',                             type: 'Займы через сайт для физлиц', sites: ['filbert.pro'] },
  { company: 'М.Б.А. Финансы',                     type: 'Займы через сайт для физлиц', sites: ['mbafin.ru'] },
  { company: 'Кредитор', type: 'Займы через сайт для физлиц', sites: ['creditor.ru'] },
];

// ── Корпоративные ────────────────────────────────────────────────
export type CorporateType = 'Банк' | 'Иностранный холдинг' | 'Секьюритизация' | 'ЗПИФ' | 'Иностранная компания' | 'Финтех-группа' | 'Контакт-центр/холдинг';

export interface Corporate {
  company: string;
  founder: string;
  structureType: CorporateType;
  details: string;
}

export const corporates: Corporate[] = [
  { company: 'Феникс',                    founder: 'Т-Банк (Тинькофф)',                   structureType: 'Банк',                  details: 'Учредитель — банк' },
  { company: 'ЭОС',                       founder: 'EOS Group (Otto Group, Германия)',     structureType: 'Иностранный холдинг',   details: '100% дочерняя компания' },
  { company: 'Национальная Фабрика Ипотеки',                       founder: 'ГК Регион / МКБ',                     structureType: 'Секьюритизация',        details: 'MBS — ипотечные ценные бумаги' },
  { company: 'Право онлайн',              founder: 'ЗПИФ «Клауд Финанс» (УК «Гамма Групп»)', structureType: 'ЗПИФ',              details: 'Финансирование через ЗПИФ' },
  { company: 'Региональная Служба Взыскания',                       founder: 'Свеа Экономи Сайпрус (Svea, Швеция)', structureType: 'Иностранная компания',  details: 'Учредитель — иностранная компания' },
  { company: 'АктивБизнесКонсалт',                       founder: 'Сбербанк',                            structureType: 'Банк',                  details: 'Учредитель — банк' },
  { company: 'Сентинел (СКМ)',             founder: 'ЗПИФ «Акватория»',                   structureType: 'ЗПИФ',                  details: 'Финансирование через ЗПИФ' },
  { company: 'Киберколлект',              founder: 'Cyberbird',                           structureType: 'Финтех-группа',         details: 'Финтех-группа с МФО' },
  { company: 'Столичная Сервисная Компания', founder: 'Свеа Экономи + РСВ',              structureType: 'Иностранная компания',  details: 'Группа Svea' },
  { company: 'Воксис',                    founder: 'МКАО «Воксис»',                       structureType: 'Контакт-центр/холдинг', details: 'Эмитент облигаций (материнская структура)' },
  { company: 'Финэква',                   founder: 'Eqvanta (Быстроденьги, Турбозайм)',   structureType: 'Финтех-группа',         details: 'Также выпускает облигации' },
];

// ── Тип для «Все» ────────────────────────────────────────────────
export interface AllInvestment {
  company: string;
  type: 'bonds' | 'site-loan' | 'corporate';
  details: string;
  subDetails?: string;
}

export const allInvestments: AllInvestment[] = [
  // Облигации (уникальные компании)
  { company: 'ПКБ',           type: 'bonds',     details: 'ruA- / A.ru', subDetails: '14.1% / КС+4% · 2 выпуска · 3 668 млн ₽' },
  { company: 'АйДи Коллект', type: 'bonds',     details: 'ruBBB-',      subDetails: '25.1% / 23.4% · 2 выпуска · 2 958 млн ₽' },
  { company: 'Агентство Судебного Взыскания',           type: 'bonds',     details: 'BB+(ru)',      subDetails: '28.4% / 25.0% · 2 выпуска · 400 млн ₽' },
  { company: 'Финэква',       type: 'bonds',     details: '—',           subDetails: '24% · 1 выпуск · 600 млн ₽' },
  { company: 'Служба защиты активов',           type: 'bonds',     details: 'BB-',         subDetails: '31% · 1 выпуск · 100 млн ₽' },
  { company: 'Защита Онлайн', type: 'bonds',     details: '—',           subDetails: '26.5% · 1 выпуск · 200 млн ₽' },
  { company: 'Интел коллект', type: 'bonds',     details: 'ruB+',        subDetails: '25–26% · 1 выпуск · 500 млн ₽' },
  { company: 'Вернём',        type: 'bonds',     details: 'B|ru|',       subDetails: '26.5% · Размещение · 150 млн ₽' },
  { company: 'Бустер.Ру',     type: 'bonds',     details: '—',           subDetails: '24–26% · 1 выпуск · 300 млн ₽' },
  { company: 'Юридическая служба взыскания',          type: 'bonds',     details: 'BBB-',        subDetails: 'ВДО · объём н/д' },
  // Займы
  { company: 'Филберт',       type: 'site-loan', details: 'Займы через сайт для физлиц', subDetails: 'filbert.pro' },
  { company: 'М.Б.А. Финансы', type: 'site-loan', details: 'Займы через сайт для физлиц', subDetails: 'mbafin.ru' },
  { company: 'Кредитор', type: 'site-loan', details: 'Займы через сайт для физлиц', subDetails: 'creditor.ru' },
  // Корпоративные
  { company: 'Феникс',        type: 'corporate', details: 'Банк',                  subDetails: 'Т-Банк (Тинькофф)' },
  { company: 'ЭОС',           type: 'corporate', details: 'Иностранный холдинг',   subDetails: 'EOS Group (Otto Group, Германия)' },
  { company: 'Национальная Фабрика Ипотеки',           type: 'corporate', details: 'Секьюритизация',        subDetails: 'ГК Регион / МКБ' },
  { company: 'Право онлайн',  type: 'corporate', details: 'ЗПИФ',                  subDetails: 'ЗПИФ «Клауд Финанс»' },
  { company: 'Региональная Служба Взыскания',           type: 'corporate', details: 'Иностранная компания',  subDetails: 'Свеа Экономи Сайпрус (Svea, Швеция)' },
  { company: 'АктивБизнесКонсалт',           type: 'corporate', details: 'Банк',                  subDetails: 'Сбербанк' },
  { company: 'Сентинел (СКМ)', type: 'corporate', details: 'ЗПИФ',                 subDetails: 'ЗПИФ «Акватория»' },
  { company: 'Киберколлект',  type: 'corporate', details: 'Финтех-группа',         subDetails: 'Cyberbird' },
  { company: 'Столичная Сервисная Компания',  type: 'corporate', details: 'Иностранная компания',  subDetails: 'Свеа Экономи + РСВ' },
  { company: 'Воксис',        type: 'corporate', details: 'Контакт-центр/холдинг', subDetails: 'МКАО «Воксис»' },
  { company: 'Финэква',       type: 'corporate', details: 'Финтех-группа',         subDetails: 'Eqvanta (Быстроденьги, Турбозайм)' },
];
