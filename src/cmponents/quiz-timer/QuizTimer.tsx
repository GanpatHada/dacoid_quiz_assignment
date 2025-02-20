import React, { useEffect, useState } from 'react'
import './QuizTimer.css'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { nextQuestion } from '../../features/quiz/quizSlice';
import { useNavigate } from 'react-router-dom';

interface QuizTimerProps {
    questionIndex: number;
  }
  
const QuizTimer:React.FC<QuizTimerProps>= ({questionIndex}) => {
  const dispatch=useDispatch<AppDispatch>();
  const totalTime=30  
  const[counter,setCounter]=useState(totalTime);
  const navigate=useNavigate()
  const progress = (counter/30)*100;
  const getColor=()=>{
    if(counter>15)
        return '#82df00'
    if(counter>5 && counter<=15)
        return '#ff7d00'
    if(counter>=0 && counter<=5)
        return 'red'
  }
  useEffect(() => {
    setCounter(totalTime);
    const timer = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if(questionIndex<9)
             dispatch(nextQuestion())
          else
            navigate("/result")   
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questionIndex]);
  return (
    <div id='quiz-timer'  style={{ background: `conic-gradient(${getColor()} ${progress}%, #ffffff5c ${progress}% 100%)` }}>
         <span id='timer-countdown'>{counter}</span>
    </div>
  )
}

export default QuizTimer
