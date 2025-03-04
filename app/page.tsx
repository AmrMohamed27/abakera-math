"use client";

import type React from "react";

import DurationSetter from "@/components/DurationSetter";
import Header from "@/components/Header";
import ProblemSelector from "@/components/ProblemSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { problemGenerator } from "@/lib/utils";
import { ProblemType, Score } from "@/types";
import {
  BookOpenCheck,
  CheckCircle,
  Clock,
  Pause,
  Play,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Home() {
  // State for the practice session
  const [problemType, setProblemType] = useState<ProblemType>("Random");
  const [timerDuration, setTimerDuration] = useState(15);
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
  const [score, setScore] = useState<Score>({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const generateProblem = useCallback(() => {
    const { question, answer } = problemGenerator({ problemType });
    setCurrentProblem({ question, answer });
    setUserAnswer("");
    setFeedback(null);
    setTimeLeft(timerDuration);
    setIsTimerRunning(true);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [problemType, timerDuration]);

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
  const handleTimeUp = useCallback(
    ({ noAlert }: { noAlert?: boolean }) => {
      setIsTimerRunning(false);
      setFeedback({
        correct: false,
        message: `Time's up! The answer is ${currentProblem.answer}`,
      });
      if (!noAlert) {
        alert("Time is up!");
      }

      setScore((prev) => ({
        ...prev,
        total: prev.total + 1,
      }));

      setStreak(0);
    },
    [currentProblem, setFeedback, setScore, setStreak]
  );

  const togglePause = useCallback(() => {
    setIsTimerRunning((prev) => !prev);
  }, []);

  // Generate a random problem on mount
  useEffect(() => {
    generateProblem();
    togglePause();
  }, [generateProblem, togglePause]);

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
      handleTimeUp({ noAlert: false });
    }

    return () => clearTimeout(timer);
  }, [timeLeft, isTimerRunning, handleTimeUp]);

  const handleShowAnswer = () => {
    setIsTimerRunning(false);
    setTimeLeft(0);
    handleTimeUp({ noAlert: true });
  };

  return (
    <div className="bg-[#051a33] min-h-screen text-white">
      {/* Header */}
      <Header score={score} streak={streak} />

      <main className="mx-auto py-8 container">
        <div className="mx-auto">
          {/* Problem Type Selector */}
          <ProblemSelector
            problemType={problemType}
            handleProblemTypeChange={(value: string) =>
              setProblemType(value as ProblemType)
            }
          />
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
                <p
                  className="mb-8 font-bold text-xl sm:text-3xl md:text-4xl lg:text-6xl"
                  aria-label="Current Question"
                >
                  {currentProblem.question}
                </p>
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
                    className="bg-[#4cc9ff] hover:bg-[#7ad7ff] px-8 py-6 text-[#051a33] cursor-pointer"
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
              <div className="flex flex-row flex-wrap *:max-md:flex-1 justify-center items-center gap-4">
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
                  {isTimerRunning ? "Pause Timer" : "Start Timer"}
                </Button>
                <Button
                  className="flex items-center gap-2 bg-[#0a2a4a] hover:bg-[#4cc9ff] border border-[#4cc9ff] text-[#4cc9ff] hover:text-[#051a33] cursor-pointer"
                  disabled={!isTimerRunning}
                  onClick={handleShowAnswer}
                  size="lg"
                >
                  <BookOpenCheck className="w-5 h-5" aria-label="Show Answer" />
                  Show Answer
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* Duration Setting */}
          <DurationSetter
            onChange={(value) => setTimerDuration(value)}
            timeLeft={timeLeft}
            timerDuration={timerDuration}
            isTimerRunning={isTimerRunning}
          />
        </div>
      </main>
    </div>
  );
}
