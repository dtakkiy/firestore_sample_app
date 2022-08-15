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

  private readIDs = async (collection: any, ids: any[]) => {
    const reads = ids.map((id) => collection.doc(id).get());
    const result = await Promise.all(reads);
    return result.map((v) => v.data());
  };

  public getQuestionsStatusListByUserID = async (
    userID: string
  ): Promise<User> => {
    let response: User = { name: '', id: '', questions: [] };

    const usersSnapshot = await this.db
      .collection('users')
      .where('id', '==', userID)
      .get();

    if (usersSnapshot.empty) return response;

    const users = usersSnapshot.docs.map((doc) => doc.data());
    if (users.length < 1) return response;

    const questionIds = users[0].questions.map((q: any) => q.id);
    const questionsData = await this.readIDs(
      this.db.collection('questions'),
      questionIds
    );

    response = users[0] as User;
    response.questions = users[0].questions.map((q: any) => {
      const target = questionsData.find((v) => v.id === q.id);
      if (target) {
        return {
          id: q.id,
          title: target.title,
          description: target.description,
          status: q.status,
        };
      }
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
      batch.update(doc.ref, {
        title: title,
        description: description,
        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
  };

  public deleteQuestionByQuestionID = async (id: string) => {
    const batch = this.db.batch();

    try {
      const questionsSnapshot = await this.db
        .collection('questions')
        .where('id', '==', id)
        .get();

      if (questionsSnapshot.empty) return;

      questionsSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      const userSnapshot = await this.db.collection('users').get();
      userSnapshot.forEach((doc) => {
        const data = doc.data();
        const updateQuestions = data.questions.filter((q: any) => q.id !== id);
        batch.update(doc.ref, { questions: updateQuestions });
      });

      await batch.commit();
    } catch (e) {
      console.log(e);
    }
  };
}
