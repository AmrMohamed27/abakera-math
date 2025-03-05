import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ProblemType, Range } from "../types/index";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const problemGenerator = ({
  problemType,
}: {
  problemType: ProblemType;
}) => {
  const TenRange: Range = { min: 3, max: 10 };
  const thirtyRange: Range = { min: 3, max: 30 };
  const HundredRange: Range = { min: 3, max: 100 };
  const ThousandRange: Range = { min: 100, max: 300 };
  const TwoThousandRange: Range = { min: 100, max: 2000 };

  const generateNumber = (range: Range) =>
    Math.floor(Math.random() * (range.max - range.min)) + range.min;

  let question = "";
  let answer = 0;

  const randomizer = Math.random();
  const resolvedProblemType =
    problemType === "Random"
      ? randomizer < 0.3
        ? "Add Three Numbers"
        : randomizer < 0.6
        ? "Multiply Two Numbers"
        : "Multiply and Divide"
      : problemType;

  switch (resolvedProblemType) {
    case "Add Three Numbers": {
      const num1 = generateNumber(TwoThousandRange);
      const num2 = generateNumber(ThousandRange);
      const num3 = generateNumber(ThousandRange);

      // Randomly choose between addition and subtraction
      const op1 = Math.random() > 0.5 ? "+" : "-";
      const op2 = Math.random() > 0.5 ? "+" : "-";

      question = `${num1} ${op1} ${num2} ${op2} ${num3}`;

      // Calculate answer based on operators
      answer =
        op1 === "+"
          ? op2 === "+"
            ? num1 + num2 + num3
            : num1 + num2 - num3
          : op2 === "+"
          ? num1 - num2 + num3
          : num1 - num2 - num3;
      break;
    }

    case "Multiply Two Numbers": {
      const num1 = generateNumber(HundredRange);
      const num2 = generateNumber(HundredRange);
      const num3 = generateNumber(thirtyRange);
      const num4 = generateNumber(TenRange);
      const num5 = generateNumber(thirtyRange);
      const num6 = generateNumber(TenRange);

      const op1 = Math.random() > 0.5 ? "+" : "-";
      const op2 = Math.random() > 0.5 ? "+" : "-";

      question = `${num1} × ${num2} ${op1} ${num3} × ${num4} ${op2} ${num5} × ${num6}`;

      const part1 = num1 * num2;
      const part2 = num3 * num4;
      const part3 = num5 * num6;

      answer =
        op1 === "+"
          ? op2 === "+"
            ? part1 + part2 + part3
            : part1 + part2 - part3
          : op2 === "+"
          ? part1 - part2 + part3
          : part1 - part2 - part3;
      break;
    }

    case "Multiply and Divide": {
      const randomChance = Math.random() > 0.5;
      const num1 = generateNumber(randomChance ? ThousandRange : thirtyRange);
      const num2 = generateNumber(!randomChance ? ThousandRange : thirtyRange);
      const num3 = generateNumber(HundredRange);
      const num4 = generateNumber(thirtyRange);
      const div1 = Math.floor(Math.random() * 20) + 2;
      const div2 = Math.floor(Math.random() * 20) + 2;

      // Ensure clean division
      const cleanNum1 = Math.ceil((randomChance ? num1 : num2) / div1) * div1;
      const dirtyNum1 = randomChance ? num2 : num1;
      const cleanNum3 = Math.ceil(num3 / div2) * div2;

      const op1 = Math.random() > 0.5 ? "+" : "-";

      question = `${cleanNum1} × ${dirtyNum1} / ${div1} ${op1} ${cleanNum3} × ${num4} / ${div2}`;

      const part1 = Math.floor((cleanNum1 * dirtyNum1) / div1);
      const part2 = Math.floor((cleanNum3 * num4) / div2);

      answer = op1 === "+" ? part1 + part2 : part1 - part2;
      break;
    }

    default:
      question = "Error";
      answer = 0;
  }
  return {
    question,
    answer,
  };
};
