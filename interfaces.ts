export interface ObjectNotation {
  /**
  * Define el sistema de instrucciones para que Gemini entienda JTON/TRON.
  * Basado en la guía de integración de TRON v3.2.
  */
  systemInstruction: string;

  datasets: Dataset[];
}

export interface Dataset {
  /**
  * Ejemplo de Dataset en formato JTON Zen Grid (Employee Records)
  */
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
