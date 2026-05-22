"use client";

import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useMemo, useReducer, useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type Question = {
  _id: string;
  type: "text" | "radio" | "checkbox" | "dropdown" | "rating";
  prompt: string;
  placeholder?: string;
  isRequired: boolean;
  characterLimit?: number;
  minCharacterLimit?: number;
  shuffleOptions?: boolean;
  options?: string[];
};

type SurveyStatus = {
  hasSubmitted: boolean;
  surveyId?: string;
  survey?: {
    _id: string;
    title: string;
    introduction?: string;
    description?: string;
    disclaimer?: string;
    createdAt: string;
    expiresAt?: string;
    estimatedMinutes?: number;
    instructions?: string;
    isExpired?: boolean;
    questions: Question[];
  } | null;
};

type State = {
  step: number;
  answers: Record<string, string | string[] | number>;
  suggestions: string;
};

type Action =
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_ANSWER"; questionId: string; value: string | string[] | number }
  | { type: "SET_SUGGESTIONS"; payload: string };

const initialState: State = {
  step: 0,
  answers: {},
  suggestions: "",
};

function reducer(state: State, action: Action): State {
  if (action.type === "SET_STEP") {
    return { ...state, step: action.payload };
  }
  if (action.type === "SET_ANSWER") {
    return {
      ...state,
      answers: {
        ...state.answers,
        [action.questionId]: action.value,
      },
    };
  }
  if (action.type === "SET_SUGGESTIONS") {
    return { ...state, suggestions: action.payload };
  }
  return state;
}

