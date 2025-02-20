import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import quizData from "../../data/quiz.json";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  selectedAnswer: string | null;
  type: string;
  markCorrect:boolean;

}
interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  score:number
}


const getInitialState = (): QuizState => ({
  questions: quizData.map((q) => ({
    ...q,
    selectedAnswer: null,
    markCorrect: false,
  })),
  currentQuestionIndex: 0,
  score:0
});



const quizSlice = createSlice({
  name: "quiz",
  initialState:getInitialState(),
  reducers: {
    nextQuestion(state) {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      } else {
        state.currentQuestionIndex = 0;
      }
    },
    submitAnswer(state, action: PayloadAction<string>) {
        const answer = action.payload;
        const currentQuestion = state.questions[state.currentQuestionIndex];
        state.questions[state.currentQuestionIndex].selectedAnswer=answer;
        if (answer === currentQuestion.correctAnswer) {
          state.questions[state.currentQuestionIndex].markCorrect=true;
          state.score+=1;
        }
        else
          state.questions[state.currentQuestionIndex].markCorrect=false;
        
    },
    resetQuiz(state) {
      Object.assign(state,getInitialState());
      },
  },
});

export const { nextQuestion, submitAnswer, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;
