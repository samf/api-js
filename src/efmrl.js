import axios from "axios";

export class EfmrlHandle {
  constructor() {
    this._subefmrl = null;
    this._apibase = null;
    this._ename = null;

    this.roles = new Array();
    this.noRole = new Array();

    this._ready = (async () => {
      try {
        const now = new Date();
        const url = window.location.pathname;

        const res = await axios.head(url, {
          query: now.getTime(),
        });

        this._apibase = res.headers["x-efmrl-api"];
        this._ename = res.headers["x-efmrl-name"];
        this._subefmrl = this._apibase.includes("/sb/");
      } catch (e) {
        if (e.response && e.response.headers) {
          this._apibase = e.response.headers["x-efmrl-api"];
          this._ename = e.response.headers["x-efmrl-name"];
        }
      }

      if (!this._apibase || !this._ename) {
        const baseurl = new URL(window.location);
        const host = baseurl.hostname;
        const re = /(\w+).efmrl.(\w+)/;
        this._ename = host.replace(re, "$1");
        this._apibase = "/efmrl-api/";
      }
      this._subefmrl = this._apibase.includes("/sb/");
    })();
  }

  async apipath(which) {
    await this._ready;
    return `${this._apibase}${which}`
  }

  staticpath(which) {
    return `/efmrl-api/${which}`;
  }

  async ename() {
    await this._ready;
    return this._ename;
  }

  async metadata() {
    const url = await this.apipath("u/efmrl");

    return axios.get(url);
  }

  async addDomain(domain) {
    const url = await this.apipath("cd");
    const payload = {
      domain: domain,
    };

    return axios.put(url, payload);
  }

  async getDomains() {
    const url = await this.apipath("cd");

    return axios.get(url);
  }

  async deleteDomain(domain) {
    const url = await this.apipath("cd");
    const payload = {
      domain: domain,
    };

    return axios.post(url, payload);
  }

  async data(path) {
    let apipath;

    if (path !== undefined) {
      apipath = await this.apipath(`d/${path}`);
    } else {
      apipath = await this.apipath("d");
    }

    return axios.get(apipath);
  }

  async setData(payload, path) {
    let apipath;

    if (path !== undefined) {
      apipath = await this.apipath(`d/${path}`);
    } else {
      apipath = await this.apipath("d");
    }

    return axios.put(apipath, payload);
  }

  async postData(payload) {
    const apipath = await this.apipath("d");

    return axios.post(apipath, payload);
  }

  async listData() {
    const path = await this.apipath("ld");
    const payload = {};

    return axios.post(path, payload);
  }

  async getAllData() {
    const path = await this.apipath("ad");
    const payload = {
      include_data: true,
    };

    return axios.post(path, payload);
  }

  async deleteData(path) {
    let apipath;

    if (path !== undefined) {
      apipath = await this.apipath(`d/${path}`);
    } else {
      apipath = await this.apipath("d");
    }

    return axios.delete(apipath);
  }

  // appstore catalog data; should probably rename
  async appdata() {
    const apipath = await this.apipath("p");

    return axios.get(apipath);
  }

  static async getNames() {
    const path = this.staticpath("u/names");
    return axios.post(path);
  }

  static async reserve(req) {
    const path = this.staticpath("u/reserve");
    return axios.post(path, req);
  }

  static async release(req) {
    const path = this.staticpath("u/release");
    return axios.post(path, req);
  }

  static async constants() {
    const path = this.staticpath("g/efmrl/const");
    return axios.get(path);
  }

  async fund(req) {
    const path = await this.apipath("f");
    return axios.post(path, req);
  }

  async liststatic() {
    const path = await this.apipath("ls");
    return axios.get(path);
  }

  async adminBundle() {
    const path = await this.apipath("ab");
    const res = await axios.get(path);
    if (res.status != 200) {
      throw "cannot get admin bundle";
    }
    if (res.data.efmrl === undefined) {
      throw "unexpected result from server";
    }
    return res.data;
  }

