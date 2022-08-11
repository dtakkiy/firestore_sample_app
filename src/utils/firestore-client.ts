import 'dotenv/config';
import { program } from 'commander';
import './firebase';
import { Question, Questions, User, Users } from '../types/data';
import { getFirestore } from 'firebase-admin/firestore';

interface IFireStoreProvider {
  updateQuestionStatusToCompleteByUserID(userID: string): Promise<void>;
  getQuestionsStatusListByUserID(userID: string): Promise<User>;
  updateQuestionByQuestionID(
    id: string,
    title: string,
    description: string
  ): Promise<void>;
  deleteQuestionByQuestionID(id: string): Promise<void>;
}

export class FireStoreClient implements IFireStoreProvider {
  private readonly db: FirebaseFirestore.Firestore;

  constructor() {
    this.db = getFirestore();
  }

  // 1. 特定のユーザーに紐づいた課題を「未完了」から「完了」状態に変更するスクリプトを作成してください
  public updateQuestionStatusToCompleteByUserID = async (userID: string) => {
    const usersSnapshot = await this.db
      .collection('users')
      .where('id', '==', userID)
      .select('questions')
      .get();

    if (usersSnapshot.empty) return;

    usersSnapshot.forEach(async (doc) => {
      const data = doc.get('questions');
      const updateData = data.map((q: Question) => {
        if (q.status === '未完了') {
          q.status = '完了';
        }
        return q;
      });

      await doc.ref.update({ questions: updateData });
    });

    const questionSnapshot = await this.db.collection('questions').get();
    if (questionSnapshot.empty) return;

    questionSnapshot.forEach(async (doc) => {
      const users = doc.get('users');
      const updateUsers = users.map((user: any) => {
        if (user.id === userID && user.status === '未完了') {
          user.status = '完了';
        }
        return user;
      });

      await doc.ref.update({ users: updateUsers });
    });
  };

  // 2. あるユーザの課題ステータスを一覧表示するスクリプトを作成してください
  public getQuestionsStatusListByUserID = async (
    userID: string
  ): Promise<User> => {
    let response: User = { name: '', id: '', questions: [] };

    const usersSnapshot = await this.db
      .collection('users')
      .where('id', '==', userID)
      .get();

    usersSnapshot.forEach(async (doc) => {
      const data = await doc.data();
      response = data as User;
    });

    return response;
  };

  // 3. 特定の課題を更新するスクリプトを作成してください
  public updateQuestionByQuestionID = async (
    id: string,
    title: string,
    description: string
  ) => {
    const questionSnapshot = await this.db
      .collection('questions')
      .where('id', '==', id)
      .get();

    if (questionSnapshot.empty) return;

    questionSnapshot.forEach(async (postDoc) => {
      const ref = postDoc.ref;
      await ref.update({
        title: title,
        description: description,
      });
    });
  };

  // 4. 特定の課題を削除する
  public deleteQuestionByQuestionID = async (id: string) => {
    const questionsSnapshot = await this.db
      .collection('questions')
      .where('id', '==', id)
      .get();

    if (questionsSnapshot.empty) return;

    questionsSnapshot.forEach(async (postDoc) => {
      const ref = postDoc.ref;
      await ref.delete();
    });
  };

  public addSeedData = async () => {
    try {
      const userRef1 = await this.db.collection('users').add({
        id: '1',
        name: 'taro',
        questions: [
          {
            id: '1',
            title: '課題1',
            description: '課題1の詳細',
            status: '未完了',
          },
          {
            id: '2',
            title: '課題2',
            description: '課題2の詳細',
            status: '完了',
          },
          {
            id: '3',
            title: '課題3',
            description: '課題3の詳細',
            status: '未完了',
          },
        ],
      });

      const userRef2 = await this.db.collection('users').add({
        id: '2',
        name: 'jiro',
        questions: [
          {
            id: '1',
            title: '課題1',
            description: '課題1の詳細',
            status: '未完了',
          },
          {
            id: '2',
            title: '課題2',
            description: '課題2の詳細',
            status: '完了',
          },
          {
            id: '3',
            title: '課題3',
            description: '課題3の詳細',
            status: '未完了',
          },
        ],
      });

      const userRef3 = await this.db.collection('users').add({
        id: '3',
        name: 'sabu',
        questions: [
          {
            id: '1',
            title: '課題1',
            description: '課題1の詳細',
            status: '未完了',
          },
          {
            id: '2',
            title: '課題2',
            description: '課題2の詳細',
            status: '完了',
          },
          {
            id: '3',
            title: '課題3',
            description: '課題3の詳細',
            status: '未完了',
          },
        ],
      });

      const questionRef1 = await this.db.collection('questions').add({
        id: '1',
        title: '課題1',
        description: '課題1の詳細',
        users: [
          {
            id: '1',
            description: '',
            status: '未完了',
          },
          {
            id: '2',
            status: '完了',
          },
          {
            id: '3',
            status: '未完了',
          },
        ],
      });

      const questionRef2 = await this.db.collection('questions').add({
        id: '2',
        title: '課題2',
        description: '課題2の詳細',
        users: [
          {
            id: '1',
            status: '未完了',
          },
          {
            id: '2',
            status: '完了',
          },
          {
            id: '3',
            status: '未完了',
          },
        ],
      });

      const questionRef3 = await this.db.collection('questions').add({
        id: '3',
        title: '課題3',
        description: '課題3の詳細',
        users: [
          {
            id: '1',
            status: '未完了',
          },
          {
            id: '2',
            status: '完了',
          },
          {
            id: '3',
            status: '未完了',
          },
        ],
      });
    } catch (e) {
      console.log(e);
    }
  };
}
