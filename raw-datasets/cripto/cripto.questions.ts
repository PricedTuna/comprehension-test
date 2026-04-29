import type { Questions } from "../../interfaces";

export const criptoQuestions: Questions = {
  Lookup: {
    question: "¿Cuál fue el cambio porcentual (change_24h) de Bitcoin (BTC)?",
    answer: "-1.2"
  },
  Aggregation: {
    question: "¿Cuál es el precio promedio en USD de las tres criptomonedas listadas?",
    answer: "22598.33"
  },
  Filtering: {
    question: "Menciona los nombres de las criptomonedas que tuvieron un cambio positivo (mayor a 0) en las últimas 24h.",
    answer: "ETH, SOL"
  },
  Comparison: {
    question: "Entre Ethereum y Solana, ¿cuál tiene el precio por unidad más bajo?",
    answer: "SOL"
  },
  Count: {
    question: "¿Cuántas criptomonedas en la lista tienen un precio superior a los 1,000 USD?",
    answer: "2"
  }
};