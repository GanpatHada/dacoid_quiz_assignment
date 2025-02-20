import React from "react";
import "./QuizTracker.css";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";

const QuizTracker: React.FC = () => {
  const score=useSelector((state:RootState)=>state.quiz.score)
  return (
    <div id="quiz-tracker">
       <p><strong>score : </strong>{score}/10</p>
    </div>
  );
};

export default QuizTracker;