  async updateEfmrl(efmrl) {
    const path = await this.apipath("a/u/efmrl");
    return axios.post(path, efmrl);
  }

  async updateAuthx(authx) {
    const path = await this.apipath("ax");
    const res = await axios.post(path, authx);
    if (res.status != 200) {
      throw "cannot save profiles";
    }
    if (res.data.roles === undefined) {
      throw "unexpected result from server";
    }
    return res.data;
  }

  async spawn(req) {
    const path = await this.apipath("n");

    return axios.post(path, req);
  }

  async authenticate(req) {
    const path = await this.apipath("an");

    return axios.post(path, req);
  }

  async goToLogin() {
    const path = await this.apipath("an");

    window.location.replace(path);
  }

  async goToFund() {
    const path = await this.apipath("f");

    window.location.replace(path);
  }

  async logout() {
    const path = await this.apipath("an");

    axios.delete(path).then(() => window.location.reload(false));
  }

  async redirect() {
    const meta = await this.meta;
    if (this.meta.subefmrl()) {
      window.location.pathname = "/" + this.meta.ename();
      return;
    }

    window.location.pathname = "/";
  }

  async getAllAuth() {
    const path = await this.apipath("ax");

    const authxRes = await axios.get(path);
    this.useAuthxBundle(authxRes.data);
  }

  useAuthxBundle(authxBundle) {
    if (authxBundle.roles !== undefined) {
      this.roles = authxBundle.roles
        .map(Role.fromAuthxBundle)
        .sort(Role.roleByName);
    } else {
      this.roles = new Array();
    }

    if (authxBundle.no_role !== undefined) {
      this.noRole = authxBundle.no_role.map(Cred.fromAuthxBundle);
    } else {
      this.noRole = new Array();
    }
  }

  async saveAllAuth() {
    const path = await this.apipath("ax");

    const authxBundle = {
      roles: this.roles,
      no_role: this.noRole,
    };

    const authxRes = await axios.post(path, authxBundle);
    this.useAuthxBundle(authxRes.data);
  }

  getRoleByID(id) {
    let foundRole;

    const helper = (role) => {
      if (role.id == id) {
        foundRole = role;
      }
      role.children.forEach(helper);
    };
    this.roles.forEach(helper);

    return foundRole;
  }

  getCredByID(id) {
    let foundCred;

    const helper = (role) => {
      role.creds.forEach((cred) => {
        if (cred.id == id) {
          foundCred = cred;
        }
      });
      role.children.forEach(helper);
    };
    this.roles.forEach(helper);
    if (foundCred !== undefined) {
      return foundCred;
    }

    this.noRole.forEach((cred) => {
      if (cred.id == id) {
        foundCred = cred;
      }
    });
    if (foundCred !== undefined) {
      return foundCred;
    }

    return null;
  }

  async credReset() {
    const path = await this.apipath("cr");

    window.location.replace(path);
  }

  async credResetInfo() {
    const path = await this.apipath("ri");

    const res = await axios.get(path);
    return res.data;
  }
}

let fakeID = -1;

export class Role {
  constructor(id, name, parent, flags, perm, children, creds, needed_children) {
    this.id = id;
    if (this.id === undefined || this.id == 0) {
      this.id = fakeID;
      fakeID -= 1;
    }

    this.name = name;
    if (!this.name) {
      this.name = "";
    }

    this.parent = parent;
    if (!this.parent) {
      this.parent = 0;
    }

    this.flags = flags;
    if (!this.flags) {
      this.flags = 0;
    }

    this.perm = perm;
    if (!this.perm) {
      this.perm = 0;
    }

    this.children = children;
    if (!this.children) {
      this.children = new Array();
    }

    this.creds = creds;
    if (!this.creds) {
      this.creds = new Array();
    }

    this.needed_children = needed_children;
    if (this.needed_children === undefined) {
      this.needed_children = 0;
    }
  }

