import mockAxios from "jest-mock-axios";
import { Meta } from "./meta.js";

afterEach(() => {
  mockAxios.reset();
});

it("sets ename and apibase", async () => {
  const metap = new Meta();

  expect(mockAxios.head).toHaveBeenCalled();

  const ename = "firehouse";
  const apibase = "/efmrl-api/";
  mockAxios.mockResponse({
    headers: {
      "x-efmrl-name": ename,
      "x-efmrl-api": "/efmrl-api/",
    },
  });

  const meta = await metap;

  expect(meta.subefmrl()).toBe(false);
  expect(meta.ename()).toBe(ename);
  expect(meta.apibase()).toBe(apibase);
});
