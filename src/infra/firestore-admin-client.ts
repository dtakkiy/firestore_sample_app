import '../utils/firebase';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

export class FireStoreAdminClient {
  private readonly db: FirebaseFirestore.Firestore;

  constructor() {
    this.db = getFirestore();
  }

  public addSeedData = async () => {
    try {
      const batch = this.db.batch();

      const questionData1 = {
        id: '1',
        title: '課題1',
        description: '課題1の詳細',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      const questionData2 = {
        id: '2',
        title: '課題2',
        description: '課題2の詳細',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      const questionData3 = {
        id: '3',
        title: '課題3',
        description: '課題3の詳細',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      const userData1 = {
        id: '1',
        name: 'taro',
        questions: [
          //     questionsBelongToUsers: [
          { id: '1', status: '未完了' },
          { id: '2', status: '未完了' },
          { id: '3', status: '完了' },
        ],
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      const userData2 = {
        id: '2',
        name: 'jiro',
        questions: [
          { id: '1', status: '未完了' },
          { id: '2', status: '未完了' },
          { id: '3', status: '完了' },
        ],
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      const userData3 = {
        id: '3',
        name: 'sabu',
        questions: [
          { id: '1', status: '未完了' },
          { id: '2', status: '未完了' },
          { id: '3', status: '完了' },
        ],
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      const questionCollection = this.db.collection('questions');
      const questionSnapShot = await questionCollection.get();

      if (!questionSnapShot.empty) {
        questionSnapShot.forEach((doc) => {
          batch.delete(doc.ref);
        });
      }

      batch.set(questionCollection.doc(), questionData1);
      batch.set(questionCollection.doc(), questionData2);
      batch.set(questionCollection.doc(), questionData3);

      const userCollection = this.db.collection('users');
      const usersSnapshot = await userCollection.get();

      if (!usersSnapshot.empty) {
        usersSnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
      }

      batch.set(userCollection.doc(), userData1);
      batch.set(userCollection.doc(), userData2);
      batch.set(userCollection.doc(), userData3);

      await batch.commit();
    } catch (e: any) {
      throw new Error(`Failed addSeedData ${e}`);
    }
  };
}
