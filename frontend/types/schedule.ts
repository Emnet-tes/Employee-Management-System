export type Schedule = {
  _id: string
  _type: 'schedule'
  employee:{
    _id: string
    name: string
    email: string;
  } // can be a reference ID or populated object
  shift: string
  date: string // ISO format (e.g., '2025-06-11')
  notes?: string
}
