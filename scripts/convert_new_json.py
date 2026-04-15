#!/usr/bin/env python3
"""
Конвертирует PKO (1).json → ratingData.ts, financeDynamic.ts, companyDetails.ts
Сохраняет napka/capitalAttraction/fundraising/bonds из текущих данных.
"""
import json
import os
import re

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DESIGN_DATA = os.path.join(BASE, "design", "src", "app", "data")

# Input
NEW_JSON = os.path.join(os.path.expanduser("~"), "Downloads", "PKO (1).json")
OLD_NAPKA = "/tmp/old_napka_capital.json"
OLD_FUND_BONDS = "/tmp/old_fund_bonds.json"
OLD_WEBSITES = "/tmp/old_websites.json"


def parse_num(val):
    """Parse formatted Russian number: '22 501 574,00' → 22501574.0"""
    if val is None:
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    s = str(val).strip()
    if not s or s == "—" or s == "-" or s.lower() == "nan" or s.lower() == "inf":
        return 0.0
    # Remove non-breaking spaces, regular spaces
    s = s.replace("\u00a0", "").replace(" ", "")
    # Replace comma with dot for decimal
    s = s.replace(",", ".")
    try:
        return float(s)
    except ValueError:
        return 0.0


def js_str(s):
    """Escape string for JS/TS."""
    if s is None:
        return ""
    return str(s).replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")


def clean_city(region):
    """'Г.Москва' → 'Москва', 'Новосибирская обл.' → 'Новосибирская обл.'"""
    if not region:
        return ""
    r = region.strip()
    if r.startswith("Г."):
        return r[2:]
    if r.startswith("г."):
        return r[2:]
    return r


