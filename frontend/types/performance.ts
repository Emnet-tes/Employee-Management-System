export interface Performance {
  _id: string;
  date: string;
  rating: number;
  feedback: string;
  goals: string[];
  kpis: {
    kpi: string;
    target: number;
    achieved: number;
  }[];
  employee: {
    name: string;
    email: string;
  };
  reviewer: {
    name: string;
  };
}
