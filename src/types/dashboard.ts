export type DashboardResponse = {
  total_expenses: number;
  current_month_total: number;
  category_totals: Record<string, number>;
  recent_expenses: {
    data: {
      id: string;
      attributes: {
        amount: number;
        created_at: string;
        category?: {
          name: string;
        };
      };
    }[];
  };
};