  static fromAuthxBundle(origin) {
    const res = new Role(
      origin.id,
      origin.name,
      origin.parent,
      origin.flags,
      origin.perm,
      origin.children,
      origin.creds,
      origin.needed_children
    );

    res.creds = res.creds.map(Cred.fromAuthxBundle);

    res.children = res.children.map(Role.fromAuthxBundle).sort(Role.roleByName);

    return res;
  }

  static roleByName(a, b) {
    if (a.name > b.name) {
      return 1;
    }
    if (b.name > a.name) {
      return -1;
    }
    return 0;
  }

  static noFakes(role) {
    if (role.id < 0) {
      role.id = 0;
      role.dirty = true;
    }

    role.creds = role.creds.map(Cred.noFakes);

    role.children = role.children.map(Role.noFakes);

    return role;
  }

  addCred(cred) {
    this.creds.push(cred);
  }

  deleteCred(id) {
    if (id < 0) {
      this.creds = this.creds.filter((c) => c.id != id);
      return;
    }

    const cred = this.creds.find((c) => c.id == id);
    if (!cred) {
      return;
    }

    cred.deleted = true;
  }
}

export class Cred {
  constructor(id) {
    this.id = id;
    if (this.id == 0) {
      this.id = fakeID;
      fakeID -= 1;
    }

    this.dirty = false;
    this.deleted = false;
  }

  static fromAuthxBundle(origin) {
    const res = new Cred(origin.id);

    if (origin.password !== undefined) {
      res.password = Password.fromAuthxBundle(origin.password);
    }
    if (origin.email !== undefined) {
      res.email = Email.fromAuthxBundle(origin.email);
    }

    return res;
  }

  static noFakes(cred) {
    if (cred.id < 0) {
      cred.id = 0;
      cred.dirty = true;
    }
    return cred;
  }

  pub() {
    if (this.password !== undefined) {
      return this.password.pub();
    }
    if (this.email !== undefined) {
      return this.email.pub();
    }
  }

  type() {
    if (this.password !== undefined) {
      return this.password.type();
    }
    if (this.email !== undefined) {
      return this.email.type();
    }
  }

  // returns true if this cred can be used to recover from losing/forgetting
  // other creds
  recovery() {
    if (this.email !== undefined && this.email.recovery()) {
      return true;
    }

    if (this.password !== undefined && this.password.recovery()) {
      return true;
    }

    return false;
  }

  conflict(other) {
    if (this.email !== undefined && this.email.conflict(other)) {
      return true;
    }

    if (this.password !== undefined && this.password.conflict(other)) {
      return true;
    }

    return false;
  }
}

export class Email {
  constructor(id, email) {
    this.id = id;
    this.email = email;
  }

  static fromAuthxBundle(origin) {
    return new Email(origin.id, origin.email);
  }

  recovery() {
    return true;
  }

  pub() {
    return this.email;
  }

  type() {
    return "email";
  }

  conflict(other) {
    return this.email == other;
  }
}

export class Password {
  constructor(id, name, plaintext, is_email) {
    this.id = id || 0;
    this.name = name || "";
    this.plaintext = plaintext || "";
    this.is_email = is_email || false;
  }

  static fromAuthxBundle(origin) {
    return new Password(origin.id, origin.name, "", false);
  }

  recovery() {
    return this.is_email;
  }

  pub() {
    return this.name;
  }

  type() {
    return "password";
  }

  conflict(other) {
    return this.name == other;
  }
}

export class TOTP {}

export class RoleTree {
  constructor(roles) {
    this.roles = new Set();
    const helper = (role) => {
      this.roles.add(role);
      role.children.forEach(helper);
    };

    roles.forEach(helper);
  }

  descendents(role) {
    let rc = new Set();
    const helper = function(role) {
      rc.add(role.id);
      role.children.forEach(helper);
    };

    helper(role);
    return rc;
  }

  find(roleID) {
    for (let role of this.roles) {
      if (role.id == roleID) {
        return role;
      }
    }

    return null;
  }

  visit(visitor, visitarg) {
    this.roles.forEach(visitor, visitarg);
  }
}
