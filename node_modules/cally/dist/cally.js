class se {
  /**
   * @type {T}
   */
  #t;
  #e = /* @__PURE__ */ new Set();
  /**
   * @param {T} current
   */
  constructor(t) {
    this.#t = t;
  }
  /**
   * @return {T}
   */
  get current() {
    return this.#t;
  }
  /**
   * @param {T} value
   */
  set current(t) {
    this.#t != t && (this.#t = t, this.#e.forEach((n) => n(t)));
  }
  /**
   * @type {import("hooks").Ref["on"]}
   */
  on(t) {
    return this.#e.add(t), () => this.#e.delete(t);
  }
}
const At = (e) => new se(e), nt = Symbol.for("atomico.hooks");
globalThis[nt] = globalThis[nt] || {};
let O = globalThis[nt];
const oe = Symbol.for("Atomico.suspense"), Ft = Symbol.for("Atomico.effect"), re = Symbol.for("Atomico.layoutEffect"), Rt = Symbol.for("Atomico.insertionEffect"), M = (e, t, n) => {
  const { i: s, hooks: r } = O.c, o = r[s] = r[s] || {};
  return o.value = e(o.value), o.effect = t, o.tag = n, O.c.i++, r[s].value;
}, ae = (e) => M((t = At(e)) => t), _ = () => M((e = At(O.c.host)) => e), $t = () => O.c.update, ce = (e, t, n = 0) => {
  let s = {}, r = !1;
  const o = () => r, a = (l, c) => {
    for (const d in s) {
      const f = s[d];
      f.effect && f.tag === l && (f.value = f.effect(f.value, c));
    }
  };
  return { load: (l) => {
    O.c = { host: t, hooks: s, update: e, i: 0, id: n };
    let c;
    try {
      r = !1, c = l();
    } catch (d) {
      if (d !== oe)
        throw d;
      r = !0;
    } finally {
      O.c = null;
    }
    return c;
  }, cleanEffects: (l) => (a(Rt, l), () => (a(re, l), () => {
    a(Ft, l);
  })), isSuspense: o };
}, A = Symbol.for;
function It(e, t) {
  const n = e.length;
  if (n !== t.length)
    return !1;
  for (let s = 0; s < n; s++) {
    let r = e[s], o = t[s];
    if (r !== o)
      return !1;
  }
  return !0;
}
const T = (e) => typeof e == "function", R = (e) => typeof e == "object", { isArray: ie } = Array, st = (e, t) => (t ? e instanceof HTMLStyleElement : !0) && "hydrate" in (e?.dataset || {});
function Ut(e, t) {
  let n;
  const s = (r) => {
    let { length: o } = r;
    for (let a = 0; a < o; a++) {
      const u = r[a];
      if (u && Array.isArray(u))
        s(u);
      else {
        const i = typeof u;
        if (u == null || i === "function" || i === "boolean")
          continue;
        i === "string" || i === "number" ? (n == null && (n = ""), n += u) : (n != null && (t(n), n = null), t(u));
      }
    }
  };
  s(e), n != null && t(n);
}
const Lt = (e, t, n) => (e.addEventListener(t, n), () => e.removeEventListener(t, n));
class _t {
  /**
   *
   * @param {HTMLElement} target
   * @param {string} message
   * @param {string} value
   */
  constructor(t, n, s) {
    this.message = n, this.target = t, this.value = s;
  }
}
class jt extends _t {
}
class le extends _t {
}
const x = "Custom", ue = null, fe = { true: 1, "": 1, 1: 1 };
function de(e, t, n, s, r) {
  const {
    type: o,
    reflect: a,
    event: u,
    value: i,
    attr: l = he(t)
  } = n?.name != x && R(n) && n != ue ? n : { type: n }, c = o?.name === x && o.map, d = i != null ? o == Function || !T(i) ? () => i : i : null;
  Object.defineProperty(e, t, {
    configurable: !0,
    /**
     * @this {import("dom").AtomicoThisInternal}
     * @param {any} newValue
     */
    set(f) {
      const m = this[t];
      d && o != Boolean && f == null && (f = d());
      const { error: E, value: g } = (c ? pe : be)(
        o,
        f
      );
      if (E && g != null)
        throw new jt(
          this,
          `The value defined for prop '${t}' must be of type '${o.name}'`,
          g
        );
      m != g && (this._props[t] = g ?? void 0, this.update(), u && Yt(this, u), this.updated.then(() => {
        a && (this._ignoreAttr = l, me(this, o, l, this[t]), this._ignoreAttr = null);
      }));
    },
    /**
     * @this {import("dom").AtomicoThisInternal}
     */
    get() {
      return this._props[t];
    }
  }), d && (r[t] = d()), s[l] = { prop: t, type: o };
}
const Yt = (e, { type: t, base: n = CustomEvent, ...s }) => e.dispatchEvent(new n(t, s)), he = (e) => e.replace(/([A-Z])/g, "-$1").toLowerCase(), me = (e, t, n, s) => s == null || t == Boolean && !s ? e.removeAttribute(n) : e.setAttribute(
  n,
  t?.name === x && t?.serialize ? t?.serialize(s) : R(s) ? JSON.stringify(s) : t == Boolean ? "" : s
), ye = (e, t) => e == Boolean ? !!fe[t] : e == Number ? Number(t) : e == String ? t : e == Array || e == Object ? JSON.parse(t) : e.name == x ? t : (
  // TODO: If when defining reflect the prop can also be of type string?
  new e(t)
), pe = ({ map: e }, t) => {
  try {
    return { value: e(t), error: !1 };
  } catch {
    return { value: t, error: !0 };
  }
}, be = (e, t) => e == null || t == null ? { value: t, error: !1 } : e != String && t === "" ? { value: void 0, error: !1 } : e == Object || e == Array || e == Symbol ? {
  value: t,
  error: {}.toString.call(t) !== `[object ${e.name}]`
} : t instanceof e ? {
  value: t,
  error: e == Number && Number.isNaN(t.valueOf())
} : e == String || e == Number || e == Boolean ? {
  value: t,
  error: e == Number ? typeof t != "number" ? !0 : Number.isNaN(t) : e == String ? typeof t != "string" : typeof t != "boolean"
} : { value: t, error: !0 };
let ge = 0;
const ve = (e) => {
  const t = (e?.dataset || {})?.hydrate || "";
  return t || "c" + ge++;
}, j = (e, t = HTMLElement) => {
  const n = {}, s = {}, r = "prototype" in t && t.prototype instanceof Element, o = r ? t : "base" in t ? t.base : HTMLElement, { props: a, styles: u } = r ? e : t;
  class i extends o {
    constructor() {
      super(), this._setup(), this._render = () => e({ ...this._props });
      for (const c in s)
        this[c] = s[c];
    }
    /**
     * @returns {import("core").Sheets[]}
     */
    static get styles() {
      return [super.styles, u];
    }
    async _setup() {
      if (this._props)
        return;
      this._props = {};
      let c, d;
      this.mounted = new Promise(
        (y) => this.mount = () => {
          y(), c != this.parentNode && (d != c ? this.unmounted.then(this.update) : this.update()), c = this.parentNode;
        }
      ), this.unmounted = new Promise(
        (y) => this.unmount = () => {
          y(), (c != this.parentNode || !this.isConnected) && (f.cleanEffects(!0)()(), d = this.parentNode, c = null);
        }
      ), this.symbolId = this.symbolId || Symbol(), this.symbolIdParent = Symbol();
      const f = ce(
        () => this.update(),
        this,
        ve(this)
      );
      let m, E = !0;
      const g = st(this);
      this.update = () => (m || (m = !0, this.updated = (this.updated || this.mounted).then(() => {
        try {
          const y = f.load(this._render), h = f.cleanEffects();
          return y && //@ts-ignore
          y.render(this, this.symbolId, g), m = !1, E && !f.isSuspense() && (E = !1, !g && Ee(this)), h();
        } finally {
          m = !1;
        }
      }).then(
        /**
         * @param {import("internal/hooks.js").CleanUseEffects} [cleanUseEffect]
         */
        (y) => {
          y && y();
        }
      )), this.updated), this.update();
    }
    connectedCallback() {
      this.mount(), super.connectedCallback && super.connectedCallback();
    }
    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback(), this.unmount();
    }
    /**
     * @this {import("dom").AtomicoThisInternal}
     * @param {string} attr
     * @param {(string|null)} oldValue
     * @param {(string|null)} value
     */
    attributeChangedCallback(c, d, f) {
      if (n[c]) {
        if (c === this._ignoreAttr || d === f)
          return;
        const { prop: m, type: E } = n[c];
        try {
          this[m] = ye(E, f);
        } catch {
          throw new le(
            this,
            `The value defined as attr '${c}' cannot be parsed by type '${E.name}'`,
            f
          );
        }
      } else
        super.attributeChangedCallback(c, d, f);
    }
    static get props() {
      return { ...super.props, ...a };
    }
    static get observedAttributes() {
      const c = super.observedAttributes || [];
      for (const d in a)
        de(this.prototype, d, a[d], n, s);
      return Object.keys(n).concat(c);
    }
  }
  return i;
};
function Ee(e) {
  const { styles: t } = e.constructor, { shadowRoot: n } = e;
  if (n && t.length) {
    const s = [];
    Ut(t, (r) => {
      r && (r instanceof Element ? n.appendChild(r.cloneNode(!0)) : s.push(r));
    }), s.length && (n.adoptedStyleSheets = s);
  }
}
const Bt = (e) => (t, n) => {
  M(
    /**
     * Clean the effect hook
     * @type {import("internal/hooks.js").CollectorEffect}
     */
    ([s, r] = []) => ((r || !r) && (r && It(r, n) ? s = s || !0 : (T(s) && s(), s = null)), [s, n]),
    /**
     * @returns {any}
     */
    ([s, r], o) => o ? (T(s) && s(), []) : [s || t(), r],
    e
  );
}, U = Bt(Ft), De = Bt(Rt);
class qt extends Array {
  /**
   *
   * @param {any} initialState
   * @param {(nextState: any, state:any[], mount: boolean )=>void} mapState
   */
  constructor(t, n) {
    let s = !0;
    const r = (o) => {
      try {
        n(o, this, s);
      } finally {
        s = !1;
      }
    };
    super(void 0, r, n), r(t);
  }
  /**
   * The following code allows a mutable approach to useState
   * and useProp this with the idea of allowing an alternative
   * approach similar to Vue or Qwik of state management
   * @todo pending review with the community
   */
  // get value() {
  //     return this[0];
  // }
  // set value(nextState) {
  //     this[2](nextState, this);
  // }
}
const ct = (e) => {
  const t = $t();
  return M(
    (n = new qt(e, (s, r, o) => {
      s = T(s) ? s(r[0]) : s, s !== r[0] && (r[0] = s, o || t());
    })) => n
  );
}, C = (e, t) => {
  const [n] = M(([s, r, o = 0] = []) => ((!r || r && !It(r, t)) && (s = e()), [s, t, o]));
  return n;
}, it = (e) => {
  const { current: t } = _();
  if (!(e in t))
    throw new jt(
      t,
      `For useProp("${e}"), the prop does not exist on the host.`,
      e
    );
  return M(
    (n = new qt(t[e], (s, r) => {
      s = T(s) ? s(t[e]) : s, t[e] = s;
    })) => (n[0] = t[e], n)
  );
}, P = (e, t = {}) => {
  const n = _();
  return n[e] || (n[e] = (s = t.detail) => Yt(n.current, {
    type: e,
    ...t,
    detail: s
  })), n[e];
}, ot = A("atomico/options");
globalThis[ot] = globalThis[ot] || {
  sheet: !!document.adoptedStyleSheets
};
const xt = globalThis[ot], Se = {
  checked: 1,
  value: 1,
  selected: 1
}, we = {
  list: 1,
  type: 1,
  size: 1,
  form: 1,
  width: 1,
  height: 1,
  src: 1,
  href: 1,
  slot: 1
}, Te = {
  shadowDom: 1,
  staticNode: 1,
  cloneNode: 1,
  children: 1,
  key: 1
}, q = {}, rt = [];
class at extends Text {
}
const Ce = A("atomico/id"), $ = A("atomico/type"), X = A("atomico/ref"), zt = A("atomico/vnode"), Pe = () => {
};
function Ne(e, t, n) {
  return Kt(this, e, t, n);
}
const Ht = (e, t, ...n) => {
  const s = t || q;
  let { children: r } = s;
  if (r = r ?? (n.length ? n : rt), e === Pe)
    return r;
  const o = e ? e instanceof Node ? 1 : (
    //@ts-ignore
    e.prototype instanceof HTMLElement && 2
  ) : 0;
  if (o === !1 && e instanceof Function)
    return e(
      r != rt ? { children: r, ...s } : s
    );
  const a = xt.render || Ne;
  return {
    [$]: zt,
    type: e,
    props: s,
    children: r,
    key: s.key,
    // key for lists by keys
    // define if the node declares its shadowDom
    shadow: s.shadowDom,
    // allows renderings to run only once
    static: s.staticNode,
    // defines whether the type is a childNode `1` or a constructor `2`
    raw: o,
    // defines whether to use the second parameter for document.createElement
    is: s.is,
    // clone the node if it comes from a reference
    clone: s.cloneNode,
    render: a
  };
};
function Kt(e, t, n = Ce, s, r) {
  let o;
  if (t && t[n] && t[n].vnode == e || e[$] != zt)
    return t;
  (e || !t) && (r = r || e.type == "svg", o = e.type != "host" && (e.raw == 1 ? (t && e.clone ? t[X] : t) != e.type : e.raw == 2 ? !(t instanceof e.type) : t ? t[X] || t.localName != e.type : !t), o && e.type != null && (e.raw == 1 && e.clone ? (s = !0, t = e.type.cloneNode(!0), t[X] = e.type) : t = e.raw == 1 ? e.type : e.raw == 2 ? new e.type() : r ? document.createElementNS(
    "http://www.w3.org/2000/svg",
    e.type
  ) : document.createElement(
    e.type,
    e.is ? { is: e.is } : void 0
  )));
  const a = t[n] ? t[n] : q, { vnode: u = q, cycle: i = 0 } = a;
  let { fragment: l, handlers: c } = a;
  const { children: d = rt, props: f = q } = u;
  if (c = o ? {} : c || {}, e.static && !o)
    return t;
  if (e.shadow && !t.shadowRoot && // @ts-ignore
  t.attachShadow({ mode: "open", ...e.shadow }), e.props != f && Me(t, f, e.props, c, r), e.children !== d) {
    const m = e.shadow ? t.shadowRoot : t;
    l = Oe(
      e.children,
      /**
       * @todo for hydration use attribute and send childNodes
       */
      l,
      m,
      n,
      // add support to foreignObject, children will escape from svg
      !i && s,
      r && e.type == "foreignObject" ? !1 : r
    );
  }
  return t[n] = { vnode: e, handlers: c, fragment: l, cycle: i + 1 }, t;
}
function ke(e, t) {
  const n = new at(""), s = new at("");
  let r;
  if (e[t ? "prepend" : "append"](n), t) {
    let { lastElementChild: o } = e;
    for (; o; ) {
      const { previousElementSibling: a } = o;
      if (st(o, !0) && !st(a, !0)) {
        r = o;
        break;
      }
      o = a;
    }
  }
  return r ? r.before(s) : e.append(s), {
    markStart: n,
    markEnd: s
  };
}
function Oe(e, t, n, s, r, o) {
  e = e == null ? null : ie(e) ? e : [e];
  const a = t || ke(n, r), { markStart: u, markEnd: i, keyes: l } = a;
  let c;
  const d = l && /* @__PURE__ */ new Set();
  let f = u;
  if (e && Ut(e, (m) => {
    if (typeof m == "object" && !m[$])
      return;
    const E = m[$] && m.key, g = l && E != null && l.get(E);
    f != i && f === g ? d.delete(f) : f = f == i ? i : f.nextSibling;
    const y = l ? g : f;
    let h = y;
    if (m[$])
      h = Kt(m, y, s, r, o);
    else {
      const S = m + "";
      !(h instanceof Text) || h instanceof at ? h = new Text(S) : h.data != S && (h.data = S);
    }
    h != f && (l && d.delete(h), !y || l ? (n.insertBefore(h, f), l && f != i && d.add(f)) : y == i ? n.insertBefore(h, i) : (n.replaceChild(h, y), f = h)), E != null && (c = c || /* @__PURE__ */ new Map(), c.set(E, h));
  }), f = f == i ? i : f.nextSibling, t && f != i)
    for (; f != i; ) {
      const m = f;
      f = f.nextSibling, m.remove();
    }
  return d && d.forEach((m) => m.remove()), a.keyes = c, a;
}
function Me(e, t, n, s, r) {
  for (const o in t)
    !(o in n) && St(e, o, t[o], null, r, s);
  for (const o in n)
    St(e, o, t[o], n[o], r, s);
}
function St(e, t, n, s, r, o) {
  if (t = t == "class" && !r ? "className" : t, n = n ?? null, s = s ?? null, t in e && Se[t] && (n = e[t]), !(s === n || Te[t] || t[0] == "_"))
    if (t[0] == "o" && t[1] == "n" && (T(s) || T(n)))
      Ae(e, t.slice(2), s, o);
    else if (t == "ref")
      s && (T(s) ? s(e) : s.current = e);
    else if (t == "style") {
      const { style: a } = e;
      n = n || "", s = s || "";
      const u = R(n), i = R(s);
      if (u)
        for (const l in n)
          if (i)
            !(l in s) && wt(a, l, null);
          else
            break;
      if (i)
        for (const l in s) {
          const c = s[l];
          u && n[l] === c || wt(a, l, c);
        }
      else
        a.cssText = s;
    } else {
      const a = t[0] == "$" ? t.slice(1) : t;
      a === t && (!r && !we[t] && t in e || T(s) || T(n)) ? e[t] = s ?? "" : s == null ? e.removeAttribute(a) : e.setAttribute(
        a,
        R(s) ? JSON.stringify(s) : s
      );
    }
}
function Ae(e, t, n, s) {
  if (s.handleEvent || (s.handleEvent = (r) => s[r.type].call(e, r)), n) {
    if (!s[t]) {
      const r = n.capture || n.once || n.passive ? Object.assign({}, n) : null;
      e.addEventListener(t, s, r);
    }
    s[t] = n;
  } else
    s[t] && (e.removeEventListener(t, s), delete s[t]);
}
function wt(e, t, n) {
  let s = "setProperty";
  n == null && (s = "removeProperty", n = null), ~t.indexOf("-") ? e[s](t, n) : e[t] = n;
}
const Tt = {};
function H(e, ...t) {
  const n = (e.raw || e).reduce(
    (s, r, o) => s + r + (t[o] || ""),
    ""
  );
  return Tt[n] = Tt[n] || Fe(n);
}
function Fe(e) {
  if (xt.sheet) {
    const t = new CSSStyleSheet();
    return t.replaceSync(e), t;
  } else {
    const t = document.createElement("style");
    return t.textContent = e, t;
  }
}
const Re = Ht("host", { style: "display: contents" }), G = A("atomico/context"), $e = (e, t) => {
  const n = _();
  De(
    () => Lt(
      n.current,
      "ConnectContext",
      /**
       * @param {CustomEvent<import("context").DetailConnectContext>} event
       */
      (s) => {
        e === s.detail.id && (s.stopPropagation(), s.detail.connect(t));
      }
    ),
    [e]
  );
}, Ie = (e) => {
  const t = P("ConnectContext", {
    bubbles: !0,
    composed: !0
  }), n = () => {
    let o;
    return t({
      id: e,
      connect(a) {
        o = a;
      }
    }), o;
  }, [s, r] = ct(
    n
  );
  return U(() => {
    s || (e[G] || (e[G] = customElements.whenDefined(
      new e().localName
    )), e[G].then(
      () => r(n)
    ));
  }, [e]), s;
}, Ue = (e) => {
  const t = Ie(e), n = $t();
  return U(() => {
    if (t)
      return Lt(t, "UpdatedValue", n);
  }, [t]), (t || e).value;
}, Le = (e) => {
  const t = j(
    () => ($e(t, _().current), Re),
    {
      props: {
        value: {
          type: Object,
          event: { type: "UpdatedValue" },
          value: () => e
        }
      }
    }
  );
  return t.value = e, t;
}, p = (e, t, n) => (t == null ? t = { key: n } : t.key = n, Ht(e, t)), I = p, Wt = H`*,*:before,*:after{box-sizing:border-box}button{padding:0;touch-action:manipulation;cursor:pointer;user-select:none}`, Jt = H`.vh{position:absolute;transform:scale(0)}`;
function lt() {
  const e = /* @__PURE__ */ new Date();
  return new v(e.getFullYear(), e.getMonth() + 1, e.getDate());
}
function ut(e, t = 0) {
  const n = w(e), s = n.getUTCDay(), r = (s < t ? 7 : 0) + s - t;
  return n.setUTCDate(n.getUTCDate() - r), v.from(n);
}
function Zt(e, t = 0) {
  return ut(e, t).add({ days: 6 });
}
function Xt(e) {
  return v.from(new Date(Date.UTC(e.year, e.month, 0)));
}
function K(e, t, n) {
  return t && v.compare(e, t) < 0 ? t : n && v.compare(e, n) > 0 ? n : e;
}
const _e = { days: 1 };
function je(e, t = 0) {
  let n = ut(e.toPlainDate(), t);
  const s = Zt(Xt(e), t), r = [];
  for (; v.compare(n, s) < 0; ) {
    const o = [];
    for (let a = 0; a < 7; a++)
      o.push(n), n = n.add(_e);
    r.push(o);
  }
  return r;
}
function w(e) {
  return new Date(Date.UTC(e.year, e.month - 1, e.day ?? 1));
}
const Ye = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[0-1])$/, Q = (e, t) => e.toString().padStart(t, "0");
class v {
  constructor(t, n, s) {
    this.year = t, this.month = n, this.day = s;
  }
  // this is an incomplete implementation that only handles arithmetic on a single unit at a time.
  // i didn't want to get into more complex arithmetic since it get tricky fast
  // this is enough to serve my needs and will still be a drop-in replacement when actual Temporal API lands
  add(t) {
    const n = w(this);
    if ("days" in t)
      return n.setUTCDate(this.day + t.days), v.from(n);
    let { year: s, month: r } = this;
    "months" in t ? (r = this.month + t.months, n.setUTCMonth(r - 1)) : (s = this.year + t.years, n.setUTCFullYear(s));
    const o = v.from(w({ year: s, month: r, day: 1 }));
    return K(v.from(n), o, Xt(o));
  }
  toString() {
    return `${Q(this.year, 4)}-${Q(this.month, 2)}-${Q(this.day, 2)}`;
  }
  toPlainYearMonth() {
    return new W(this.year, this.month);
  }
  equals(t) {
    return v.compare(this, t) === 0;
  }
  static compare(t, n) {
    return t.year < n.year ? -1 : t.year > n.year ? 1 : t.month < n.month ? -1 : t.month > n.month ? 1 : t.day < n.day ? -1 : t.day > n.day ? 1 : 0;
  }
  static from(t) {
    if (typeof t == "string") {
      const n = t.match(Ye);
      if (!n)
        throw new TypeError(t);
      const [, s, r, o] = n;
      return new v(
        parseInt(s, 10),
        parseInt(r, 10),
        parseInt(o, 10)
      );
    }
    return new v(
      t.getUTCFullYear(),
      t.getUTCMonth() + 1,
      t.getUTCDate()
    );
  }
}
class W {
  constructor(t, n) {
    this.year = t, this.month = n;
  }
  add(t) {
    const n = w(this), s = (t.months ?? 0) + (t.years ?? 0) * 12;
    return n.setUTCMonth(n.getUTCMonth() + s), new W(n.getUTCFullYear(), n.getUTCMonth() + 1);
  }
  equals(t) {
    return this.year === t.year && this.month === t.month;
  }
  toPlainDate() {
    return new v(this.year, this.month, 1);
  }
}
function z(e, t) {
  if (t)
    try {
      return e.from(t);
    } catch {
    }
}
function N(e) {
  const [t, n] = it(e);
  return [C(() => z(v, t), [t]), (o) => n(o?.toString())];
}
function Be(e) {
  const [t = "", n] = it(e);
  return [C(() => {
    const [o, a] = t.split("/"), u = z(v, o), i = z(v, a);
    return u && i ? [u, i] : [];
  }, [t]), (o) => n(`${o[0]}/${o[1]}`)];
}
function qe(e) {
  const [t = "", n] = it(e);
  return [C(() => {
    const o = [];
    for (const a of t.trim().split(/\s+/)) {
      const u = z(v, a);
      u && o.push(u);
    }
    return o;
  }, [t]), (o) => n(o.join(" "))];
}
function L(e, t) {
  return C(
    () => new Intl.DateTimeFormat(t, { timeZone: "UTC", ...e }),
    [t, e]
  );
}
function Ct(e, t, n) {
  const s = L(e, n);
  return C(() => {
    const r = [], o = /* @__PURE__ */ new Date();
    for (var a = 0; a < 7; a++) {
      const u = (o.getUTCDay() - t + 7) % 7;
      r[u] = s.format(o), o.setUTCDate(o.getUTCDate() + 1);
    }
    return r;
  }, [t, s]);
}
const Pt = (e, t, n) => K(e, t, n) === e, Nt = (e) => e.target.matches(":dir(ltr)"), xe = { month: "long", day: "numeric" }, ze = { month: "long" }, He = { weekday: "long" }, V = { bubbles: !0 };
function Ke({ props: e, context: t }) {
  const { offset: n } = e, {
    firstDayOfWeek: s,
    isDateDisallowed: r,
    min: o,
    max: a,
    today: u,
    page: i,
    locale: l,
    focusedDate: c,
    formatWeekday: d
  } = t, f = u ?? lt(), m = Ct(He, s, l), E = C(
    () => ({ weekday: d }),
    [d]
  ), g = Ct(E, s, l), y = L(xe, l), h = L(ze, l), S = C(
    () => i.start.add({ months: n }),
    [i, n]
  ), J = C(
    () => je(S, s),
    [S, s]
  ), Gt = P("focusday", V), Qt = P("selectday", V), Vt = P("hoverday", V);
  function pt(b) {
    Gt(K(b, o, a));
  }
  function te(b) {
    let D;
    switch (b.key) {
      case "ArrowRight":
        D = c.add({ days: Nt(b) ? 1 : -1 });
        break;
      case "ArrowLeft":
        D = c.add({ days: Nt(b) ? -1 : 1 });
        break;
      case "ArrowDown":
        D = c.add({ days: 7 });
        break;
      case "ArrowUp":
        D = c.add({ days: -7 });
        break;
      case "PageUp":
        D = c.add(b.shiftKey ? { years: -1 } : { months: -1 });
        break;
      case "PageDown":
        D = c.add(b.shiftKey ? { years: 1 } : { months: 1 });
        break;
      case "Home":
        D = ut(c, s);
        break;
      case "End":
        D = Zt(c, s);
        break;
      default:
        return;
    }
    pt(D), b.preventDefault();
  }
  function ee(b) {
    const D = S.equals(b);
    if (!t.showOutsideDays && !D)
      return;
    const ne = b.equals(c), bt = b.equals(f), Y = w(b), B = r?.(Y), gt = !Pt(b, o, a);
    let vt = "", k;
    if (t.type === "range") {
      const [F, Z] = t.value, Et = F?.equals(b), Dt = Z?.equals(b);
      k = F && Z && Pt(b, F, Z), vt = `${Et ? "range-start" : ""} ${Dt ? "range-end" : ""} ${k && !Et && !Dt ? "range-inner" : ""}`;
    } else
      t.type === "multi" ? k = t.value.some((F) => F.equals(b)) : k = t.value?.equals(b);
    return {
      part: `${`button day day-${Y.getDay()} ${// we don't want outside days to ever be shown as selected
      D ? k ? "selected" : "" : "outside"} ${B ? "disallowed" : ""} ${bt ? "today" : ""} ${t.getDayParts?.(Y) ?? ""}`} ${vt}`,
      tabindex: D && ne ? 0 : -1,
      disabled: gt,
      "aria-disabled": B ? "true" : void 0,
      "aria-pressed": D && k,
      "aria-current": bt ? "date" : void 0,
      "aria-label": y.format(Y),
      onkeydown: te,
      onclick() {
        B || Qt(b), pt(b);
      },
      onmouseover() {
        !B && !gt && Vt(b);
      }
    };
  }
  return {
    weeks: J,
    yearMonth: S,
    daysLong: m,
    daysVisible: g,
    formatter: h,
    getDayProps: ee
  };
}
const tt = lt(), ft = Le({
  type: "date",
  firstDayOfWeek: 1,
  focusedDate: tt,
  page: { start: tt.toPlainYearMonth(), end: tt.toPlainYearMonth() }
});
customElements.define("calendar-ctx", ft);
const We = (e, t) => (t + e) % 7, Je = j(
  (e) => {
    const t = Ue(ft), n = ae(), s = Ke({ props: e, context: t });
    function r() {
      n.current.querySelector("button[tabindex='0']")?.focus();
    }
    return /* @__PURE__ */ I("host", { shadowDom: !0, focus: r, children: [
      /* @__PURE__ */ p("div", { id: "h", part: "heading", children: s.formatter.format(w(s.yearMonth)) }),
      /* @__PURE__ */ I("table", { ref: n, "aria-labelledby": "h", part: "table", children: [
        /* @__PURE__ */ p("thead", { children: /* @__PURE__ */ p("tr", { part: "tr head", children: s.daysLong.map((o, a) => /* @__PURE__ */ I(
          "th",
          {
            part: `th day day-${We(t.firstDayOfWeek, a)}`,
            scope: "col",
            children: [
              /* @__PURE__ */ p("span", { class: "vh", children: o }),
              /* @__PURE__ */ p("span", { "aria-hidden": "true", children: s.daysVisible[a] })
            ]
          }
        )) }) }),
        /* @__PURE__ */ p("tbody", { children: s.weeks.map((o, a) => /* @__PURE__ */ p("tr", { part: "tr week", children: o.map((u, i) => {
          const l = s.getDayProps(u);
          return /* @__PURE__ */ p("td", { part: "td", children: l && /* @__PURE__ */ p("button", { ...l, children: u.day }) }, i);
        }) }, a)) })
      ] })
    ] });
  },
  {
    props: {
      offset: {
        type: Number,
        value: 0
      }
    },
    styles: [
      Wt,
      Jt,
      H`:host{--color-accent: black;--color-text-on-accent: white;display:flex;flex-direction:column;gap:.25rem;text-align:center;inline-size:fit-content}table{border-collapse:collapse;font-size:.875rem}th{font-weight:700;block-size:2.25rem}td{padding-inline:0}button{color:inherit;font-size:inherit;background:transparent;border:0;font-variant-numeric:tabular-nums;block-size:2.25rem;inline-size:2.25rem}button:hover:where(:not(:disabled,[aria-disabled])){background:#0000000d}button:is([aria-pressed=true],:focus-visible){background:var(--color-accent);color:var(--color-text-on-accent)}button:focus-visible{outline:1px solid var(--color-text-on-accent);outline-offset:-2px}button:disabled,:host::part(outside),:host::part(disallowed){cursor:default;opacity:.5}`
    ]
  }
);
customElements.define("calendar-month", Je);
function kt(e) {
  return /* @__PURE__ */ p(
    "button",
    {
      part: `button ${e.name} ${e.onclick ? "" : "disabled"}`,
      onclick: e.onclick,
      "aria-disabled": e.onclick ? null : "true",
      children: /* @__PURE__ */ p("slot", { name: e.name, children: e.children })
    }
  );
}
function dt(e) {
  const t = w(e.page.start), n = w(e.page.end);
  return /* @__PURE__ */ I("div", { role: "group", "aria-labelledby": "h", part: "container", children: [
    /* @__PURE__ */ p("div", { id: "h", class: "vh", "aria-live": "polite", "aria-atomic": "true", children: e.formatVerbose.formatRange(t, n) }),
    /* @__PURE__ */ I("div", { part: "header", children: [
      /* @__PURE__ */ p(kt, { name: "previous", onclick: e.previous, children: "Previous" }),
      /* @__PURE__ */ p("slot", { part: "heading", name: "heading", children: /* @__PURE__ */ p("div", { "aria-hidden": "true", children: e.format.formatRange(t, n) }) }),
      /* @__PURE__ */ p(kt, { name: "next", onclick: e.next, children: "Next" })
    ] }),
    /* @__PURE__ */ p(
      ft,
      {
        value: e,
        onselectday: e.onSelect,
        onfocusday: e.onFocus,
        onhoverday: e.onHover,
        children: /* @__PURE__ */ p("slot", {})
      }
    )
  ] });
}
const ht = {
  value: {
    type: String,
    value: ""
  },
  min: {
    type: String,
    value: ""
  },
  max: {
    type: String,
    value: ""
  },
  today: {
    type: String,
    value: ""
  },
  isDateDisallowed: {
    type: Function,
    value: (e) => !1
  },
  formatWeekday: {
    type: String,
    value: () => "narrow"
  },
  getDayParts: {
    type: Function,
    value: (e) => ""
  },
  firstDayOfWeek: {
    type: Number,
    value: () => 1
  },
  showOutsideDays: {
    type: Boolean,
    value: !1
  },
  locale: {
    type: String,
    value: () => {
    }
  },
  months: {
    type: Number,
    value: 1
  },
  focusedDate: {
    type: String,
    value: () => {
    }
  },
  pageBy: {
    type: String,
    value: () => "months"
  }
}, mt = [
  Wt,
  Jt,
  H`:host{display:block;inline-size:fit-content}[role=group]{display:flex;flex-direction:column;gap:1em}:host::part(header){display:flex;align-items:center;justify-content:space-between}:host::part(heading){font-weight:700;font-size:1.25em}button{display:flex;align-items:center;justify-content:center}button[aria-disabled]{cursor:default;opacity:.5}`
], Ze = { year: "numeric" }, Xe = { year: "numeric", month: "long" };
function et(e, t) {
  return (t.year - e.year) * 12 + t.month - e.month;
}
const Ot = (e, t) => (e = t === 12 ? new W(e.year, 1) : e, {
  start: e,
  end: e.add({ months: t - 1 })
});
function Ge({
  pageBy: e,
  focusedDate: t,
  months: n,
  max: s,
  min: r,
  goto: o
}) {
  const a = e === "single" ? 1 : n, [u, i] = ct(
    () => Ot(t.toPlainYearMonth(), n)
  ), l = (d) => i(Ot(u.start.add({ months: d }), n)), c = (d) => {
    const f = et(u.start, d.toPlainYearMonth());
    return f >= 0 && f < n;
  };
  return U(() => {
    if (c(t))
      return;
    const d = et(t.toPlainYearMonth(), u.start);
    o(t.add({ months: d }));
  }, [u.start]), U(() => {
    if (c(t))
      return;
    const d = et(u.start, t.toPlainYearMonth());
    l(d === -1 ? -a : d === n ? a : Math.floor(d / n) * n);
  }, [t, a, n]), {
    page: u,
    previous: !r || !c(r) ? () => l(-a) : void 0,
    next: !s || !c(s) ? () => l(a) : void 0
  };
}
function yt({
  months: e,
  pageBy: t,
  locale: n,
  focusedDate: s,
  setFocusedDate: r
}) {
  const [o] = N("min"), [a] = N("max"), [u] = N("today"), i = P("focusday"), l = P("change"), c = C(
    () => K(s ?? u ?? lt(), o, a),
    [s, u, o, a]
  );
  function d(h) {
    r(h), i(w(h));
  }
  const { next: f, previous: m, page: E } = Ge({
    pageBy: t,
    focusedDate: c,
    months: e,
    min: o,
    max: a,
    goto: d
  }), g = _();
  function y(h) {
    const S = h?.target ?? "day";
    S === "day" ? g.current.querySelectorAll("calendar-month").forEach((J) => J.focus(h)) : g.current.shadowRoot.querySelector(`[part~='${S}']`).focus(h);
  }
  return {
    format: L(Ze, n),
    formatVerbose: L(Xe, n),
    page: E,
    focusedDate: c,
    dispatch: l,
    onFocus(h) {
      h.stopPropagation(), d(h.detail), setTimeout(y);
    },
    min: o,
    max: a,
    today: u,
    next: f,
    previous: m,
    focus: y
  };
}
const Qe = j(
  (e) => {
    const [t, n] = N("value"), [s = t, r] = N("focusedDate"), o = yt({
      ...e,
      focusedDate: s,
      setFocusedDate: r
    });
    function a(u) {
      n(u.detail), o.dispatch();
    }
    return /* @__PURE__ */ p("host", { shadowDom: !0, focus: o.focus, children: /* @__PURE__ */ p(
      dt,
      {
        ...e,
        ...o,
        type: "date",
        value: t,
        onSelect: a
      }
    ) });
  },
  { props: ht, styles: mt }
);
customElements.define("calendar-date", Qe);
const Mt = (e, t) => v.compare(e, t) < 0 ? [e, t] : [t, e], Ve = j(
  (e) => {
    const [t, n] = Be("value"), [s = t[0], r] = N("focusedDate"), o = yt({
      ...e,
      focusedDate: s,
      setFocusedDate: r
    }), a = P("rangestart"), u = P("rangeend"), [i, l] = N(
      "tentative"
    ), [c, d] = ct();
    U(() => d(void 0), [i]);
    function f(y) {
      o.onFocus(y), m(y);
    }
    function m(y) {
      y.stopPropagation(), i && d(y.detail);
    }
    function E(y) {
      const h = y.detail;
      y.stopPropagation(), i ? (n(Mt(i, h)), l(void 0), u(w(h)), o.dispatch()) : (l(h), a(w(h)));
    }
    const g = i ? Mt(i, c ?? i) : t;
    return /* @__PURE__ */ p("host", { shadowDom: !0, focus: o.focus, children: /* @__PURE__ */ p(
      dt,
      {
        ...e,
        ...o,
        type: "range",
        value: g,
        onFocus: f,
        onHover: m,
        onSelect: E
      }
    ) });
  },
  {
    props: {
      ...ht,
      tentative: {
        type: String,
        value: ""
      }
    },
    styles: mt
  }
);
customElements.define("calendar-range", Ve);
const tn = j(
  (e) => {
    const [t, n] = qe("value"), [s = t[0], r] = N("focusedDate"), o = yt({
      ...e,
      focusedDate: s,
      setFocusedDate: r
    });
    function a(u) {
      const i = [...t], l = t.findIndex((c) => c.equals(u.detail));
      l < 0 ? i.push(u.detail) : i.splice(l, 1), n(i), o.dispatch();
    }
    return /* @__PURE__ */ p("host", { shadowDom: !0, focus: o.focus, children: /* @__PURE__ */ p(
      dt,
      {
        ...e,
        ...o,
        type: "multi",
        value: t,
        onSelect: a
      }
    ) });
  },
  { props: ht, styles: mt }
);
customElements.define("calendar-multi", tn);
export {
  Qe as CalendarDate,
  Je as CalendarMonth,
  tn as CalendarMulti,
  Ve as CalendarRange
};
