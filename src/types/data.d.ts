import { Timestamp } from 'firebase-admin/firestore';

export type TypeQuestionStatus = '完了' | '未完了' | 'レビュー待ち';

export type Question = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type QuestionStatus = {
  id: string;
  status: TypeQuestionStatus;
};

export type User = {
  id: string;
  name: string;
  questions: QuestionStatus[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
