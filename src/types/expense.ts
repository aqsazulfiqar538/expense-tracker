export type Expense = {
  id: string;
  attributes: {
    title: string;
    amount: string;
    start_date: string;
    end_date: string | null;
    notes: string | null;
  };
  relationships: {
    category?: {
      data?: {
        id: string;
      };
    };
  };
};
