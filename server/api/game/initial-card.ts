import { defineEventHandler } from "h3";

function generateInitialCard() {
  return {
    suit: Math.floor(Math.random() * 4),
    value: Math.floor(Math.random() * 13),
  };
}

export default defineEventHandler(async () => {
  return generateInitialCard();
});
