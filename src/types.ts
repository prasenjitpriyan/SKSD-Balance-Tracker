export interface Transaction {
  id: string;
  source: string;
  amount: number;
  type: 'income' | 'expense';
  created_at?: string;
}
