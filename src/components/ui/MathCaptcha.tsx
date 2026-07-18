"use client";

import React, { useState, useEffect } from "react";
import { RefreshCcw } from "lucide-react";

interface MathCaptchaProps {
  onValidate: (isValid: boolean) => void;
}

export default function MathCaptcha({ onValidate }: MathCaptchaProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState<"+" | "-" | "*">("+");
  const [userAnswer, setUserAnswer] = useState("");
  const [error, setError] = useState(false);

  const generateCaptcha = () => {
    const ops: ("+" | "-" | "*")[] = ["+", "-", "*"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let n1 = Math.floor(Math.random() * 10) + 1;
    let n2 = Math.floor(Math.random() * 10) + 1;

    // Ensure subtraction doesn't result in negative numbers for simplicity
    if (op === "-" && n2 > n1) {
      const temp = n1;
      n1 = n2;
      n2 = temp;
    }

    setNum1(n1);
    setNum2(n2);
    setOperator(op);
    setUserAnswer("");
    setError(false);
    onValidate(false); // Reset validation state
  };

  useEffect(() => {
    generateCaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserAnswer(value);

    let correctAnswer = 0;
    if (operator === "+") correctAnswer = num1 + num2;
    if (operator === "-") correctAnswer = num1 - num2;
    if (operator === "*") correctAnswer = num1 * num2;

    if (value === "") {
      setError(false);
      onValidate(false);
    } else if (parseInt(value, 10) === correctAnswer) {
      setError(false);
      onValidate(true);
    } else {
      setError(true);
      onValidate(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2 mb-4">
      <label className="block text-sm font-semibold text-slate-700">
        Verifikasi Keamanan <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center bg-slate-100 border border-slate-200 px-4 py-2.5 rounded-xl font-mono text-lg font-bold text-slate-700 min-w-[120px] select-none">
          {num1} {operator} {num2} = ?
        </div>
        <button
          type="button"
          onClick={generateCaptcha}
          className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
          title="Ganti CAPTCHA"
        >
          <RefreshCcw className="w-5 h-5" />
        </button>
        <input
          type="number"
          value={userAnswer}
          onChange={handleChange}
          placeholder="Hasil"
          required
          className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 text-sm ${
            error
              ? "border-red-300 focus:ring-red-500 text-red-900"
              : userAnswer && !error
              ? "border-emerald-300 focus:ring-emerald-500 text-emerald-900"
              : "border-slate-200 focus:ring-primary-500 text-slate-900"
          }`}
        />
      </div>
      {error && userAnswer !== "" && (
        <p className="text-xs text-red-500 font-medium">Jawaban salah. Silakan coba lagi.</p>
      )}
    </div>
  );
}
