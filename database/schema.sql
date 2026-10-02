create extension if not exists "pgcrypto";

create table if not exists public.loans (
  id uuid primary key default gen_random_uuid(),
  member_name text not null check (char_length(trim(member_name)) >= 2),
  member_email text not null check (member_email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  book_title text not null check (char_length(trim(book_title)) >= 1),
  book_isbn text,
  loan_date date not null default current_date,
  due_date date not null,
  return_date date,
  status text not null default 'Dipinjam'
    check (status in ('Dipinjam', 'Dikembalikan', 'Terlambat')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint due_date_not_before_loan_date check (due_date >= loan_date),
  constraint return_date_not_before_loan_date check (
    return_date is null or return_date >= loan_date
  )
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists loans_set_updated_at on public.loans;
create trigger loans_set_updated_at
before update on public.loans
for each row execute function public.set_updated_at();

alter table public.loans enable row level security;

drop policy if exists "Public can read loans" on public.loans;
create policy "Public can read loans"
on public.loans for select
to anon
using (true);

drop policy if exists "Public can create loans" on public.loans;
create policy "Public can create loans"
on public.loans for insert
to anon
with check (true);

drop policy if exists "Public can update loans" on public.loans;
create policy "Public can update loans"
on public.loans for update
to anon
using (true)
with check (true);

drop policy if exists "Public can delete loans" on public.loans;
create policy "Public can delete loans"
on public.loans for delete
to anon
using (true);
