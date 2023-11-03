import React, { useState } from "react";

//CSS
import "./App.css";

//Components
import QuestionCard from "./components/QuestionCard";
import { Category, Difficulty, QuestionState, fetchQuizQuestions } from "./Api";
import Loading from "./components/Loading";

//Total Number
const TOTAL_NUMBER: number = 10;

export type AnswerObject = {
  question: string;
  answer: string;
  isCorrect: boolean;
  correctAnswer: string[];
};

function App() {
  const [loading, setLoading] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>();
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [score, setScore] = useState(0);
  const [number, setNumber] = useState(0);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [gameOver, setGameOver] = useState(true);

  const startQuiz = async () => {
    setLoading(!loading);
    setGameOver(!gameOver);

    const newQuestions = await fetchQuizQuestions(
      selectedCategory as Category,
      selectedDifficulty as Difficulty,
      TOTAL_NUMBER
    );

    setQuestions(newQuestions);
    setScore(0);
    setNumber(0);
    setUserAnswers([]);
    setLoading(false);
  };

  const handleCategorySelection = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedCategoryValue = event.target.value as Category;
    setSelectedCategory(selectedCategoryValue);
  };

  const handleDifficultySelection = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedDifficultyValue = event.target.value as Difficulty;
    setSelectedDifficulty(selectedDifficultyValue);
  };


  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      //chosen answer
      const answer = e.currentTarget.value;
      console.log("selected answer :", answer);


      // correct answers object
      const correctAnswersObject = questions[number].correct_answers;

      //correct answer
      const correctAnswer = Object.entries(correctAnswersObject)
        .filter(([, value]) => value === "true")
        .map(([key]) => key.replace("_correct", ""));

      console.log("correct answer is :", correctAnswer);


      //does user's answer and correct answer match
      const isCorrect = correctAnswer.includes(answer);

      console.log("is answer correct :", isCorrect);


      if (isCorrect) setScore((prev) => prev + 1);

      const answerObject = {
        question: questions[number].question,
        answer: answer,
        isCorrect,
        correctAnswer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    const nextQuestion = number + 1;
    if (nextQuestion === TOTAL_NUMBER) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  };

  return (
    <>
      <div className="App">
        {/* Header */}
        <div className="header">
          <h1>Welcome to the Quiz!</h1>
        </div>
        {/* Loading */}
        {loading && <Loading />}
        {gameOver || userAnswers.length > TOTAL_NUMBER ? (
          <div className="Starter">
            {/* Category */}
            <select
              className="selectOption"
              title="Category"
              value={selectedCategory}
              onChange={handleCategorySelection}
            >
              {Object.values(Category).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {/* Difficulty */}
            <select
              className="selectOption"
              title="Difficulty"
              value={selectedDifficulty}
              onChange={handleDifficultySelection}
            >
              {Object.values(Difficulty).map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
            {/* Start */}
            <button
              className="start"
              disabled={
                !selectedCategory ||
                !selectedDifficulty ||
                selectedCategory === Category.SelectCategory ||
                selectedDifficulty === Difficulty.SelectDifficulty
              }
              onClick={() => startQuiz()}
            >
              Start
            </button>
          </div>
        ) : null}
        {!gameOver && !loading ? (
          <div>
            {/* Score */}
            <p className="score">Score : {score}</p>
            {/* QuestionCard */}
            <QuestionCard
              question={questions[number] ? questions[number].question : ""}
              answers={questions[number] ? questions[number].answers : {}}
              callback={checkAnswer}
              userAnswer={userAnswers ? userAnswers[number] : undefined}
              questionNum={number + 1}
              totalQuestions={TOTAL_NUMBER}
            />
          </div>
        ) : null}
        <div className="footButton">
          {/* Next Question */}
          {userAnswers.length === number + 1 &&
            userAnswers.length < TOTAL_NUMBER ? (
            <button className="nextQuestion" onClick={nextQuestion}>
              Next Question
            </button>
          ) : null}
          {/* Restart */}
          {userAnswers.length === TOTAL_NUMBER ? (
            <button className="resetQuiz" onClick={startQuiz}>
              Start New Quiz
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default App;
