
export type Schedule = {
  _id: string;
  _type: "schedule";
  shift: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
  employee: {
    _id: string;
    name: string;
    position: string;
  };
};
