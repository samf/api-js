export class Meta {
  constructor() {
    this.subefmrl = false;
    this.origin = window.location.origin;
    this.roles = new Array();
    this.noRole = new Array();

    return (async () => {
      const now = new Date();
      const nownow = now.getTime();
      const location = window.location.pathname;
      const url = `${location}?${nownow}`;
      const res = await axios.head(url, {
        query: now.getTime(),
      });

      this.ename = res.headers["x-efmrl-name"];
      this.apibase = res.headers["x-efmrl-api"];

      if (this.apibase.includes("/sb/")) {
        this.subefmrl = true;
      }

      return this;
    })();
  }
}
