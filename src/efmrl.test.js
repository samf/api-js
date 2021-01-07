import mockAxios from "jest-mock-axios";
import { Efmrl } from "./efmrl.js";

afterEach(() => {
  mockAxios.reset();
});

it("sets ename and apibase", async () => {
  const eh = new Efmrl();

  expect(mockAxios.head).toHaveBeenCalled();

  const ename = "firehouse";
  const apibase = "/efmrl-api/";
  mockAxios.mockResponse({
    headers: {
      "x-efmrl-name": ename,
      "x-efmrl-api": "/efmrl-api/",
    },
  });

  expect(eh.apipath("u")).resolves.toBe("/efmrl-api/u")
  // or, the more usual case
  const url = await eh.apipath("u");
  expect(url).toEqual("/efmrl-api/u");
});
