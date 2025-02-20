import { useEffect, useState } from "react";
import "./Result.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { resetQuiz } from "../../features/quiz/quizSlice";
import { useNavigate } from "react-router-dom";
import {getAllQuizAttempts } from "../../services/quizService";

const ResultContent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { score, questions }= useSelector((state: RootState) => state.quiz);
  const { correct, incorrect } = questions.reduce(
    (acc, cur) => {
      if (cur.markCorrect) acc.correct += 1;
      else acc.incorrect += 1;
      return acc;
    },
    { correct: 0, incorrect: 0 }
  );

  const handleRetakeTest = () => {
    dispatch(resetQuiz());
    navigate("/");
  };

  const getPercentage =(marks:number):number=>(marks/10)*100 

  return (
    <div id="result-content">
      <div>
        <div id="result-break-down">
          <p><strong>Total questions : </strong>10</p>
          <p><strong>Total Marks : </strong>10 <span>(one mark each)</span></p>
          <p><strong>Marks Obtained : </strong>{score}</p>
          <p><strong>Correct : </strong>{correct}</p>
          <p><strong>Incorrect : </strong>{incorrect}</p>
        </div>
        <button onClick={handleRetakeTest} id="retry-button">Retake Quiz test</button>
      </div>
      <div id="result-graph-wrapper" style={{ background: `conic-gradient(cyan ${getPercentage(score)}%, #00ffff73 ${getPercentage(score)}% 100%)` }}>
        <div id="result-graph">
          <span>{getPercentage(score)}%</span>
        </div>
      </div>
    </div>
  );
};

interface Attempts {
  uniqueId: string;
  attemptHistory: boolean[];
  time: number;
}

const Attempts = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<Attempts[]>([]);
  useEffect(() => {
    const getAllAttempts = async () => {
      setLoading(true);
      try {
        const attemptsList = await getAllQuizAttempts();
        setAttempts(attemptsList);
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    };

    getAllAttempts();
  }, []);

  const calculateScore=(history:boolean[])=>history.reduce((acc:number,cur:boolean)=>{
    if(cur)
      acc+=1
    return acc
  },0) 

  const getIst=(time:number)=>{
    return new Date(time).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }).split(",");

  }

  return (
    <div id="attempts-wrapper">
      {loading?<p>Loading ....</p>:<>
      {attempts.length===0?<p>No attempts History available</p>:
      attempts.map((attempt,index) => {
        return (
          <div key={attempt.uniqueId}>
            <header>{`Attempt ${attempts.length-1-index+1}`}</header>
            <main>{calculateScore(attempt.attemptHistory)}</main>
            <footer>
              <p><strong>Date : </strong>{getIst(attempt.time)[0]}</p>
              <p><strong>Time : </strong>{getIst(attempt.time)[1]}</p>
            </footer>
          </div>
        );
      })}
      </>}
    </div>
  );
};

const Result = () => {
  return (
    <div id="result-page">
      <section id="score-section">
        <ResultContent />
      </section>
      <section id="my-attempts">
        <Attempts />
      </section>
    </div>
  );
};

export default Result;
