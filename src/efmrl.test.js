import { TOTP } from "./efmrl.js";

test("the universe exists", () => {
  expect(0).toBe(0);
  expect(TOTP).not.toBe(undefined);
});

async function tiddles() {
  return 7;
}

// delete this test and "tiddles()" later on
test("multi awaited promise", async () => {
  const tt = tiddles();
  let t = await tt;
  expect(t).toBe(7);

  t = await tt;
  expect(t).toBe(7);

  const w = await tt;
  expect(w).toBe(7);
});
