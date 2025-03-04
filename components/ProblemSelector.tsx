import React from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Divide, Plus, Shuffle, X } from "lucide-react";
import { ProblemType } from "@/types";

type Props = {
  problemType: ProblemType;
  handleProblemTypeChange: (value: string) => void;
};

const ProblemSelector = ({ problemType, handleProblemTypeChange }: Props) => {
  return (
    <div className="mb-8">
      <Tabs
        defaultValue="Random"
        value={problemType}
        onValueChange={handleProblemTypeChange}
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
  );
};

export default ProblemSelector;
