import type { Questions } from "../../interfaces";

export const inventoryQuestions: Questions = {
  Lookup: {
    question: "¿Cuál es el SKU asignado al 'Mouse Inalámbrico'?",
    answer: "MO-01"
  },
  Aggregation: {
    question: "¿Cuál es el valor total del inventario (precio * stock) sumando los tres artículos?",
    answer: "3172.50"
  },
  Filtering: {
    question: "¿Qué artículos tienen menos de 20 unidades en stock?",
    answer: "Teclado Mecánico, Monitor 24 pulg"
  },
  Comparison: {
    question: "¿Cuál es el artículo más caro de la lista?",
    answer: "Monitor 24 pulg"
  },
  Count: {
    question: "¿Cuántos artículos diferentes tienen un stock superior a 10 unidades?",
    answer: "2"
  }
};