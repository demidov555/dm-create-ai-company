import { useState } from "react";
import { Phone } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface PhoneInputProps {
  onSubmit: (phoneNumber: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function PhoneInput({ onSubmit, isLoading, error }: PhoneInputProps) {
  const [phoneNumber, setPhoneNumber] = useState("");

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    
    if (cleaned.length === 0) return "";
    
    let formatted = "+7";
    if (cleaned.length > 1) {
      formatted += " (" + cleaned.slice(1, 4);
    }
    if (cleaned.length >= 4) {
      formatted += ") " + cleaned.slice(4, 7);
    }
    if (cleaned.length >= 7) {
      formatted += "-" + cleaned.slice(7, 9);
    }
    if (cleaned.length >= 9) {
      formatted += "-" + cleaned.slice(9, 11);
    }
    
    return formatted;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleaned = value.replace(/\D/g, "");
    
    if (cleaned.length <= 11) {
      setPhoneNumber(formatPhoneNumber(cleaned.startsWith("7") ? cleaned : "7" + cleaned));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phoneNumber.replace(/\D/g, "");
    if (cleaned.length === 11) {
      onSubmit(phoneNumber);
    }
  };

  const isValid = phoneNumber.replace(/\D/g, "").length === 11;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="phone">Номер телефона</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            placeholder="+7 (999) 123-45-67"
            value={phoneNumber}
            onChange={handleChange}
            className="pl-10 h-12"
            autoFocus
            disabled={isLoading}
          />
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-primary hover:bg-primary/90"
        disabled={!isValid || isLoading}
      >
        {isLoading ? "Отправка..." : "Получить код"}
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        Мы отправим вам SMS с кодом подтверждения
      </p>
    </form>
  );
}
