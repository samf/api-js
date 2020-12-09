import mockAxios from "jest-mock-axios";
import { Efmrl } from "./efmrl.js";
import { Meta } from "./meta.js";

jest.mock("./meta");

beforeEach(() => {
  Meta.mockClear();
});

it("gets the meta", async () => {
  const eh = new Efmrl();

  expect(eh.meta).toBeTruthy();
  expect(Meta).toHaveBeenCalledTimes(1);
});
