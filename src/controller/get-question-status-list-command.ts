import { FireStoreClient } from 'infra/firestore-client';

export const getQuestionStatusList = async (userID: string) => {
  const firestoreClient = new FireStoreClient();
  await firestoreClient.getQuestionsStatusListByUserID(userID);
};
