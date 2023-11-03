import React from "react";
import { AnswerObject } from "../App";
import "./QuestionCard.css"

type Props = {
  question: string;
  answers: { [key: string]: string | null };
  callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
  userAnswer: AnswerObject | undefined;
  questionNum: number;
  totalQuestions: number;
};

const QuestionCard: React.FC<Props> = ({
  question,
  answers,
  callback,
  userAnswer,
  questionNum,
  totalQuestions,
}) => {
  return (
    <div className="answerContainer">
      <p className="number">
        Question : {questionNum}/{totalQuestions}
      </p>

      <p className="question" dangerouslySetInnerHTML={{ __html: question }} />

      <div className="answerButtons">
        {Object.entries(answers).map(([answerKey, answerText]) => {
          if (answerText) {
            return (
              // Use an IIFE to handle the logic
              (() => {
                let answerButton = "";
                if (userAnswer) {
                  if (answerKey === userAnswer.answer) {
                    answerButton = "selected";
                  }
                  if (answerKey === userAnswer.correctAnswer[0]) {
                    answerButton =  "correct";
                  }
                  if (answerKey === userAnswer.answer && !userAnswer.isCorrect) {
                    answerButton = "incorrect";
                  }
                }

            return (
              <div key={answerKey} className="buttonWrapper">
                <button
                  title="button"
                  disabled={!!userAnswer}
                  value={answerKey} // This will be "answer_a", "answer_b", etc.
                  onClick={callback}
                  className={answerButton}
                >
                  {answerText}
                </button>
              </div>
            );
          }))()
          
          return null;

        }
      })}
      </div>
    </div>
  );
};

export default QuestionCard;
