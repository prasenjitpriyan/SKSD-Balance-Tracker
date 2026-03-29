-- Create the transaction table
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  source text not null,
  amount numeric not null,
  type text not null check (type in ('income', 'expense')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table public.transactions enable row level security;

-- Allow anonymous read access (since you don't have login set up yet)
create policy "Allow anonymous read access"
  on public.transactions for select
  using ( true );

-- Insert your original INCOME data
insert into public.transactions (source, amount, type) values
('EXTRA', 250, 'income'),
('FSC - APR 2025 TO AUG 2025', 1750, 'income'),
('FSC - SEP 2025 TO NOV 2025', 1350, 'income'),
('FSC - DEC 2025', 450, 'income'),
('PRASENJIT DAS DEC-2025', 100, 'income'),
('PRASENJIT DAS JAN-2026', 100, 'income'),
('ANUSRITA DUTTA DEC-2025', 100, 'income'),
('ANUSRITA DUTTA JAN-2026', 100, 'income'),
('SHAKTI PADA DAS DEC-2025', 100, 'income'),
('SHAKTI PADA DAS DEC-2026', 100, 'income'),
('BISWANATH HALDER DEC-2025', 100, 'income'),
('BISWANATH HALDER JAN-2026', 100, 'income'),
('ARUP DAS DEC-2025', 100, 'income'),
('ARUP DAS JAN-2026', 100, 'income'),
('FSC - FEB 2026', 450, 'income'),
('ANUSRITA DUTTA FEB-2026', 100, 'income'),
('ARUP DAS FEB-MARCH-2026', 200, 'income'),
('BILLS', 3000, 'income'),
('FSC - MARCH 2026', 450, 'income'),
('PRASENJIT DAS FEB-2026', 100, 'income'),
('PRASENJIT DAS MARCH-2026', 100, 'income');

-- Insert your original EXPENSE data
insert into public.transactions (source, amount, type) values
('COFFEE DEC-2025', 98, 'expense'),
('COFFEE DEC-2025', 98, 'expense'),
('TEA DEC-2025', 225, 'expense'),
('COFFEE JAN-2026', 98, 'expense'),
('GDS PLI MEETING 09.01.2026', 610, 'expense'),
('FILE', 800, 'expense'),
('COFFEE JAN-2026', 98, 'expense'),
('EXAM', 2000, 'expense'),
('EXAM', 100, 'expense'),
('EXAM', 150, 'expense'),
('COFFEE FEB-2026', 240, 'expense'),
('RUBBER', 120, 'expense'),
('TEA STAINER', 220, 'expense'),
('BOX TO DIVISION', 200, 'expense'),
('COFFEE MARCH-2026', 200, 'expense'),
('CAMP ANUSRITA DUTTA 3 DAYS', 730, 'expense');
