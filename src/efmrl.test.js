import mockAxios from "jest-mock-axios";
import { EfmrlHandle } from "./efmrl.js";

afterEach(() => {
  mockAxios.reset();
});

it("navigates the happy path", async () => {
  const eh = new EfmrlHandle();

  expect(mockAxios.head).toHaveBeenCalled();

  const ename = "firehouse";
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

  expect(eh.ename()).resolves.toBe(ename);
});

it("works if HEAD gets a 404", async () => {
  const eh = new EfmrlHandle();

  const ename = "big-billy";
  mockAxios.mockResponse({
      status: 404,
      headers: {
        "x-efmrl-name": ename,
        "x-efmrl-api": "/efmrl-api/",
      },
  });

  expect(eh.apipath("u")).resolves.toBe("/efmrl-api/u");
  expect(eh.ename()).resolves.toBe(ename);
});

it("works if HEAD fails outright", async () => {
  const eh = new EfmrlHandle();

  delete window.location;
  window.location = new URL("https://firetruck.efmrl.com/crags");

  mockAxios.mockError("bad gorillas");

  expect(eh.apipath("u")).resolves.toBe("/efmrl-api/u");
  expect(eh.ename()).resolves.toBe("firetruck");
});
