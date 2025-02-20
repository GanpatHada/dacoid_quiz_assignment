import React, { useState } from "react";
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
  options: string[];
  correctAnswer:string;
  selectedAnswer:null | string;
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
      <QuizTimer questionIndex={currentQuestionIndex}/>
    </section>
  );
};

const Options: React.FC<OptionProps> = ({ options,correctAnswer,selectedAnswer }) => {
  const dispatch=useDispatch<AppDispatch>();
  const getAlphabet=(number:number)=>{
    if(number===0)
      return 'A'
    if(number===1)
      return 'B'
    if(number===2)
      return 'C'
    if(number===3)
      return 'D'
  }

  const getSelectedOptionClasses=(option:string)=>{
    if(!selectedAnswer)
      return "";
    else
    {
      if(option===correctAnswer)
        return "selected-correct"
      if(option===selectedAnswer)
        return "selected-incorrect"
    }
  }

  const onQuestionAttempt=(selectedAnswer:string)=>{
    dispatch(submitAnswer(selectedAnswer));
  }

  return (
    <section id="options">
      <ol>
        {options.map((option,index) => {
          return (
            <li key={index} onClick={()=>onQuestionAttempt(option)} className={getSelectedOptionClasses(option)}>
              <div className="option">{getAlphabet(index)}</div>
              <div className="option-text">{option}</div>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

const QuizActions: React.FC = () => {
  const navigate=useNavigate()
  const dispatch=useDispatch<AppDispatch>();
  const currentQuestionIndex=useSelector((state:RootState)=>state.quiz.currentQuestionIndex);
  const questionsHistory=useSelector((state:RootState)=>state.quiz.questions.map(question=>question.markCorrect))
  const handleNext=async()=>{
     if(currentQuestionIndex<9)
         dispatch(nextQuestion())
     else{
         try {
           await addQuizAttempt(questionsHistory);
         } catch (error) {
          throw error
         }
         finally{
          navigate("/result")
         }
     }
  }
  return (
    <section id="quiz-actions">
      <button id="skip-button">Skip</button>
      <button id="next-button" onClick={handleNext}>Next</button>
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
  const { question, options,correctAnswer,selectedAnswer} = quizQuestion;
  return (
    <div id="challenges-page">
      <section id="quiz-questions-options">
        <Questions
          question={question}
          currentQuestionIndex={currentQuestionIndex}
        />
        <Options options={options} correctAnswer={correctAnswer} selectedAnswer={selectedAnswer} />
        <QuizActions />
      </section>
      <QuizTracker />
    </div>
  );
};

export default Challenges;
