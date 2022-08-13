import { FireStoreClient } from 'infra/firestore-client';

export const deleteQuestion = async (questionID: string) => {
  const firestoreClient = new FireStoreClient();
  await firestoreClient.deleteQuestionByQuestionID(questionID);
};