def main():
    # Load new data
    with open(NEW_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)
    print(f"Loaded {len(data)} companies from new JSON")

    # Load old supplementary data
    with open(OLD_NAPKA, "r", encoding="utf-8") as f:
        old_napka = json.load(f)
    with open(OLD_FUND_BONDS, "r", encoding="utf-8") as f:
        old_fund_bonds = json.load(f)
    with open(OLD_WEBSITES, "r", encoding="utf-8") as f:
        old_websites = json.load(f)

    # Sort by rank
    data.sort(key=lambda x: x.get("Номер рейтинга ПКО-300", 9999))

    # Deduplicate by INN (keep first occurrence = higher rank)
    seen_inns = set()
    unique_data = []
    for item in data:
        inn = str(item["ИНН"])
        if inn not in seen_inns:
            seen_inns.add(inn)
            unique_data.append(item)
    if len(unique_data) < len(data):
        print(f"Removed {len(data) - len(unique_data)} duplicate INNs")
    data = unique_data

    # ═══════════════════════════════════════════════════════════════════
    # 1. Generate ratingData.ts
    # ═══════════════════════════════════════════════════════════════════
    rating_entries = []
    for item in data:
        inn = str(item["ИНН"])
        old = old_napka.get(inn, {})

        rev_2025 = parse_num(item.get("Выручка + прочие доходы 2025"))
        rev_2024 = parse_num(item.get("Выручка + прочие доходы 2024"))

        # yearChange: % change from 2024 to 2025
        if rev_2024 > 0:
            year_change = round(((rev_2025 - rev_2024) / rev_2024) * 100, 1)
        else:
            year_change = 0.0

        de_pct = parse_num(item.get("D/E коэффициент"))
        de_ratio = round(de_pct / 100, 2) if de_pct else 0.0

        cagr_pct = parse_num(item.get("Темпы роста за 5 лет (CAGR)"))
        cagr_decimal = round(cagr_pct / 100, 2) if cagr_pct else 0.0

        entry = {
            "rank": int(item.get("Номер рейтинга ПКО-300", 0)),
            "name": item.get("Краткое название", ""),
            "inn": inn,
            "city": clean_city(item.get("Регион", "")),
            "revenue": round(parse_num(item.get("Выручка + прочие доходы 2025"))),
            "profit": round(parse_num(item.get("Чистая прибыль 2025"))),
            "yearChange": year_change,
            "growthRate": round(parse_num(item.get("Рост фин активов за 5 лет")), 1),
            "experience": int(item.get("Стаж", 0)),
            "capitalAttraction": old.get("capitalAttraction", "none"),
            "napka": old.get("napka", False),
            "cost": round(parse_num(item.get("Расходы 2025"))),
            "eqt": round(parse_num(item.get("Собственный капитал 2025"))),
            "dLong": 0,
            "dShort": 0,
            "de": de_ratio,
            "receivable": round(parse_num(item.get("Дебит. задолженность 2025"))),
            "cagr": cagr_decimal,
            "loan": round(parse_num(item.get("Заёмный капитал 2025"))),
            "rankDelta": int(item.get("Позиция в рейтинге относительно прошлого года", 0)),
        }
        rating_entries.append(entry)

    rating_ts = """// Реальные данные: PKO (1).json (2025)
// 636 компаний из реестра ФССП

export interface RatingCompany {
  rank: number;
  name: string;
  inn: string;
  city: string;       // Город регистрации
  revenue: number;    // Совокупный доход 2025, тыс руб
  profit: number;     // Чистая прибыль 2025, тыс руб
  yearChange: number; // Δ к 2024 (%)
  growthRate: number; // Рост фин активов за 5 лет (%)
  experience: number; // Стаж (лет)
  capitalAttraction: 'public' | 'corporate' | 'none';
  napka: boolean;
  cost: number;        // Расходы 2025, тыс руб
  eqt: number;         // Собственный капитал, тыс руб
  dLong: number;       // Долгосрочные обязательства, тыс руб
  dShort: number;      // Краткосрочные обязательства, тыс руб
  de: number;          // D/E коэффициент
  receivable: number;  // Дебиторская задолженность, тыс руб
  cagr: number;        // CAGR выручки 5 лет (доля, напр. 0.33 = 33%)
  loan: number;        // Заёмный капитал, тыс руб
  rankDelta: number;    // Изменение позиции в рейтинге YoY (+ = рост)
}

export const ratingData: RatingCompany[] = [\n"""

    for e in rating_entries:
        rating_ts += f"  {json.dumps(e, ensure_ascii=False)},\n"
    rating_ts += "];\n"

    out_path = os.path.join(DESIGN_DATA, "ratingData.ts")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(rating_ts)
    print(f"Generated {len(rating_entries)} entries → {out_path}")

    # ═══════════════════════════════════════════════════════════════════
    # 2. Generate financeDynamic.ts
    # ═══════════════════════════════════════════════════════════════════
    years = [2021, 2022, 2023, 2024, 2025]

    finance_ts = """// Финансовая динамика 2021-2025 (реальные данные из PKO (1).json)
// Индексы массивов: [0]=2021, [1]=2022, [2]=2023, [3]=2024, [4]=2025

export const FINANCE_YEARS = [2021, 2022, 2023, 2024, 2025] as const;
export type FinanceYearType = typeof FINANCE_YEARS[number];

export interface FinanceDynamic {
  rank: number;
  name: string;
  inn: string;
  income: number[];     // Выручка + пр. доходы, тыс руб
  cost: number[];       // Расходы, тыс руб
  profit: number[];     // Чистая прибыль, тыс руб
  receivable: number[]; // Дебиторская задолженность, тыс руб
}

export const financeDynamic: FinanceDynamic[] = [\n"""

    for item in data:
        inn = str(item["ИНН"])
        rank = int(item.get("Номер рейтинга ПКО-300", 0))
        name = item.get("Краткое название", "")

        income = [round(parse_num(item.get(f"Выручка + прочие доходы {y}"))) for y in years]
        cost = [round(parse_num(item.get(f"Расходы {y}"))) for y in years]
        profit = [round(parse_num(item.get(f"Чистая прибыль {y}"))) for y in years]
        receivable = [round(parse_num(item.get(f"Дебит. задолженность {y}"))) for y in years]

        entry = {
            "rank": rank,
            "name": name,
            "inn": inn,
            "income": income,
            "cost": cost,
            "profit": profit,
            "receivable": receivable,
        }
        finance_ts += f"  {json.dumps(entry, ensure_ascii=False)},\n"

    finance_ts += "];\n"

    out_path = os.path.join(DESIGN_DATA, "financeDynamic.ts")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(finance_ts)
    print(f"Generated {len(data)} entries → {out_path}")

    # ═══════════════════════════════════════════════════════════════════
    # 3. Generate companyDetails.ts
    # ═══════════════════════════════════════════════════════════════════

    details_entries = []
    for item in data:
        inn = str(item["ИНН"])

        # Financial years data
        financials = []
        for y in years:
            financials.append({
                "year": y,
                "revenue": round(parse_num(item.get(f"Выручка {y}"))),
                "cost": round(parse_num(item.get(f"Расходы {y}"))),
                "profit": round(parse_num(item.get(f"Чистая прибыль {y}"))),
                "assets": round(parse_num(item.get(f"Фин. вложения {y}"))),
                "receivable": round(parse_num(item.get(f"Дебит. задолженность {y}"))),
            })

        # Capital structure from 2025 data
        equity_2025 = parse_num(item.get("Собственный капитал 2025"))
        debt_2025 = parse_num(item.get("Заёмный капитал 2025"))
        total = equity_2025 + debt_2025
        equity_share = round((equity_2025 / total) * 100, 1) if total > 0 else 0
        debt_share = round((debt_2025 / total) * 100, 1) if total > 0 else 0
        de_ratio = round(parse_num(item.get("D/E коэффициент")) / 100, 2)

        capital_structure = {
            "equity": round(equity_2025),
            "debt": round(debt_2025),
            "deRatio": de_ratio,
            "authorizedCapital": round(parse_num(item.get("Уставной капитал"))),
            "debtShare": debt_share,
            "equityShare": equity_share,
            "totalAssets": round(total),
        }

        # Registration date: "03.02.2009" → "2009-02-03"
        reg_date_raw = item.get("Дата основания", "")
        reg_date = ""
        if reg_date_raw:
            parts = reg_date_raw.split(".")
            if len(parts) == 3:
                reg_date = f"{parts[2]}-{parts[1]}-{parts[0]}"

        # Fundraising and bonds from old data
        old_fb = old_fund_bonds.get(inn, {})
        fundraising = old_fb.get("fundraising", None)
        bonds = old_fb.get("bonds", None)

        # Website from old data
        website = old_websites.get(inn, "")

        entry = {
            "inn": inn,
            "fullName": item.get("Полное название", item.get("Название", "")),
            "director": item.get("Генеральный директор", ""),
            "ogrn": item.get("ОГРН", ""),
            "registrationDate": reg_date,
            "website": website,
            "region": item.get("Регион", ""),
            "address": item.get("Адрес", ""),
            "authorizedCapital": round(parse_num(item.get("Уставной капитал"))),
            "revenue2025": round(parse_num(item.get("Выручка 2025"))),
            "otherIncome2025": round(parse_num(item.get("Прочие доходы 2025"))),
            "revenue2024": round(parse_num(item.get("Выручка 2024"))),
            "otherIncome2024": round(parse_num(item.get("Прочие доходы 2024"))),
            "financials": financials,
            "capitalStructure": capital_structure,
            "fundraising": fundraising,
            "bonds": bonds,
        }
        details_entries.append(entry)

    details_ts = """// Auto-generated by scripts/convert_new_json.py
// Source: PKO (1).json

export interface YearlyFinancials {
  year: number;
  revenue: number;
  cost: number;
  profit: number;
  assets: number;
  receivable: number;
}

export interface CapitalStructure {
  equity: number;
  debt: number;
  deRatio: number;
  authorizedCapital: number;
  debtShare: number;
  equityShare: number;
  totalAssets: number;
}

export interface FundraisingInfo {
  type: string;
  status: string;
  details: string;
  founder: string;
}

export interface BondInfo {
  rating: string;
  isin: string;
  volume: number;
  coupon: string;
  maturity: string;
  status: string;
  ticker: string;
}

export interface CompanyDetails {
  inn: string;
  fullName: string;
  director: string;
  ogrn: string;
  registrationDate: string;
  website: string;
  region: string;
  address: string;
  authorizedCapital: number;
  revenue2025: number;
  otherIncome2025: number;
  revenue2024: number;
  otherIncome2024: number;
  financials: YearlyFinancials[];
  capitalStructure: CapitalStructure;
  fundraising: FundraisingInfo | null;
  bonds: BondInfo[] | null;
}

export const companyDetailsMap: Record<string, CompanyDetails> = {
"""

    for e in details_entries:
        details_ts += f'  "{e["inn"]}": {json.dumps(e, ensure_ascii=False)},\n'
    details_ts += "};\n"

    out_path = os.path.join(DESIGN_DATA, "companyDetails.ts")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(details_ts)
    print(f"Generated {len(details_entries)} entries → {out_path}")


if __name__ == "__main__":
    main()
