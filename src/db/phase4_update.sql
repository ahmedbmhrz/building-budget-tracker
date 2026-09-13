-- Phase 4: Database Update for Budget Allocations

-- We need a table to store the specific category allocations for a budget.
-- For example, allocating $20,000 to "Elevator" and $30,000 to "Keeper Salary".

CREATE TABLE public.budget_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID REFERENCES public.budgets(id) ON DELETE CASCADE,
  category_name TEXT NOT NULL,
  allocated_amount NUMERIC NOT NULL CHECK (allocated_amount >= 0),
  UNIQUE(budget_id, category_name)
);

-- Enable RLS
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view budget categories" ON public.budget_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage budget categories" ON public.budget_categories FOR ALL USING (auth_is_admin());
