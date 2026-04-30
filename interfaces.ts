export interface ObjectNotation {
  name: string;
  systemInstruction: string;
  datasets: Dataset[];
}

export interface Dataset {
  name: string;
  data: string;
  questions: Questions;
}

export interface Questions {
  Lookup: Question;
  Aggregation: Question;
  Filtering: Question;
  Comparison: Question;
  Count: Question;
}

export interface Question {
  question: string;
  answer: string;
}
