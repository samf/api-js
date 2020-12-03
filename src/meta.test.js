import mockAxios from "jest-mock-axios";
import { Meta } from "./meta.js";

afterEach(() => {
  mockAxios.reset();
});

it("sets ename and apibase", async () => {
  const meta = new Meta();

  expect(mockAxios.head).toHaveBeenCalled();
});
