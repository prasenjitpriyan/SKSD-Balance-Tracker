export interface Transaction {
  id: string;
  source: string;
  amount: number;
}

export const INCOME_DATA: Transaction[] = [
  { id: 'inc_1', source: 'EXTRA', amount: 250 },
  { id: 'inc_2', source: 'FSC - APR 2025 TO AUG 2025', amount: 1750 },
  { id: 'inc_3', source: 'FSC - SEP 2025 TO NOV 2025', amount: 1350 },
  { id: 'inc_4', source: 'FSC - DEC 2025', amount: 450 },
  { id: 'inc_5', source: 'PRASENJIT DAS DEC-2025', amount: 100 },
  { id: 'inc_6', source: 'PRASENJIT DAS JAN-2026', amount: 100 },
  { id: 'inc_7', source: 'ANUSRITA DUTTA DEC-2025', amount: 100 },
  { id: 'inc_8', source: 'ANUSRITA DUTTA JAN-2026', amount: 100 },
  { id: 'inc_9', source: 'SHAKTI PADA DAS DEC-2025', amount: 100 },
  { id: 'inc_10', source: 'SHAKTI PADA DAS DEC-2026', amount: 100 },
  { id: 'inc_11', source: 'BISWANATH HALDER DEC-2025', amount: 100 },
  { id: 'inc_12', source: 'BISWANATH HALDER JAN-2026', amount: 100 },
  { id: 'inc_13', source: 'ARUP DAS DEC-2025', amount: 100 },
  { id: 'inc_14', source: 'ARUP DAS JAN-2026', amount: 100 },
  { id: 'inc_15', source: 'FSC - FEB 2026', amount: 450 },
  { id: 'inc_16', source: 'ANUSRITA DUTTA FEB-2026', amount: 100 },
  { id: 'inc_17', source: 'ARUP DAS FEB-MARCH-2026', amount: 200 },
  { id: 'inc_18', source: 'BILLS', amount: 3000 },
  { id: 'inc_19', source: 'FSC - MARCH 2026', amount: 450 },
  { id: 'inc_20', source: 'PRASENJIT DAS FEB-2026', amount: 100 },
  { id: 'inc_21', source: 'PRASENJIT DAS MARCH-2026', amount: 100 },
];

export const EXPENSE_DATA: Transaction[] = [
  { id: 'exp_1', source: 'COFFEE DEC-2025', amount: 98 },
  { id: 'exp_2', source: 'COFFEE DEC-2025', amount: 98 },
  { id: 'exp_3', source: 'TEA DEC-2025', amount: 225 },
  { id: 'exp_4', source: 'COFFEE JAN-2026', amount: 98 },
  { id: 'exp_5', source: 'GDS PLI MEETING 09.01.2026', amount: 610 },
  { id: 'exp_6', source: 'FILE', amount: 800 },
  { id: 'exp_7', source: 'COFFEE JAN-2026', amount: 98 },
  { id: 'exp_8', source: 'EXAM', amount: 2000 },
  { id: 'exp_9', source: 'EXAM', amount: 100 },
  { id: 'exp_10', source: 'EXAM', amount: 150 },
  { id: 'exp_11', source: 'COFFEE FEB-2026', amount: 240 },
  { id: 'exp_12', source: 'RUBBER', amount: 120 },
  { id: 'exp_13', source: 'TEA STAINER', amount: 220 },
  { id: 'exp_14', source: 'BOX TO DIVISION', amount: 200 },
  { id: 'exp_15', source: 'COFFEE MARCH-2026', amount: 200 },
  { id: 'exp_16', source: 'CAMP ANUSRITA DUTTA 3 DAYS', amount: 730 },
];

export const TOTAL_INCOME = INCOME_DATA.reduce((acc, cur) => acc + cur.amount, 0);
export const TOTAL_EXPENSE = EXPENSE_DATA.reduce((acc, cur) => acc + cur.amount, 0);
export const BALANCE_IN_HAND = TOTAL_INCOME - TOTAL_EXPENSE;
