import { FireStoreClient } from 'infra/firestore-client';

export const updateQuestion = async (
  questionID: string,
  title: string,
  description: string
) => {
  const firestoreClient = new FireStoreClient();
  await firestoreClient.updateQuestionByQuestionID(
    questionID,
    title,
    description
  );
};