const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const heroLine = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export default function SurveyPage() {
  const [status, setStatus] = useState<SurveyStatus | null>(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetch("/api/survey/status")
      .then((res) => res.json())
      .then((data) => setStatus(data))
      .finally(() => setLoading(false));
  }, []);

  const questions = status?.survey?.questions ?? [];
  const totalSteps = questions.length + 2;
  const currentQuestion = state.step > 0 && state.step <= questions.length ? questions[state.step - 1] : null;

  const progress = useMemo(() => {
    if (totalSteps <= 1) return 0;
    return (state.step / (totalSteps - 1)) * 100;
  }, [state.step, totalSteps]);

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center">Loading...</main>;
  }

  if (status?.hasSubmitted) {
    return (
      <main className="flex min-h-screen flex-col items-center p-4 py-8 md:p-6">
        <Card className="max-w-lg space-y-4 text-center">
          <motion.svg viewBox="0 0 52 52" className="mx-auto h-24 w-24" fill="none" stroke="var(--primary)">
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
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Your response has been recorded</h1>
          <p className="text-[var(--muted-foreground)]">This survey only allows one submission per participant</p>
        </Card>
      </main>
    );
  }

  if (!status?.survey) {
    return <main className="flex min-h-screen items-center justify-center p-6">No active survey found.</main>;
  }

  if (status.survey.isExpired) {
    return <main className="flex min-h-screen items-center justify-center p-6">This survey has expired.</main>;
  }

  const onNext = () => {
    dispatch({ type: "SET_STEP", payload: Math.min(state.step + 1, totalSteps - 1) });
  };

  const onBack = () => {
    dispatch({ type: "SET_STEP", payload: Math.max(state.step - 1, 0) });
  };

  const isCurrentStepValid = () => {
    if (!currentQuestion) return true;
    const value = state.answers[currentQuestion._id];
    const strValue = String(value ?? "");

    // Required check
    if (currentQuestion.isRequired) {
      if (Array.isArray(value)) {
        if (value.length === 0) return false;
      } else {
        if (value === undefined || value === "" || strValue.trim() === "") return false;
      }
    }

    // Min character limit check for text inputs
    if (currentQuestion.type === "text" && currentQuestion.minCharacterLimit) {
      if (currentQuestion.isRequired || (value !== undefined && strValue.length > 0)) {
        if (strValue.length < currentQuestion.minCharacterLimit) return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    setSubmitError("");
    const payload = [
      ...Object.entries(state.answers).map(([questionId, value]) => ({
        questionId,
        questionType: questions.find((question) => question._id === questionId)?.type ?? "text",
        value,
      })),
      {
        questionId: "suggestions",
        questionType: "text",
        value: state.suggestions,
      },
    ];

    const response = await fetch("/api/survey/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ surveyId: status.surveyId, answers: payload }),
    });

    if (!response.ok) {
      const body = await response.json();
      setSubmitError(body.error ?? "Submission failed");
      return;
    }

    setStatus({ ...status, hasSubmitted: true });
  };

  return (
    <main className="flex min-h-screen flex-col bg-[var(--background)]">
      <div className="sticky top-0 z-30 bg-[var(--background)] px-4 pt-4">
        <div className="h-1 w-full overflow-hidden rounded bg-[var(--muted)]">
          <motion.div
            layoutId="survey-progress"
            className="h-full bg-[var(--primary)]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Step {Math.min(state.step + 1, totalSteps)} of {totalSteps}
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-1 items-center px-4 py-6 pb-28 md:pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.step}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {state.step === 0 ? (
              <Card className="space-y-4">
                <motion.div variants={heroVariants} initial="hidden" animate="visible" className="space-y-3">
                  <motion.h1 variants={heroLine} className="text-3xl font-semibold text-[var(--foreground)]">
                    {status.survey.title}
                  </motion.h1>
                  <motion.p variants={heroLine}>{status.survey.introduction}</motion.p>
                  <motion.p variants={heroLine} className="text-[var(--muted-foreground)]">
                    {status.survey.description}
                  </motion.p>
                </motion.div>
                <div className="border-l-2 border-[var(--secondary)] pl-4 text-sm text-[var(--muted-foreground)]">
                  {status.survey.disclaimer}
                </div>
                <div className="grid gap-2 text-sm text-[var(--muted-foreground)]">
                  <p>Created: {format(new Date(status.survey.createdAt), "PPP")}</p>
                  <p>
                    Expires: {status.survey.expiresAt ? format(new Date(status.survey.expiresAt), "PPP") : "No expiry"}
                  </p>
                  <p>Estimated: {status.survey.estimatedMinutes ?? "N/A"} minutes</p>
                  <p>{status.survey.instructions}</p>
                </div>
                <Button onClick={onNext}>Begin Survey</Button>
              </Card>
            ) : currentQuestion ? (
              <Card className="space-y-4">
                <h2 className="text-xl font-semibold">{currentQuestion.prompt}</h2>
                {currentQuestion.type === "text" ? (
                  <>
                    <textarea
                      value={String(state.answers[currentQuestion._id] ?? "")}
                      onChange={(event) =>
                        dispatch({
                          type: "SET_ANSWER",
                          questionId: currentQuestion._id,
                          value: event.target.value.slice(0, currentQuestion.characterLimit ?? 1000),
                        })
                      }
                      placeholder={currentQuestion.placeholder}
                      className="min-h-32 w-full rounded-[var(--radius)] border border-[var(--input)] bg-[var(--background)] p-3"
                    />
                    <div className="flex flex-col sm:flex-row justify-between gap-1 text-sm text-[var(--muted-foreground)]">
                      {currentQuestion.minCharacterLimit && String(state.answers[currentQuestion._id] ?? "").length < currentQuestion.minCharacterLimit ? (
                        <span className="text-[var(--destructive)] font-medium">
                          Minimum {currentQuestion.minCharacterLimit} characters required (currently {String(state.answers[currentQuestion._id] ?? "").length})
                        </span>
                      ) : (
                        <span>Satisfies character requirements</span>
                      )}
                      <span>
                            {isChecked && currentQuestion.type === "checkbox" && (
                              <svg
                                viewBox="0 0 24 24"
                                className="h-4 w-4"
                                fill="none"
                                stroke="var(--primary-foreground)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            )}
                        {(currentQuestion.characterLimit ?? 1000) - String(state.answers[currentQuestion._id] ?? "").length} characters remaining
                      </span>
                    </div>
                  </>
                ) : null}

                {(currentQuestion.type === "radio" || currentQuestion.type === "checkbox") && currentQuestion.options ? (
                  <div className="space-y-2">
                    {currentQuestion.options.map((option) => {
                      const selectedValue = state.answers[currentQuestion._id];
                      const isChecked = Array.isArray(selectedValue)
                        ? selectedValue.includes(option)
                        : selectedValue === option;

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            if (currentQuestion.type === "radio") {
                              dispatch({ type: "SET_ANSWER", questionId: currentQuestion._id, value: option });
                              return;
                            }
                            const current = Array.isArray(selectedValue) ? selectedValue : [];
                            dispatch({
                              type: "SET_ANSWER",
                              questionId: currentQuestion._id,
                              value: isChecked ? current.filter((item) => item !== option) : [...current, option],
                            });
                          }}
                          className={`flex min-h-11 w-full items-center gap-3 rounded-[var(--radius)] border px-3 py-2 text-left transition-colors ${
                            isChecked
                              ? "border-[var(--primary)] bg-[var(--primary)]/5"
                              : "border-[var(--border)] bg-[var(--card)]"
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 items-center justify-center border border-[var(--primary)] ${
                              currentQuestion.type === "checkbox" ? "rounded-[3px]" : "rounded-full"
                            } ${isChecked ? "bg-[var(--primary)]" : "bg-transparent"}`}
                          />
                          {option}
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                {currentQuestion.type === "dropdown" && currentQuestion.options ? (
                  <select
                    value={String(state.answers[currentQuestion._id] ?? "")}
                    onChange={(event) =>
                      dispatch({ type: "SET_ANSWER", questionId: currentQuestion._id, value: event.target.value })
                    }
                    className="min-h-11 w-full rounded-[var(--radius)] border border-[var(--primary)] bg-[var(--background)] px-3 py-2"
                  >
                    <option value="">Select an option</option>
                    {currentQuestion.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : null}

                {currentQuestion.type === "rating" ? (
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const value = index + 1;
                      const current = Number(state.answers[currentQuestion._id] ?? 0);
                      return (
                        <motion.button
                          key={value}
                          type="button"
                          onClick={() => dispatch({ type: "SET_ANSWER", questionId: currentQuestion._id, value })}
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
                ) : null}
              </Card>
            ) : (
              <Card className="space-y-4">
                <h2 className="text-xl font-semibold">Any additional comments or suggestions?</h2>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Optional (Your feedback is completely anonymous)
                </p>
                <textarea
                  value={state.suggestions}
                  onChange={(event) => dispatch({ type: "SET_SUGGESTIONS", payload: event.target.value.slice(0, 1000) })}
                  className="min-h-40 w-full rounded-[var(--radius)] border border-[var(--input)] bg-[var(--background)] p-3"
                />
                <p className="text-sm text-[var(--muted-foreground)]">{1000 - state.suggestions.length} characters remaining</p>
                {submitError ? <p className="text-sm text-[var(--destructive)]">{submitError}</p> : null}
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {state.step > 0 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-[var(--border)] bg-[var(--background)] p-3 md:static md:border-0 md:px-4">
          <div className="mx-auto flex max-w-3xl justify-between gap-3">
            <Button onClick={onBack} disabled={state.step === 0}>
              Back
            </Button>
            {state.step === totalSteps - 1 ? (
              <Button onClick={handleSubmit}>Submit</Button>
            ) : (
              <Button onClick={onNext} disabled={!isCurrentStepValid()}>
                Next
              </Button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
