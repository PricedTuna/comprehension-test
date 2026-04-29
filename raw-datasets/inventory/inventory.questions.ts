import type { Questions } from "../../interfaces";

export const inventoryQuestions: Questions = {
  Lookup: "¿Cuál es el SKU asignado al 'Mouse Inalámbrico'?",
  Aggregation: "¿Cuál es el valor total del inventario (precio * stock) sumando los tres artículos?",
  Filtering: "¿Qué artículos tienen menos de 20 unidades en stock?",
  Comparison: "¿Cuál es el artículo más caro de la lista?",
  Count: "¿Cuántos artículos diferentes tienen un stock superior a 10 unidades?"
};