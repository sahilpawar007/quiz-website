import axios from "axios";

//API KEY
const YOUR_API_KEY = "pH5n9HopENUmcp2pYfW6umWIVNrNXlaE8MLhuc3T";

//Type
export type Question={
  answers:{ [key: string]: string | null },
  category:Category,
  correct_answers:{ [key: string]: 'true' | 'false' },
  description:null,
  difficulty:Difficulty,
  explanation:null,
  question:string,
}

export type QuestionState = Question & { answers: string[] };

//Enums
export enum Difficulty {
  SelectDifficulty = 'Select Difficulty',
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}
export enum Category {
  SelectCategory = 'Select Category',
  Linux='Linux',
  Docker='Docker',
  SQL='SQL',
  CMS='CMS',
  Code='Code',
  DevOps='DevOps',
}

//Endpoint
export const fetchQuizQuestions = async (
  category: Category,
  difficulty: Difficulty,
  amount: number,
) => {
  const endPoint = `https://quizapi.io/api/v1/questions?apiKey=${YOUR_API_KEY}&category=${category}&difficulty=${difficulty}&limit=${amount}`;
  const data = await axios.get(endPoint);
  
  return data.data.map((question:Question)=>({
    ...question,
  }))
};
