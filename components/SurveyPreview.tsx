"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";
import { useState, useMemo } from "react";
import Button from "@/components/ui/Button";
import LinkifyText from "@/components/LinkifyText";

interface Question {
  _id?: string;
  type: "text" | "radio" | "checkbox" | "dropdown" | "rating";
  prompt: string;
  placeholder?: string;
  isRequired?: boolean;
  characterLimit?: number;
  minCharacterLimit?: number;
  shuffleOptions?: boolean;
  options?: string[];
}

interface SurveyData {
  title: string;
  introduction?: string;
  description?: string;
  disclaimer?: string;
  expiresAt?: string;
  estimatedMinutes?: number;
  instructions?: string;
  questions: Question[];
}

interface SurveyPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  surveyData: SurveyData;
}

export default function SurveyPreview({ isOpen, onClose, surveyData }: SurveyPreviewProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({});
  const [suggestions, setSuggestions] = useState("");

  const questions = surveyData.questions ?? [];
  const totalSteps = questions.length + 2;
  const currentQuestion = step > 0 && step <= questions.length ? questions[step - 1] : null;

  const progress = useMemo(() => {
    if (totalSteps <= 1) return 0;
    return (step / (totalSteps - 1)) * 100;
  }, [step, totalSteps]);

  const isCurrentStepValid = () => {
    return true;
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers({});
    setSuggestions("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-2xl p-6 md:p-8">
        
        {/* Header with Close and Preview Badge */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="rounded bg-[var(--primary)] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-[var(--primary-foreground)] animate-pulse">
              Live Preview
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">
              This is how your survey looks to participants.
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)] transition-colors"
            aria-label="Close Preview"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Survey Progress Bar */}
        {step < totalSteps - 1 && (
          <div className="mb-6">
            <div className="h-1.5 w-full overflow-hidden rounded bg-[var(--muted)]">
              <motion.div
                className="h-full bg-[var(--primary)]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </div>
            <p className="mt-2 text-xs text-[var(--muted-foreground)]">
              Step {step + 1} of {totalSteps}
            </p>
          </div>
        )}

        <div className="min-h-[300px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Step 0: Welcome Screen */}
              {step === 0 && (
                <div className="space-y-4">
                  <h1 className="text-2xl md:text-3xl font-semibold text-[var(--foreground)]">
                    {surveyData.title || "Untitled Survey"}
                  </h1>
                  {surveyData.introduction && (
                    <div className="border-l-2 border-[var(--secondary)] pl-4 py-1 text-sm text-[var(--muted-foreground)] italic bg-[var(--muted)]/30 rounded-r whitespace-pre-line break-words">
                      <LinkifyText text={surveyData.introduction} />
                    </div>
                  )}
                  {surveyData.description && (
                    <div className="space-y-2">
                      <p className="text-base font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                        Instructions
                      </p>
                      <p className="pl-2 text-[var(--foreground)] leading-relaxed whitespace-pre-line break-words">
                        <LinkifyText text={surveyData.description} />
                      </p>
                    </div>
                  )}
                  {surveyData.disclaimer && (
                    <div className="space-y-2">
                      <p className="text-base font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                        Disclaimer
                      </p>
                      <p className="pl-2 text-[var(--foreground)] leading-relaxed whitespace-pre-line break-words">
                        <LinkifyText text={surveyData.disclaimer} />
                      </p>
                    </div>
                  )}
                  <div className="grid gap-2 pt-2 text-xs text-[var(--muted-foreground)]">
                    <p>Estimated Duration: {surveyData.estimatedMinutes ?? "N/A"} minutes</p>
                    {surveyData.instructions && (
                      <div className="mt-2 p-3 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                        <p className="font-semibold text-[var(--foreground)] mb-1">Instructions:</p>
                        <p className="whitespace-pre-line break-words">
                          <LinkifyText text={surveyData.instructions} />
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="pt-4">
                    <Button onClick={handleNext} className="w-full sm:w-auto">Begin Survey</Button>
                  </div>
                </div>
              )}

              {/* Step 1 to N: Survey Questions */}
              {step > 0 && currentQuestion && (
                <div className="space-y-5">
                  <div className="flex items-start gap-2">
                    <h2 className="text-xl font-medium text-[var(--foreground)] whitespace-pre-line break-words">
                      <LinkifyText text={currentQuestion.prompt || "Blank Question Prompt"} />
                    </h2>
                    {currentQuestion.isRequired && (
                      <span className="text-[var(--destructive)] text-sm font-bold" title="Required">*</span>
                    )}
                  </div>

                  {/* Question Type: Text */}
                  {currentQuestion.type === "text" && (
                    <div className="space-y-2">
                      <textarea
                        value={String(answers[currentQuestion._id || ""] ?? "")}
                        onChange={(event) => {
                          const val = event.target.value;
                          setAnswers((prev) => ({
                            ...prev,
                            [currentQuestion._id || ""]: val.slice(0, currentQuestion.characterLimit ?? 1000),
                          }));
                        }}
                        placeholder={currentQuestion.placeholder || "Enter your answer..."}
                        className="min-h-32 w-full rounded-[var(--radius)] border border-[var(--input)] bg-[var(--background)] p-3 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                      />
                      <div className="flex justify-between items-center text-xs">
                        {currentQuestion.minCharacterLimit && String(answers[currentQuestion._id || ""] ?? "").length < currentQuestion.minCharacterLimit ? (
                          <span className="text-[var(--destructive)] font-medium">
                            Minimum {currentQuestion.minCharacterLimit} characters required (currently {String(answers[currentQuestion._id || ""] ?? "").length})
                          </span>
                        ) : (
                          <span className="text-[var(--muted-foreground)]">
                            Satisfies character requirements
                          </span>
                        )}
                        <span className="text-[var(--muted-foreground)]">
                          {(currentQuestion.characterLimit ?? 1000) - String(answers[currentQuestion._id || ""] ?? "").length} characters remaining
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Question Type: Radio & Checkbox */}
                  {(currentQuestion.type === "radio" || currentQuestion.type === "checkbox") && currentQuestion.options && (
                    <div className="space-y-3">
                      {currentQuestion.options.map((option) => {
                        const qId = currentQuestion._id || "";
                        const selectedValue = answers[qId];
                        const isChecked = Array.isArray(selectedValue)
                          ? selectedValue.includes(option)
                          : selectedValue === option;

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              if (currentQuestion.type === "radio") {
                                setAnswers((prev) => ({ ...prev, [qId]: option }));
                                return;
                              }
                              const current = Array.isArray(selectedValue) ? selectedValue : [];
                              setAnswers((prev) => ({
                                ...prev,
                                [qId]: isChecked ? current.filter((item) => item !== option) : [...current, option],
                              }));
                            }}
                            className={`flex min-h-11 w-full items-center gap-3 rounded-[var(--radius)] border px-4 py-3 text-left transition-all ${
                              isChecked
                                ? "border-[var(--primary)] bg-[var(--primary)]/5"
                                : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--accent)]/50"
                            }`}
                          >
                            <span
                              className={`flex h-4 w-4 shrink-0 items-center justify-center border border-[var(--primary)] text-[var(--primary-foreground)] transition-all ${
                                currentQuestion.type === "checkbox" ? "rounded-[3px]" : "rounded-full"
                              } ${isChecked ? "bg-[var(--primary)]" : "bg-transparent"}`}
                            >
                              {isChecked && currentQuestion.type === "checkbox" && (
                                <svg
                                  viewBox="0 0 24 24"
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  aria-hidden="true"
                                >
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                              )}
                            </span>
                            <span className="text-sm font-medium text-[var(--foreground)]">{option}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Question Type: Dropdown */}
                  {currentQuestion.type === "dropdown" && currentQuestion.options && (
                    <select
                      value={String(answers[currentQuestion._id || ""] ?? "")}
                      onChange={(event) => {
                        setAnswers((prev) => ({ ...prev, [currentQuestion._id || ""]: event.target.value }));
                      }}
                      className="min-h-11 w-full rounded-[var(--radius)] border border-[var(--primary)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                    >
                      <option value="">Select an option</option>
                      {currentQuestion.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Question Type: Rating */}
                  {currentQuestion.type === "rating" && (
                    <div className="flex items-center gap-2">
                      {Array.from({ length: 5 }).map((_, index) => {
                        const value = index + 1;
                        const qId = currentQuestion._id || "";
                        const current = Number(answers[qId] ?? 0);
                        return (
                          <motion.button
                            key={value}
                            type="button"
                            onClick={() => setAnswers((prev) => ({ ...prev, [qId]: value }))}
                            whileTap={{ scale: 0.85 }}
                            whileHover={{ scale: 1.15 }}
                            className="inline-flex min-h-11 min-w-11 items-center justify-center transition-colors"
                          >
                            <Star
                              className={`h-8 w-8 transition-colors duration-150 ${
                                current >= value
                                  ? "fill-[var(--primary)] text-[var(--primary)]"
                                  : "fill-transparent text-[var(--primary)]"
                              }`}
                            />
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Step N + 1: Suggestions/Comments Screen */}
              {step === totalSteps - 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-[var(--foreground)]">
                    Any additional comments or suggestions?
                  </h2>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Optional (Your feedback is completely anonymous)
                  </p>
                  <textarea
                    value={suggestions}
                    onChange={(event) => setSuggestions(event.target.value.slice(0, 1000))}
                    placeholder="Provide details or suggestions here..."
                    className="min-h-40 w-full rounded-[var(--radius)] border border-[var(--input)] bg-[var(--background)] p-3 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  />
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {1000 - suggestions.length} characters remaining
                  </p>
                  <div className="pt-2">
                    <Button onClick={() => setStep(totalSteps)} className="w-full">
                      Submit Preview
                    </Button>
                  </div>
                </div>
              )}

              {/* Step N + 2: Simulated Success Screen */}
              {step === totalSteps && (
                <div className="space-y-6 text-center py-6">
                  <motion.svg viewBox="0 0 52 52" className="mx-auto h-20 w-20" fill="none" stroke="var(--primary)">
                    <motion.circle
                      cx="26"
                      cy="26"
                      r="24"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                    <motion.path
                      d="M14 27l8 8 16-16"
                      strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: "easeInOut", delay: 0.6 }}
                    />
                  </motion.svg>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-[var(--foreground)]">
                      Response Recorded (Simulated)
                    </h2>
                    <p className="text-[var(--muted-foreground)] max-w-md mx-auto">
                      In the live survey, the participant will see this screen, and their answers will be aggregated in the database.
                    </p>
                  </div>
                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="secondary" onClick={handleRestart}>
                      Restart Preview
                    </Button>
                    <Button onClick={onClose}>
                      Exit Preview
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          {step > 0 && step < totalSteps && (
            <div className="flex justify-between items-center border-t border-[var(--border)] pt-4 mt-6">
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
              {step < totalSteps - 1 && (
                <Button onClick={handleNext} disabled={!isCurrentStepValid()}>
                  Next
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
