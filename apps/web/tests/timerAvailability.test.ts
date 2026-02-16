import assert from "node:assert/strict";
import test from "node:test";
import { canStartStepTimer } from "../src/lib/recipeMath";

test("can start when sequence has remaining timer segments", () => {
  assert.equal(
    canStartStepTimer({
      sequenceLength: 2,
      activeRunningCount: 0,
      fallbackSeconds: 600,
    }),
    true
  );
  assert.equal(
    canStartStepTimer({
      sequenceLength: 2,
      activeRunningCount: 1,
      fallbackSeconds: 600,
    }),
    true
  );
});

test("cannot start when all sequence timer segments are already active", () => {
  assert.equal(
    canStartStepTimer({
      sequenceLength: 2,
      activeRunningCount: 2,
      fallbackSeconds: 600,
    }),
    false
  );
});

test("fallback mode allows only one active timer and requires positive duration", () => {
  assert.equal(
    canStartStepTimer({
      sequenceLength: 0,
      activeRunningCount: 0,
      fallbackSeconds: 120,
    }),
    true
  );
  assert.equal(
    canStartStepTimer({
      sequenceLength: 0,
      activeRunningCount: 1,
      fallbackSeconds: 120,
    }),
    false
  );
  assert.equal(
    canStartStepTimer({
      sequenceLength: 0,
      activeRunningCount: 0,
      fallbackSeconds: 0,
    }),
    false
  );
});
