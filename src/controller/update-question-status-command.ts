import { FireStoreClient } from 'infra/firestore-client';

export const updateQuestionStatus = async (userID: string) => {
  const firestoreClient = new FireStoreClient();
  await firestoreClient.updateQuestionStatusToCompleteByUserID(userID);
};
