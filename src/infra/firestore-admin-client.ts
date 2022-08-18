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

      const questionCollection = this.db.collection('questions');
      const qid1 = await questionCollection.doc().get();
      const qid2 = await questionCollection.doc().get();
      const qid3 = await questionCollection.doc().get();

      const questionData1 = {
        id: qid1.id,
        title: '課題1',
        description: '課題1の詳細',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      const questionData2 = {
        id: qid2.id,
        title: '課題2',
        description: '課題2の詳細',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      const questionData3 = {
        id: qid3.id,
        title: '課題3',
        description: '課題3の詳細',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      const questionSnapShot = await questionCollection.get();

      // 既存データの削除
      if (!questionSnapShot.empty) {
        questionSnapShot.docs.map((doc) => {
          batch.delete(doc.ref);
        });
      }

      batch.set(questionCollection.doc(qid1.id), questionData1);
      batch.set(questionCollection.doc(qid2.id), questionData2);
      batch.set(questionCollection.doc(qid3.id), questionData3);

      const userCollection = this.db.collection('users');

      const uid1 = await userCollection.doc().get();
      const uid2 = await userCollection.doc().get();
      const uid3 = await userCollection.doc().get();

      const usersSnapshot = await userCollection.get();

      if (!usersSnapshot.empty) {
        usersSnapshot.docs.map((doc) => {
          batch.delete(doc.ref);
        });
      }

      const userData1 = {
        uid: uid1.id,
        name: 'taro',
        questions: [
          { id: qid1.id, status: '未完了', questionRef: qid1.ref },
          { id: qid2.id, status: '未完了', questionRef: qid2.ref },
          { id: qid3.id, status: '完了', questionRef: qid3.ref },
        ],
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      const userData2 = {
        uid: uid2.id,
        name: 'jiro',
        questions: [
          { id: qid1.id, status: '未完了', questionRef: qid1.ref },
          { id: qid2.id, status: '未完了', questionRef: qid2.ref },
          { id: qid3.id, status: '完了', questionRef: qid3.ref },
        ],
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      const userData3 = {
        uid: uid3.id,
        name: 'sabu',
        questions: [
          { id: qid1.id, status: '未完了', questionRef: qid1.ref },
          { id: qid2.id, status: '未完了', questionRef: qid2.ref },
          { id: qid3.id, status: '完了', questionRef: qid3.ref },
        ],
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      batch.set(userCollection.doc(uid1.id), userData1);
      batch.set(userCollection.doc(uid2.id), userData2);
      batch.set(userCollection.doc(uid3.id), userData3);

      await batch.commit();
    } catch (e: any) {
      throw new Error(`Failed add SeedData ${e}`);
    }
  };
}
