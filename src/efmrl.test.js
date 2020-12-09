import mockAxios from "jest-mock-axios";
import { Efmrl } from "./efmrl.js";

it("gets the meta", async () => {
  const eh = new Efmrl();

  expect(eh.meta).toBeTruthy();
});
