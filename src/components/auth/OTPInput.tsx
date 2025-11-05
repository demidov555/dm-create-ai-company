import { useState, useRef, KeyboardEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

interface OTPInputProps {
  phoneNumber: string;
  onSubmit: (code: string) => void;
  onBack: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function OTPInput({ phoneNumber, onSubmit, onBack, isLoading, error }: OTPInputProps) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== "") && value) {
      onSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("").concat(Array(4 - pastedData.length).fill("")).slice(0, 4);
    setOtp(newOtp);

    const lastIndex = Math.min(pastedData.length, 3);
    inputRefs.current[lastIndex]?.focus();

    if (pastedData.length === 4) {
      onSubmit(pastedData);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length === 4) {
      onSubmit(code);
    }
  };

  const isValid = otp.every((digit) => digit !== "");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        disabled={isLoading}
      >
        <ArrowLeft className="h-4 w-4" />
        Изменить номер
      </button>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Мы отправили код на номер <span className="text-foreground">{phoneNumber}</span>
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3 justify-center" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-14 h-14 text-center text-2xl border-2 border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-card"
              autoFocus={index === 0}
              disabled={isLoading}
            />
          ))}
        </div>

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-primary hover:bg-primary/90"
        disabled={!isValid || isLoading}
      >
        {isLoading ? "Проверка..." : "Подтвердить"}
      </Button>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Для демо используйте код: <span className="text-foreground">1234</span>
        </p>
      </div>
    </form>
  );
}
