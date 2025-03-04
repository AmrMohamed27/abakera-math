import React from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Divide, Plus, Shuffle, X } from "lucide-react";
import { ProblemType } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";

type Props = {
  problemType: ProblemType;
  handleProblemTypeChange: (value: string) => void;
};

const ProblemSelector = ({ problemType, handleProblemTypeChange }: Props) => {
  return (
    <div className="flex flex-col gap-4 mb-8 px-2">
      <Label className="">Select Problem Type</Label>
      <Tabs
        defaultValue="Random"
        value={problemType}
        onValueChange={handleProblemTypeChange}
        className="max-md:hidden w-full"
      >
        <TabsList className="bg-[#0a2a4a]">
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
      <Select>
        <SelectTrigger className="md:hidden w-[180px]">
          <SelectValue placeholder="Random" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Random">Random</SelectItem>
          <SelectItem value="Add Three Numbers">Add Three Numbers</SelectItem>
          <SelectItem value="Multiply Two Numbers">
            Multiply Two Numbers
          </SelectItem>
          <SelectItem value="Multiply and Divide">
            Multiply and Divide
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProblemSelector;
