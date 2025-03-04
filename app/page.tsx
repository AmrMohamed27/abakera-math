"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  Clock,
  Divide,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Settings,
  Shuffle,
  X,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProblemType, Range } from "@/types";

export default function Home() {
  // State for the practice session
  const [problemType, setProblemType] = useState<ProblemType>("Random");
  const [timerDuration, setTimerDuration] = useState(30);
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentProblem, setCurrentProblem] = useState({
    question: "12 + 8",
    answer: 20,
  });
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<null | {
    correct: boolean;
    message: string;
  }>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const generateProblem = () => {
    const TenRange: Range = { min: 3, max: 10 };
    const HundredRange: Range = { min: 3, max: 100 };
    const ThousandRange: Range = { min: 100, max: 300 };
    const TwoThousandRange: Range = { min: 100, max: 2000 };

    const generateNumber = (range: Range) =>
      Math.floor(Math.random() * (range.max - range.min)) + range.min;

    let question = "";
    let answer = 0;

    switch (problemType) {
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
        const num3 = generateNumber(HundredRange);
        const num4 = generateNumber(TenRange);
        const num5 = generateNumber(HundredRange);
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
        const num1 = generateNumber(
          randomChance ? ThousandRange : HundredRange
        );
        const num2 = generateNumber(
          !randomChance ? ThousandRange : HundredRange
        );
        const num3 = generateNumber(HundredRange);
        const num4 = generateNumber(HundredRange);
        const num5 = generateNumber(HundredRange);
        const num6 = generateNumber(TenRange);
        const div1 = Math.floor(Math.random() * 20) + 2;
        const div2 = Math.floor(Math.random() * 20) + 2;

        // Ensure clean division
        const cleanNum1 = Math.ceil((randomChance ? num1 : num2) / div1) * div1;
        const dirtyNum1 = randomChance ? num2 : num1;
        const cleanNum3 = Math.ceil(num3 / div2) * div2;

        const op1 = Math.random() > 0.5 ? "+" : "-";
        const op2 = Math.random() > 0.5 ? "+" : "-";

        question = `${cleanNum1} × ${dirtyNum1} / ${div1} ${op1} ${cleanNum3} × ${num4} / ${div2} ${op2} ${num5} × ${num6}`;

        const part1 = Math.floor((cleanNum1 * dirtyNum1) / div1);
        const part2 = Math.floor((cleanNum3 * num4) / div2);
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

      default:
        question = "Error";
        answer = 0;
    }

    setCurrentProblem({ question, answer });
    setUserAnswer("");
    setFeedback(null);
    setTimeLeft(timerDuration);
    setIsTimerRunning(true);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle user submission
  const handleSubmit = () => {
    const userNum = Number.parseFloat(userAnswer);

    if (isNaN(userNum)) {
      setFeedback({ correct: false, message: "Please enter a valid number" });
      return;
    }

    const isCorrect = Math.abs(userNum - currentProblem.answer) < 0.001;

    setFeedback({
      correct: isCorrect,
      message: isCorrect
        ? "Correct!"
        : `Incorrect. The answer is ${currentProblem.answer}`,
    });

    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    setStreak((prev) => (isCorrect ? prev + 1 : 0));

    // Generate a new problem after a short delay
    setTimeout(() => {
      generateProblem();
    }, 1500);
  };

  // Handle timer expiration
  const handleTimeUp = useCallback(() => {
    setIsTimerRunning(false);
    setFeedback({
      correct: false,
      message: `Time's up! The answer is ${currentProblem.answer}`,
    });
    alert("Time is up!");

    setScore((prev) => ({
      ...prev,
      total: prev.total + 1,
    }));

    setStreak(0);
  }, [currentProblem, setFeedback, setScore, setStreak]);

  const togglePause = useCallback(() => {
    setIsTimerRunning((prev) => !prev);
  }, []);

  // Handle key press for Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  // Start a new practice session
  const startNewSession = () => {
    setScore({ correct: 0, total: 0 });
    setStreak(0);
    generateProblem();
  };

  // Calculate timer percentage for progress bar
  const timerPercentage = (timeLeft / timerDuration) * 100;

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isTimerRunning && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      handleTimeUp();
    }

    return () => clearTimeout(timer);
  }, [timeLeft, isTimerRunning, handleTimeUp]);

  return (
    <div className="bg-[#051a33] min-h-screen text-white">
      {/* Header */}
      <header className="mx-auto py-4 container">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-JUXHbfwFNgV5y9BYwhXoWCuAMlutew.png"
              alt="The Geniuses Logo"
              width={120}
              height={48}
              className="object-contain"
            />
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-gray-300 text-sm">
              Score:{" "}
              <span className="font-bold text-[#4cc9ff]">
                {score.correct}/{score.total}
              </span>
            </div>
            <div className="text-gray-300 text-sm">
              Streak: <span className="font-bold text-[#4cc9ff]">{streak}</span>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-[#4cc9ff]/50"
                >
                  <Settings className="w-5 h-5 text-[#4cc9ff]" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0a2a4a] border-[#4cc9ff]/30">
                <DialogHeader>
                  <DialogTitle>Practice Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label>Timer Duration: {timerDuration} seconds</Label>
                    <Input
                      value={timerDuration}
                      onChange={(e) => {
                        setTimerDuration(Number(e.target.value));
                      }}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="mx-auto py-8 container">
        <div className="mx-auto">
          {/* Problem Type Selector */}
          <div className="mb-8">
            <Tabs
              defaultValue="Random"
              value={problemType}
              onValueChange={(value: string) =>
                setProblemType(value as ProblemType)
              }
              className="w-full"
            >
              <TabsList className="grid grid-cols-6 bg-[#0a2a4a]">
                <TabsTrigger
                  value="Random"
                  className="data-[state=active]:bg-[#4cc9ff] data-[state=active]:text-[#051a33]"
                >
                  <Shuffle className="mr-1 w-4 h-4" />
                  Random
                </TabsTrigger>
                <TabsTrigger
                  value="Add Three Numbers"
                  className="data-[state=active]:bg-[#4cc9ff] data-[state=active]:text-[#051a33]"
                >
                  <Plus className="mr-1 w-4 h-4" />
                  Add Three Numbers
                </TabsTrigger>
                <TabsTrigger
                  value="Multiply Two Numbers"
                  className="data-[state=active]:bg-[#4cc9ff] data-[state=active]:text-[#051a33]"
                >
                  <X className="mr-1 w-4 h-4" />
                  Multiply Two Numbers
                </TabsTrigger>
                <TabsTrigger
                  value="Multiply and Divide"
                  className="data-[state=active]:bg-[#4cc9ff] data-[state=active]:text-[#051a33]"
                >
                  <Divide className="mr-1 w-4 h-4" />
                  Multiply and Divide
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Problem Card */}
          <Card className="bg-[#0a2a4a] shadow-lg mb-8 border-[#4cc9ff]/30">
            <CardContent className="p-8">
              {/* Timer */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#4cc9ff]" />
                    <span className="font-bold">{timeLeft} seconds</span>
                  </div>
                </div>
                <div className="bg-[#051a33] rounded-full w-full h-2 overflow-hidden">
                  <div
                    className="bg-[#4cc9ff] h-full transition-all duration-1000 ease-linear"
                    style={{ width: `${timerPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Problem Display */}
              <div className="mb-8 text-center">
                <div className="mb-8 font-bold text-4xl md:text-6xl">
                  {currentProblem.question}
                </div>
                <div className="flex items-center gap-4 mx-auto max-w-md">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter your answer"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="bg-[#051a33] py-6 border-[#4cc9ff]/30 text-xl text-center"
                    disabled={!isTimerRunning || !!feedback}
                  />
                  <Button
                    onClick={handleSubmit}
                    className="bg-[#4cc9ff] hover:bg-[#7ad7ff] px-8 py-6 text-[#051a33]"
                    disabled={!isTimerRunning || !!feedback}
                  >
                    Submit
                  </Button>
                </div>
              </div>

              {/* Feedback */}
              {feedback && (
                <div
                  className={`text-center p-4 rounded-lg mb-6 ${
                    feedback.correct
                      ? "bg-green-500/20 text-green-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  <div className="flex justify-center items-center gap-2">
                    {feedback.correct ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <XCircle className="w-6 h-6" />
                    )}
                    <span className="text-lg">{feedback.message}</span>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <div className="flex flex-row justify-center items-center gap-4">
                <Button
                  onClick={startNewSession}
                  className="flex items-center gap-2 bg-[#0a2a4a] hover:bg-[#4cc9ff] border border-[#4cc9ff] text-[#4cc9ff] hover:text-[#051a33] cursor-pointer"
                  size="lg"
                >
                  <RefreshCw className="w-5 h-5" aria-label="Generate Icon" />
                  Generate New Problem
                </Button>
                <Button
                  onClick={togglePause}
                  className="flex items-center gap-2 bg-[#0a2a4a] hover:bg-[#4cc9ff] border border-[#4cc9ff] text-[#4cc9ff] hover:text-[#051a33] cursor-pointer"
                  size="lg"
                >
                  {isTimerRunning ? (
                    <Pause className="w-5 h-5" aria-label="Pause Timer" />
                  ) : (
                    <Play className="w-5 h-5" aria-label="Pause Timer" />
                  )}
                  {isTimerRunning ? "Pause Timer" : "Resume Timer"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
