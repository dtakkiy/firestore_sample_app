import { Timestamp } from 'firebase-admin/firestore';

export type Question = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type User = {
  id: string;
  name: string;
  questions: Question[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
