import '../utils/firebase';
import { Question, QuestionStatus, User } from '../types/data';
import { FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore';

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

    usersSnapshot.docs.map(async (doc) => {
      const data = doc.get('questions');
      const updateData = data.map((q: QuestionStatus) => {
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

  private readIDs = async (
    collection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
    ids: string[]
  ) => {
    const reads = ids.map((id) => collection.doc(id).get());
    const result = await Promise.all(reads);
    return result.map((v) => v.data());
  };

  public getQuestionsStatusListByUserID = async (
    userID: string
  ): Promise<User> => {
    let response: User = {
      name: '',
      id: '',
      questions: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const usersSnapshot = await this.db
      .collection('users')
      .where('id', '==', userID)
      .get();

    if (usersSnapshot.empty) return response;

    const users = usersSnapshot.docs.map((doc) => doc.data());
    if (users.length < 1) return response;

    const questionIds = users[0].questions.map((q: QuestionStatus) => q.id);
    const questionsData = await this.readIDs(
      this.db.collection('questions'),
      questionIds
    );

    response = users[0] as User;
    response.questions = users[0].questions.map((q: QuestionStatus) => {
      const target = questionsData.find((v: any) => v.id === q.id);
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
    title?: string,
    description?: string
  ) => {
    const questionSnapshot = await this.db
      .collection('questions')
      .where('id', '==', id)
      .get();

    if (questionSnapshot.empty) return;

    const batch = this.db.batch();

    const data = {
      title: title,
      description: description,
      updatedAt: FieldValue.serverTimestamp(),
    };

    questionSnapshot.docs.map(async (doc) => {
      batch.update(doc.ref, data);
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

      questionsSnapshot.docs.map((doc) => {
        batch.delete(doc.ref);
      });

      const userSnapshot = await this.db.collection('users').get();
      userSnapshot.docs.map((doc) => {
        const data = doc.data();
        const updateQuestions = data.questions.filter(
          (q: Question) => q.id !== id
        );
        batch.update(doc.ref, { questions: updateQuestions });
      });

      await batch.commit();
    } catch (e) {
      console.log(e);
    }
  };
}
