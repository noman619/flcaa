"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Layers,
  ListChecks,
  Loader2,
  RotateCcw,
  Trophy,
  X,
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { cn, formatShortDate } from "@/lib/utils";
import { submitExamAttempt } from "@/app/dashboard/actions";

type Question = {
  id: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string | null;
};

type Attempt = {
  id: string;
  scorePercent: number;
  passed: boolean;
  takenAt: string;
};

type Mode = "menu" | "exam" | "flashcards" | "results";

export function ExamRunner({
  enrollmentId,
  courseId,
  courseTitle,
  passingScore,
  questions,
  attempts,
}: {
  enrollmentId: string;
  courseId: string;
  courseTitle: string;
  passingScore: number;
  questions: Question[];
  attempts: Attempt[];
}) {
  const router = useRouter();
  const [mode, setMode] = React.useState<Mode>("menu");
  const [order, setOrder] = React.useState<Question[]>(questions);
  const [index, setIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{
    scorePercent: number;
    passed: boolean;
  } | null>(null);

  if (!questions.length) {
    return (
      <EmptyState
        icon={ListChecks}
        title="No exam questions yet"
        description={`The question bank for ${courseTitle} has not been published. Your instructor adds questions from the admin area — check back soon.`}
        action={
          <ButtonLink href={`/dashboard/courses/${courseId}`} variant="outline">
            Back to course
          </ButtonLink>
        }
      />
    );
  }

  function start(nextMode: "exam" | "flashcards") {
    setOrder(shuffle(questions));
    setIndex(0);
    setAnswers({});
    setResult(null);
    setError(null);
    setMode(nextMode);
  }

  async function submit() {
    setSubmitting(true);
    setError(null);

    const payload = order
      .filter((q) => answers[q.id] !== undefined)
      .map((q) => ({ question_id: q.id, selected_index: answers[q.id]! }));

    const res = await submitExamAttempt({ enrollmentId, answers: payload });
    setSubmitting(false);

    if (res.error) {
      setError(res.error);
      return;
    }
    setResult({ scorePercent: res.scorePercent ?? 0, passed: res.passed ?? false });
    setMode("results");
    router.refresh();
  }

  const best = attempts.length
    ? Math.max(...attempts.map((a) => a.scorePercent))
    : null;
  const hasPassed = attempts.some((a) => a.passed);

  /* -------------------------------- menu --------------------------------- */
  if (mode === "menu") {
    return (
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Questions in bank" value={String(questions.length)} />
          <StatCard label="Score needed to pass" value={`${passingScore}%`} />
          <StatCard
            label="Your best score"
            value={best === null ? "—" : `${best}%`}
            tone={hasPassed ? "success" : "neutral"}
          />
        </div>

        {hasPassed ? (
          <Alert tone="success" title="You have already passed">
            Your best attempt was {best}%. You can keep practising as much as you
            like — passing scores are never overwritten.
          </Alert>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <ModeCard
            icon={ListChecks}
            title="Graded practice exam"
            description={`All ${questions.length} questions in random order. Scored on submit and saved to your attempt history. You need ${passingScore}% to pass and unlock your certificate.`}
            cta="Start graded exam"
            onClick={() => start("exam")}
          />
          <ModeCard
            icon={Layers}
            title="Flashcard mode"
            description="Untimed and unscored. Flip each card to check yourself and read the explanation. Nothing is saved to your record."
            cta="Start flashcards"
            variant="outline"
            onClick={() => start("flashcards")}
          />
        </div>

        {attempts.length ? (
          <section>
            <h2 className="mb-3 font-display text-lg">
              Attempt history
            </h2>
            <div className="overflow-hidden rounded-card border border-ink-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-ink-50 text-left text-xs tracking-wider text-ink-500 uppercase">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Date
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Score
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {attempts.map((attempt) => (
                    <tr key={attempt.id}>
                      <td className="px-5 py-3 text-ink-600">
                        {formatShortDate(attempt.takenAt)}
                      </td>
                      <td className="px-5 py-3 font-medium">
                        {attempt.scorePercent}%
                      </td>
                      <td className="px-5 py-3">
                        <Badge
                          variant={attempt.passed ? "success" : "danger"}
                          size="sm"
                        >
                          {attempt.passed ? "Passed" : "Not passed"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}
      </div>
    );
  }

  /* ------------------------------ flashcards ------------------------------ */
  if (mode === "flashcards") {
    return (
      <Flashcards
        questions={order}
        index={index}
        onIndex={setIndex}
        onExit={() => setMode("menu")}
        onRestart={() => start("flashcards")}
      />
    );
  }

  /* -------------------------------- results ------------------------------- */
  if (mode === "results" && result) {
    return (
      <div className="mx-auto max-w-2xl">
        <div
          className={cn(
            "rounded-card border p-8 text-center",
            result.passed
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50",
          )}
        >
          <span
            className={cn(
              "icon-tile icon-tile-xl mx-auto mb-5",
              result.passed
                ? "bg-emerald-600 text-white"
                : "bg-amber-500 text-white",
            )}
          >
            {result.passed ? (
              <Trophy className="size-8" aria-hidden />
            ) : (
              <RotateCcw className="size-8" aria-hidden />
            )}
          </span>
          <p className="font-display text-5xl">
            {result.scorePercent}%
          </p>
          <p className="mt-3 font-display text-xl">
            {result.passed ? "You passed" : "Not quite yet"}
          </p>
          <p className="mt-2 text-sm text-ink-600">
            {result.passed
              ? "This attempt has been saved. Finish every lesson to have your certificate issued automatically."
              : `You need ${passingScore}% to pass. Review the questions you missed below, then try again — attempts are unlimited.`}
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={() => start("exam")} variant="outline">
              <RotateCcw /> Retake exam
            </Button>
            <ButtonLink href={`/dashboard/courses/${courseId}`}>
              Back to course
            </ButtonLink>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="mb-4 font-display text-lg">
            Review your answers
          </h2>
          <ul className="space-y-4">
            {order.map((q, i) => {
              const selected = answers[q.id];
              const correct = selected === q.correctIndex;
              return (
                <li
                  key={q.id}
                  className="rounded-card border border-ink-200 bg-white p-5"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-white",
                        correct ? "bg-emerald-600" : "bg-red-600",
                      )}
                      aria-hidden
                    >
                      {correct ? (
                        <Check className="size-3" />
                      ) : (
                        <X className="size-3" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink-900">
                        {i + 1}. {q.question}
                      </p>
                      <p className="mt-2 text-sm text-ink-600">
                        <span className="font-medium">Correct answer:</span>{" "}
                        {q.choices[q.correctIndex]}
                      </p>
                      {!correct && selected !== undefined ? (
                        <p className="mt-1 text-sm text-red-700">
                          <span className="font-medium">You chose:</span>{" "}
                          {q.choices[selected]}
                        </p>
                      ) : null}
                      {selected === undefined ? (
                        <p className="mt-1 text-sm text-amber-700">
                          You left this blank.
                        </p>
                      ) : null}
                      {q.explanation ? (
                        <p className="mt-3 rounded-md bg-ink-50 p-3 text-sm leading-relaxed text-ink-600">
                          {q.explanation}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    );
  }

  /* -------------------------------- exam ---------------------------------- */
  const current = order[index]!;
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / order.length) * 100;

  return (
    <div className="mx-auto max-w-3xl">
      {error ? (
        <Alert tone="error" className="mb-6">
          {error}
        </Alert>
      ) : null}

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-ink-700">
            Question {index + 1} of {order.length}
          </span>
          <span className="text-ink-500">{answeredCount} answered</span>
        </div>
        <Progress value={progress} label="Exam progress" />
      </div>

      <fieldset className="rounded-card border border-ink-200 bg-white p-6 lg:p-8">
        <legend className="sr-only">Question {index + 1}</legend>
        <p className="font-display text-xl leading-snug">{current.question}</p>

        <div className="mt-6 space-y-2.5">
          {current.choices.map((choice, choiceIndex) => {
            const selected = answers[current.id] === choiceIndex;
            return (
              <label
                key={choiceIndex}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
                  selected
                    ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500"
                    : "border-ink-200 hover:border-ink-300 hover:bg-ink-50",
                )}
              >
                <input
                  type="radio"
                  name={`q-${current.id}`}
                  checked={selected}
                  onChange={() =>
                    setAnswers((prev) => ({ ...prev, [current.id]: choiceIndex }))
                  }
                  className="mt-0.5 size-4 border-ink-300 text-brand-700 focus:ring-brand-500"
                />
                <span className="text-sm leading-relaxed text-ink-800">
                  <span className="mr-2 font-medium text-ink-500">
                    {String.fromCharCode(65 + choiceIndex)}.
                  </span>
                  {choice}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="outline"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          <ChevronLeft /> Previous
        </Button>

        {index === order.length - 1 ? (
          <Button onClick={submit} disabled={submitting} size="lg">
            {submitting ? <Loader2 className="animate-spin" /> : <Check />}
            Submit exam ({answeredCount}/{order.length} answered)
          </Button>
        ) : (
          <Button onClick={() => setIndex((i) => Math.min(order.length - 1, i + 1))}>
            Next <ChevronRight />
          </Button>
        )}
      </div>

      <button
        type="button"
        onClick={() => setMode("menu")}
        className="mt-6 text-sm text-ink-500 underline underline-offset-4 hover:text-ink-800"
      >
        Abandon this attempt
      </button>
    </div>
  );
}

function Flashcards({
  questions,
  index,
  onIndex,
  onExit,
  onRestart,
}: {
  questions: Question[];
  index: number;
  onIndex: (i: number) => void;
  onExit: () => void;
  onRestart: () => void;
}) {
  const [revealed, setRevealed] = React.useState(false);
  const card = questions[index]!;

  // Flip the card face down whenever a different card comes up.
  const [lastIndex, setLastIndex] = React.useState(index);
  if (lastIndex !== index) {
    setLastIndex(index);
    setRevealed(false);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between text-sm">
        <span className="font-medium text-ink-700">
          Card {index + 1} of {questions.length}
        </span>
        <button
          type="button"
          onClick={onExit}
          className="text-ink-500 underline underline-offset-4 hover:text-ink-800"
        >
          Exit flashcards
        </button>
      </div>

      <div className="rounded-card border border-ink-200 bg-white p-8 lg:p-10">
        <p className="font-display text-xl leading-snug">{card.question}</p>

        {revealed ? (
          <div className="mt-7 border-t border-ink-100 pt-6">
            <p className="text-xs font-medium tracking-wider text-emerald-700 uppercase">
              Answer
            </p>
            <p className="mt-2 text-base font-medium text-ink-900">
              {card.choices[card.correctIndex]}
            </p>
            {card.explanation ? (
              <p className="mt-4 rounded-md bg-ink-50 p-4 text-sm leading-relaxed text-ink-600">
                {card.explanation}
              </p>
            ) : null}
          </div>
        ) : (
          <ul className="mt-6 space-y-2 text-sm text-ink-500">
            {card.choices.map((choice, i) => (
              <li key={i}>
                <span className="mr-2 font-medium">
                  {String.fromCharCode(65 + i)}.
                </span>
                {choice}
              </li>
            ))}
          </ul>
        )}

        <Button
          className="mt-8"
          variant={revealed ? "outline" : "primary"}
          block
          onClick={() => setRevealed((v) => !v)}
        >
          {revealed ? "Hide answer" : "Reveal answer"}
        </Button>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          disabled={index === 0}
          onClick={() => onIndex(index - 1)}
        >
          <ChevronLeft /> Previous
        </Button>
        {index === questions.length - 1 ? (
          <Button onClick={onRestart} variant="outline">
            <RotateCcw /> Shuffle & restart
          </Button>
        ) : (
          <Button onClick={() => onIndex(index + 1)}>
            Next <ChevronRight />
          </Button>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "success";
}) {
  return (
    <div className="rounded-card border border-ink-200 bg-white p-5">
      <p className="text-xs font-medium tracking-wider text-ink-500 uppercase">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-display text-3xl",
          tone === "success" ? "text-emerald-700" : "text-ink-900",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function ModeCard({
  icon: Icon,
  title,
  description,
  cta,
  onClick,
  variant = "primary",
}: {
  icon: typeof ListChecks;
  title: string;
  description: string;
  cta: string;
  onClick: () => void;
  variant?: "primary" | "outline";
}) {
  return (
    <div className="flex flex-col rounded-card border border-ink-200 bg-white p-6">
      <Icon className="size-6 text-brand-600" aria-hidden />
      <h2 className="mt-4 font-display text-lg">{title}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
        {description}
      </p>
      <Button className="mt-6" variant={variant} onClick={onClick} block>
        {cta}
      </Button>
    </div>
  );
}

/** Fisher–Yates, so every attempt gets a genuinely different order. */
function shuffle<T>(input: T[]): T[] {
  const copy = [...input];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}
