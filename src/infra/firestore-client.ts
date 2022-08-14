import '../utils/firebase';
import { Question, User } from '../types/data';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

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

  public updateQuestionStatusToCompleteByUserID = async (userID: string) => {
    const usersSnapshot = await this.db
      .collection('users')
      .where('id', '==', userID)
      .select('questions')
      .get();

    if (usersSnapshot.empty) return;

    const batch = this.db.batch();

    usersSnapshot.forEach(async (doc) => {
      const data = doc.get('questions');
      const updateData = data.map((q: Question) => {
        if (q.status === '未完了') {
          q.status = '完了';
        }
        return q;
      });

      batch.update(doc.ref, {
        questions: updateData,
        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    batch.commit();
  };

  public getQuestionsStatusListByUserID = async (
    userID: string
  ): Promise<User> => {
    let response: User = { name: '', id: '', questions: [] };

    const snapshot = await this.db
      .collection('users')
      .where('id', '==', userID)
      .get();

    if (snapshot.empty) return response;

    // 課題を全件取得
    let questionsData: Question[] = [];
    const questionSnapshot = await this.db.collection('questions').get();
    await questionSnapshot.forEach(async (doc) => {
      const data = await doc.data();
      questionsData.push({
        id: data.id,
        title: data.title,
        description: data.description,
        status: '',
      });
    });

    await snapshot.forEach(async (doc) => {
      const data = await doc.data();
      response = data as User;
      response.questions.forEach((q) => {
        const hit: any = questionsData.filter((d) => {
          return d.id === q.id;
        });

        if (hit) {
          q.description = hit[0].description;
          q.title = hit[0].title;
          q.id = q.id;
          q.status = q.status;
        }
      });
    });

    return response;
  };

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

    const batch = this.db.batch();

    questionSnapshot.forEach(async (doc) => {
      const ref = doc.ref;
      batch.update(ref, {
        title: title,
        description: description,
        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
  };

  public deleteQuestionByQuestionID = async (id: string) => {
    const batch = this.db.batch();

    const questionsSnapshot = await this.db
      .collection('questions')
      .where('id', '==', id)
      .get();

    if (questionsSnapshot.empty) return;

    questionsSnapshot.forEach((doc) => {
      const ref = doc.ref;
      batch.delete(ref);
    });

    const userSnapshot = await this.db.collection('users').get();
    userSnapshot.forEach((doc) => {
      const ref = doc.ref;
      const data = doc.data();

      let updateData: any = [];
      data.questions.forEach((d: any) => {
        if (d.id !== id) {
          updateData.push(d);
        }
      });

      batch.update(ref, { questions: updateData });
    });

    await batch.commit();
  };
}
