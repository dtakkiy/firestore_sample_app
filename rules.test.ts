import * as firebase from '@firebase/testing';
import * as fs from 'fs';
import { randomID } from './src/utils/identifier';

const projectID = 'praha-challenge-c76b4';
const databaseName = 'firestore';
const rules = fs.readFileSync('./firestore.rules', 'utf-8');

const adminDB = firebase.initializeAdminApp({
  projectId: projectID,
  databaseName,
});

type Auth = {
  uid?: string;
  [key: string]: any;
};

const clientDB = (auth?: Auth) =>
  firebase
    .initializeTestApp({ projectId: projectID, databaseName, auth })
    .firestore();

const serverTimestamp = () => {
  return firebase.firestore.FieldValue.serverTimestamp();
};

beforeAll(async () => {
  await firebase.loadFirestoreRules({ projectId: projectID, rules });
});

beforeEach(async () => {
  await firebase.clearFirestoreData({ projectId: projectID });
});

afterAll(async () => {
  await Promise.all(firebase.apps().map((app) => app.delete()));
});

describe('write test case ', () => {
  describe('create user', () => {
    it('users 作成できる', async () => {
      const userID = randomID();
      const db = clientDB({ uid: userID });

      await firebase.assertSucceeds(
        db.collection('users').doc(userID).set({
          name: 'shiro',
          id: userID,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });

    it('空のデータの場合', async () => {
      const userID = randomID();
      const db = clientDB({ uid: userID });

      await firebase.assertFails(db.collection('users').doc(userID).set({}));
    });

    it('nameの文字数が多い場合', async () => {
      const userID = randomID();
      const db = clientDB({ uid: userID });

      await firebase.assertFails(
        db.collection('users').doc(userID).set({
          name: '111111111100000000002222222222333',
          id: '123',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    });
  });

  // describe('create question', () => {
  //   it('作成できる', async () => {
  //     const questionID = randomID();
  //     const userID = randomID();
  //     const db = clientDB({ uid: userID });

  //     await firebase.assertSucceeds(
  //       db.collection('questions').doc(questionID).set({
  //         title: '1234',
  //         description: '5678',
  //         id: questionID,
  //         createdAt: serverTimestamp(),
  //         updatedAt: serverTimestamp(),
  //       })
  //     );
  //   });
  // });
});
