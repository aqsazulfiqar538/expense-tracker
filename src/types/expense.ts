export type ExpenseParticipant = {
  id: string;
  attributes: {
    user_id: number;
    amount: string;
    name: string;
  };
};

export type Expense = {
  id: string;
  attributes: {
    title: string;
    amount: string;
    start_date: string;
    end_date: string | null;
    notes: string | null;
    category_name: string | null;
    participants: ExpenseParticipant[];
  };
  relationships: {
    category?: {
      data?: { id: string };
    };
  };
};

export type CreateExpensePayload = {
  title: string;
  amount: string;
  category_id?: number | null;
  start_date: string;
  end_date?: string | null;
  notes?: string | null;
  split_equally: boolean;
  participants: { user_id: number; amount?: string }[];
  group_id?: string | null;
  new_group?: {
    name: string;
    group_type: string;
  } | null;
};
