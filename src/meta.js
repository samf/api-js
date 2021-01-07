import axios from "axios";

export class Meta {
  constructor() {
    this.#subefmrl = false;
    this.#apibase = null;
    this.#ename = null;

    this.#ready = (async () => {
      const now = new Date();
      const nownow = now.getTime();
      const location = window.location.pathname;
      const url = `${location}?${nownow}`;
      const res = await axios.head(url, {
        query: now.getTime(),
      });

      this.#apibase = res.headers["x-efmrl-api"];
      this.#ename = res.headers["x-efmrl-name"];

      if (this.#apibase.includes("/sb/")) {
        this.subefmrlVal = true;
      }

      return this;
    })();
  }

  async subefmrl() {
    await this.#ready;
    return this.#subefmrl;
  }

  async apibase() {
    await this.#ready;
    return this.apibaseVal;
  }

  async apipath(which) {
    await this.#ready;
    return `${this.apibaseVal}${which}`
  }

  async ename() {
    await this.#ready;
    return this.enameVal;
  }
}
