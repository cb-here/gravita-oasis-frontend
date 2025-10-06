// types/types.ts

export interface StatusTag {
  label: string;
  color: string;
}

export interface Category {
  name: string;
  color: string;
}

export interface Task {
  id: string;
  mrn: string;
  title: string;
  patient: string;
  dueDate: string;
  comments?: number;
  assignee?: string;
  status: string;
  statusTags: StatusTag[];
  category: Category;
  priority?: string;
}

export interface DropResult {
  name: string;
}