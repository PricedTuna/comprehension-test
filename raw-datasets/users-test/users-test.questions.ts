import type { Questions } from "../../interfaces";

export const users_test_questions: Questions = {
  Lookup: {
    question: "¿Cuál es el salario exacto de la empleada llamada Alice?",
    answer: "95000"
  },
  Aggregation: {
    question: "¿Cuál es el promedio de salario de todos los empleados en el dataset?",
    answer: "91333.33"
  },
  Filtering: {
    question: "Enumera los nombres de los empleados que pertenecen al departamento de 'Engineering'.",
    answer: "Alice, Carol"
  },
  Comparison: {
    question: "¿Qué departamento tiene el salario individual más alto: Sales o Engineering?",
    answer: "Engineering"
  },
  Count: {
    question: "¿Cuántos empleados tienen un salario superior a 90,000?",
    answer: "2"
  }
};