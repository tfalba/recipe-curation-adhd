import assert from "node:assert/strict";
import test from "node:test";
import type { StepData } from "../src/components";
import {
  doubleQuantityText,
  getStepTemperatureMentions,
  getStepTimerSeconds,
  getStepTimerSequence,
} from "../src/lib/recipeMath";

const makeStep = (textParts: string[], timerSeconds = 0): StepData => ({
  title: "Test step",
  bullets: textParts.map((value) => ({
    parts: [{ type: "text", value }],
  })),
  chips: [],
  timerSeconds,
  needsNow: [],
  ingredients: [],
  nextPreview: [],
  summary: "",
});

test("doubleQuantityText doubles fractions, mixed numbers, and decimals", () => {
  assert.equal(doubleQuantityText("1/2 cup"), "1 cup");
  assert.equal(doubleQuantityText("1 1/2 tbsp"), "3 tbsp");
  assert.equal(doubleQuantityText("0.75 tsp"), "1.5 tsp");
  assert.equal(doubleQuantityText("½ cup"), "1 cup");
});

test("getStepTimerSequence returns each timing instruction in order", () => {
  const step = makeStep([
    "Saute for 3 minutes, stirring.",
    "Then simmer for 8 minutes.",
  ]);
  assert.deepEqual(getStepTimerSequence(step), [180, 480]);
});

test("getStepTimerSequence uses upper bound for ranges", () => {
  const step = makeStep(["Bake 10-12 minutes until golden."]);
  assert.deepEqual(getStepTimerSequence(step), [720]);
});

test("getStepTimerSeconds sums all parsed timings", () => {
  const step = makeStep([
    "Cook 2 minutes.",
    "Rest 30 seconds.",
    "Finish for 1 minute.",
  ]);
  assert.equal(getStepTimerSeconds(step), 210);
});

test("getStepTimerSeconds falls back to timerSeconds when no timing text exists", () => {
  const step = makeStep(["Stir until glossy."], 90);
  assert.equal(getStepTimerSeconds(step), 90);
});

test("parses mixed timing units from messy recipe text", () => {
  const step = makeStep([
    "Cook on low for 1 hr, then rest 30 min and finish 45 sec.",
  ]);
  assert.deepEqual(getStepTimerSequence(step), [3600, 1800, 45]);
  assert.equal(getStepTimerSeconds(step), 5445);
});

test("does not treat ingredient quantities as timers", () => {
  const step = makeStep([
    "Add 2 cups broth and 1/2 tsp salt, then simmer 5 min.",
  ]);
  assert.deepEqual(getStepTimerSequence(step), [300]);
});

test("doubleQuantityText handles mixed unicode fractions and parenthetical amounts", () => {
  assert.equal(doubleQuantityText("1½ cups"), "3 cups");
  assert.equal(doubleQuantityText("1 cup (240 ml)"), "2 cup (480 ml)");
});

test("timer parsing handles uppercase units and spaced ranges", () => {
  const step = makeStep(["Bake for 10 - 12 MIN then rest 2 SEC."]);
  assert.deepEqual(getStepTimerSequence(step), [720, 2]);
});

test("timer parsing ignores malformed timing fragments", () => {
  const step = makeStep(["Cook for 10- min and then plate."], 45);
  assert.deepEqual(getStepTimerSequence(step), []);
  assert.equal(getStepTimerSeconds(step), 45);
});

test("extracts explicit temperature measures from bullets", () => {
  const step = makeStep([
    "Preheat oven to 350F (177°C), then bake until done.",
    "Internal temp should reach 165 degrees F.",
  ]);
  assert.deepEqual(getStepTemperatureMentions(step), [
    "350F",
    "177°C",
    "165 degrees F",
    "Preheat",
  ]);
});

test("extracts heat cues without explicit degree values", () => {
  const step = makeStep(["Cook on medium heat, then reduce to low heat."]);
  assert.deepEqual(getStepTemperatureMentions(step), [
    "medium heat",
    "low heat",
  ]);
});

test("extracts odd temperature variants (deg, symbols, unicode units)", () => {
  const step = makeStep([
    "Hold at 177 deg C, then cool to 120 deg. F.",
    "Alternative notation: 90ºC, 45˚ F, and 200℃.",
  ]);
  assert.deepEqual(getStepTemperatureMentions(step), [
    "177 deg C",
    "120 deg. F",
    "90ºC",
    "45˚ F",
    "200℃",
  ]);
});
