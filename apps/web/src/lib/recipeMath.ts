import type { Ingredient, StepData } from "../components";

const FRACTION_MAP: Record<string, string> = {
  "¼": "1/4",
  "½": "1/2",
  "¾": "3/4",
  "⅐": "1/7",
  "⅑": "1/9",
  "⅒": "1/10",
  "⅓": "1/3",
  "⅔": "2/3",
  "⅕": "1/5",
  "⅖": "2/5",
  "⅗": "3/5",
  "⅘": "4/5",
  "⅙": "1/6",
  "⅚": "5/6",
  "⅛": "1/8",
  "⅜": "3/8",
  "⅝": "5/8",
  "⅞": "7/8",
};

export const TIME_PATTERN =
  /\b(\d+(?:\.\d+)?)(?:\s*(?:-|to)\s*(\d+(?:\.\d+)?))?\s*(hours?|hrs?|hr|minutes?|mins?|min|seconds?|secs?|sec)\b/gi;
export const TEMPERATURE_PATTERN =
  /\b\d{2,3}\s*(?:(?:°|º|˚)\s?(?:C|F)\b|deg(?:ree)?s?\.?\s*(?:Celsius|Fahrenheit|C|F)\b|degrees?\s*(?:Celsius|Fahrenheit|C|F)\b|(?:C|F)\b|[℃℉])/gi;
export const HEAT_CUE_PATTERN = /\b(?:low|medium|high)\s+heat\b|\bpreheat\b/gi;

const normalizeUnicodeFractions = (value: string) =>
  value
    .split("")
    .map((char, index, source) => {
      const mapped = FRACTION_MAP[char];
      if (!mapped) {
        return char;
      }
      const prev = source[index - 1] ?? "";
      return /\d/.test(prev) ? ` ${mapped}` : mapped;
    })
    .join("");

const parseNumberToken = (token: string) => {
  const mixed = token.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) {
    const whole = Number.parseInt(mixed[1], 10);
    const top = Number.parseInt(mixed[2], 10);
    const bottom = Number.parseInt(mixed[3], 10);
    if (bottom === 0) {
      return null;
    }
    return whole + top / bottom;
  }

  const fraction = token.match(/^(\d+)\/(\d+)$/);
  if (fraction) {
    const top = Number.parseInt(fraction[1], 10);
    const bottom = Number.parseInt(fraction[2], 10);
    if (bottom === 0) {
      return null;
    }
    return top / bottom;
  }

  const decimal = Number.parseFloat(token);
  return Number.isFinite(decimal) ? decimal : null;
};

const formatNumber = (value: number) => {
  const rounded = Math.round(value * 100) / 100;
  if (Number.isInteger(rounded)) {
    return `${rounded}`;
  }
  return `${rounded}`
    .replace(/\.0+$/, "")
    .replace(/(\.\d*[1-9])0+$/, "$1");
};

export const getUnitSeconds = (unit: string) => {
  const normalized = unit.toLowerCase();
  if (
    normalized === "hour" ||
    normalized === "hours" ||
    normalized === "hr" ||
    normalized === "hrs"
  ) {
    return 3600;
  }
  if (
    normalized === "minute" ||
    normalized === "minutes" ||
    normalized === "min" ||
    normalized === "mins"
  ) {
    return 60;
  }
  return 1;
};

export const doubleQuantityText = (value: string) => {
  const normalized = normalizeUnicodeFractions(value);
  return normalized.replace(
    /\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?/g,
    (match) => {
      const parsed = parseNumberToken(match);
      if (parsed === null) {
        return match;
      }
      return formatNumber(parsed * 2);
    }
  );
};

export const doubleIngredient = (ingredient: Ingredient): Ingredient => ({
  ...ingredient,
  qty: doubleQuantityText(ingredient.qty),
});

export const doubleStepData = (step: StepData): StepData => ({
  ...step,
  bullets: step.bullets.map((bullet) => ({
    ...bullet,
    parts: bullet.parts.map((part) =>
      part.type === "ingredient"
        ? { ...part, ingredient: doubleIngredient(part.ingredient) }
        : part
    ),
  })),
  needsNow: step.needsNow.map((entry) =>
    typeof entry.item === "string"
      ? entry
      : { ...entry, item: doubleIngredient(entry.item) }
  ),
  ingredients: step.ingredients.map(doubleIngredient),
});

export const getStepTimerSequence = (step: StepData) => {
  const text = step.bullets
    .flatMap((bullet) =>
      bullet.parts
        .filter(
          (part): part is { type: "text"; value: string } => part.type === "text"
        )
        .map((part) => part.value)
    )
    .join(" ");

  const sequence: number[] = [];
  for (const match of text.matchAll(TIME_PATTERN)) {
    const firstValue = Number.parseFloat(match[1]);
    const secondValue = match[2] ? Number.parseFloat(match[2]) : null;
    const valueToUse =
      secondValue !== null && Number.isFinite(secondValue)
        ? Math.max(firstValue, secondValue)
        : firstValue;

    if (!Number.isFinite(valueToUse)) {
      continue;
    }
    sequence.push(Math.round(valueToUse * getUnitSeconds(match[3] ?? "sec")));
  }
  return sequence.filter((item) => item > 0);
};

export const getStepTimerSeconds = (step: StepData) => {
  const totalSeconds = getStepTimerSequence(step).reduce(
    (sum, value) => sum + value,
    0
  );
  return totalSeconds > 0 ? totalSeconds : step.timerSeconds;
};

export const canStartStepTimer = ({
  sequenceLength,
  activeRunningCount,
  fallbackSeconds,
}: {
  sequenceLength: number;
  activeRunningCount: number;
  fallbackSeconds: number;
}) => {
  if (sequenceLength > 0) {
    return activeRunningCount < sequenceLength;
  }
  return fallbackSeconds > 0 && activeRunningCount === 0;
};

export const extractTemperatureMentions = (text: string) => {
  const explicit = Array.from(text.matchAll(TEMPERATURE_PATTERN)).map(
    (match) => match[0]
  );
  const cues = Array.from(text.matchAll(HEAT_CUE_PATTERN)).map(
    (match) => match[0]
  );
  return [...explicit, ...cues];
};

export const getStepTemperatureMentions = (step: StepData) => {
  const text = step.bullets
    .flatMap((bullet) =>
      bullet.parts
        .filter(
          (part): part is { type: "text"; value: string } => part.type === "text"
        )
        .map((part) => part.value)
    )
    .join(" ");
  return extractTemperatureMentions(text);
};
