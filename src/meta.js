import axios from "axios";

export class Meta {
  constructor() {
    this.subefmrlVal = false;

    return (async () => {
      const now = new Date();
      const nownow = now.getTime();
      const location = window.location.pathname;
      const url = `${location}?${nownow}`;
      const res = await axios.head(url, {
        query: now.getTime(),
      });

      this.enameVal = res.headers["x-efmrl-name"];
      this.apibaseVal = res.headers["x-efmrl-api"];

      if (this.apibaseVal.includes("/sb/")) {
        this.subefmrlVal = true;
      }

      return this;
    })();
  }

  subefmrl() {
    return this.subefmrlVal;
  }

  apibase() {
    return this.apibaseVal;
  }

  apipath(which) {
    return `${this.apibaseVal}${which}`
  }

  ename() {
    return this.enameVal;
  }
}
