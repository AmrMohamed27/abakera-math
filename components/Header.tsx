import { Score } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  score: Score;
  streak: number;
};

const Header = ({ score, streak }: Props) => {
  return (
    <header className="mx-auto py-4 container">
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/images/logo.png"
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
        </div>
      </div>
    </header>
  );
};

export default Header;
