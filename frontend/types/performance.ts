export type Performance = {
  _id: string;
  _type: "performance";
  date: string;
  kpis: string[];
  feedback: string;
  rating: number;
  employee: {
    _id: string;
    name: string;
    email: string;
  };
  reviewer: {
    _id: string;
    name: string;
    email: string;
  };
};
