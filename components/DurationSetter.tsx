import { useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Props = {
  timerDuration: number;
  onChange: (value: number) => void;
  timeLeft: number;
  isTimerRunning: boolean;
};

const DurationSetter = ({
  timerDuration,
  onChange,
  timeLeft,
  isTimerRunning,
}: Props) => {
  const durationInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (durationInputRef.current) {
      durationInputRef.current.focus();
    }
  }, [timerDuration]); // Refocus when timerDuration updates
  return (
    <div className="space-y-2">
      <Label>Set Timer Duration in seconds:</Label>
      <Input
        defaultValue={timerDuration}
        ref={durationInputRef}
        onBlur={(e) => {
          onChange(Number(e.target.value));
        }}
        type={"number"}
        disabled={
          !(timeLeft === 0 || (timeLeft === timerDuration && !isTimerRunning))
        }
      />
    </div>
  );
};

export default DurationSetter;
