export type Project = {
  id: number;
  name: string;
  contact: string;
  end_date: string;
  start_date: string;
};

export type Customer = {
  id: string;
  isActive: boolean;
  company: string;
  industry: string;
  projects: Project[];
  about: string;
};
