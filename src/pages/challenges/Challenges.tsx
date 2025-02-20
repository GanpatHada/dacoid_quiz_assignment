import React, { useEffect, useState } from "react";
import "./Challenges.css";
import QuizTracker from "../../cmponents/quiz-tracker/QuizTracker";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { nextQuestion, submitAnswer } from "../../features/quiz/quizSlice";
import QuizTimer from "../../cmponents/quiz-timer/QuizTimer";
import { useNavigate } from "react-router-dom";
import { addQuizAttempt } from "../../services/quizService";

interface QuestionProps {
  question: string;
  currentQuestionIndex: number;
}

interface OptionProps {
  options: string[] | undefined;
  correctAnswer: string;
  selectedAnswer: null | string;
}

const Questions: React.FC<QuestionProps> = ({
  question,
  currentQuestionIndex,
}) => {
  return (
    <section id="questions">
      <div>
        <h5>Question no {currentQuestionIndex + 1}</h5>
        <p>{question}</p>
      </div>
      <QuizTimer questionIndex={currentQuestionIndex} />
    </section>
  );
};

const Options: React.FC<OptionProps> = ({
  options,
  correctAnswer,
  selectedAnswer,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const getAlphabet = (number: number) => {
    if (number === 0) return "A";
    if (number === 1) return "B";
    if (number === 2) return "C";
    if (number === 3) return "D";
  };

  const getSelectedOptionClasses = (option: string) => {
    if (!selectedAnswer) return "";
    else {
      if (option === correctAnswer) return "selected-correct";
      if (option === selectedAnswer) return "selected-incorrect";
    }
  };

  const onQuestionAttempt = (selectedAnswer: string) => {
    dispatch(submitAnswer(selectedAnswer));
  };

  return (
    <section id="options">
      <ol>
        {options?.map((option, index) => {
          return (
            <li
              key={index}
              onClick={() => onQuestionAttempt(option)}
              className={getSelectedOptionClasses(option)}
            >
              <div className="option">{getAlphabet(index)}</div>
              <div className="option-text">{option}</div>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

interface FillupProp {
  currentQuestionIndex: number;
}

const Fillup: React.FC<FillupProp> = ({ currentQuestionIndex }) => {
  const question = useSelector(
    (state: RootState) => state.quiz.questions[state.quiz.currentQuestionIndex]
  );
  const [fillupText, setFillupText] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    setFillupText("");
  }, [currentQuestionIndex]);

  const handleSubmitAnswer = () => {
    dispatch(submitAnswer(fillupText));
  };

  return (
    <>
      <div id="fillup-wrapper">
        <input
          type="text"
          autoFocus={true}
          id="fillup"
          value={fillupText}
          onChange={(e) => setFillupText(e.target.value)}
        />
        {fillupText.trim().length > 0 && (
          <button onClick={handleSubmitAnswer}>Submit</button>
        )}
      </div>
      {question.selectedAnswer && (
        <span>
          {question.markCorrect ? (
            <span style={{ color: "green" }}>Correct</span>
          ) : (
            <>
            <span style={{ color: "red" }}>Wrong  </span>
            <span style={{color:'whitesmoke'}}>correct is {question.correctAnswer}</span>
            </>
          )}
        </span>
      )}
    </>
  );
};

const QuizActions: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const currentQuestionIndex = useSelector(
    (state: RootState) => state.quiz.currentQuestionIndex
  );
  const questionsHistory = useSelector((state: RootState) =>
    state.quiz.questions.map((question) => question.markCorrect)
  );
  const question = useSelector(
    (state: RootState) => state.quiz.questions[state.quiz.currentQuestionIndex]
  );

  const handleNext = async () => {
    if (currentQuestionIndex < 9) dispatch(nextQuestion());
    else {
      try {
        await addQuizAttempt(questionsHistory);
      } catch (error) {
        throw error;
      } finally {
        navigate("/result");
      }
    }
  };
  return (
    <section id="quiz-actions">
      {question.selectedAnswer&&<button id="next-button" onClick={handleNext}>
        Next
      </button>}
    </section>
  );
};

const Challenges: React.FC = () => {
  const { quizQuestion, currentQuestionIndex } = useSelector(
    (state: RootState) => ({
      quizQuestion: state.quiz.questions[state.quiz.currentQuestionIndex],
      currentQuestionIndex: state.quiz.currentQuestionIndex,
    })
  );
  const { question, options, correctAnswer, selectedAnswer, type } =
    quizQuestion;
  return (
    <div id="challenges-page">
      <section id="quiz-questions-options">
        <Questions
          question={question}
          currentQuestionIndex={currentQuestionIndex}
        />
        {type === "MCQ" ? (
          <Options
            options={options}
            correctAnswer={correctAnswer}
            selectedAnswer={selectedAnswer}
          />
        ) : (
          <Fillup currentQuestionIndex={currentQuestionIndex} />
        )}
        <QuizActions />
      </section>
      <QuizTracker />
    </div>
  );
};

export default Challenges;
