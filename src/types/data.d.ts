export type Question = {
  id: string;
  title: string;
  description: string;
  status: string;
};

export type Questions = Question[];

export type User = {
  id: string;
  name: string;
  questions: Questions;
};

export type Users = User[];
