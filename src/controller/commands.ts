import { program } from 'commander';
import { deleteQuestion } from './delete-question-command';
import { getQuestionStatusList } from './get-question-status-list-command';
import { updateQuestion } from './update-question-command';
import { updateQuestionStatus } from './update-question-status-command';

export const commands = async () => {
  program.parse(process.argv);
  if (program.args.length < 2) {
    throw new Error(
      'The number of arguments on the command line is incorrect.'
    );
  }

  const command = program.args[0];

  if (command === 'update-question-status') {
    const userID = program.args[1];
    updateQuestionStatus(userID);
  }

  if (command === 'get-question-status-list') {
    const userID = program.args[1];
    getQuestionStatusList(userID);
  }

  if (command === 'update-question') {
    if (program.args.length < 4) {
      throw new Error(
        'The number of arguments on the command line is incorrect.'
      );
    }
    const questionID = program.args[1];
    const title = program.args[2];
    const description = program.args[3];

    updateQuestion(questionID, title, description);
  }

  if (command === 'delete-question') {
    const questionID = program.args[1];
    deleteQuestion(questionID);
  }
};
