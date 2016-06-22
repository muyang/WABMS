(function() {
  var Agent, AgentSet, Agents, Animator, Color, ColorMap, DataColorMap, Evented, Link, Links, Model, Patch, Patches, Shapes, Util, shapes, u, util,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Util = util = u = {
    error: function(s) {
      throw new Error(s);
    },
    MaxINT: Math.pow(2, 53),
    MinINT: -Math.pow(2, 53),
    MaxINT32: 0 | 0x7fffffff,
    MinINT32: 0 | 0x80000000,
    isArray: Array.isArray || function(obj) {
      return !!(obj && obj.concat && obj.unshift && !obj.callee);
    },
    isFunction: function(obj) {
      return !!(obj && obj.constructor && obj.call && obj.apply);
    },
    isString: function(obj) {
      return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
    },
    randomSeed: function(seed) {
      if (seed == null) {
        seed = 123456;
      }
      return Math.random = function() {
        var x;
        x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
      };
    },
    randomInt: function(max) {
      return Math.floor(Math.random() * max);
    },
    randomInt2: function(min, max) {
      return min + Math.floor(Math.random() * (max - min));
    },
    randomNormal: function(mean, sigma) {
      var norm, u1, u2;
      if (mean == null) {
        mean = 0.0;
      }
      if (sigma == null) {
        sigma = 1.0;
      }
      u1 = 1.0 - Math.random();
      u2 = Math.random();
      norm = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      return norm * sigma + mean;
    },
    randomFloat: function(max) {
      return Math.random() * max;
    },
    randomFloat2: function(min, max) {
      return min + Math.random() * (max - min);
    },
    randomCentered: function(r) {
      return this.randomFloat2(-r / 2, r / 2);
    },
    log10: function(n) {
      return Math.log(n) / Math.LN10;
    },
    log2: function(n) {
      return this.logN(n, 2);
    },
    logN: function(n, base) {
      return Math.log(n) / Math.log(base);
    },
    mod: function(v, n) {
      return ((v % n) + n) % n;
    },
    wrap: function(v, min, max) {
      return min + this.mod(v - min, max - min);
    },
    clamp: function(v, min, max) {
      return Math.max(Math.min(v, max), min);
    },
    sign: function(v) {
      if (v < 0) {
        return -1;
      } else {
        return 1;
      }
    },
    fixed: function(n, p) {
      if (p == null) {
        p = 2;
      }
      p = Math.pow(10, p);
      return Math.round(n * p) / p;
    },
    aToFixed: function(a, p) {
      var i, _i, _len, _results;
      if (p == null) {
        p = 2;
      }
      _results = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        i = a[_i];
        _results.push(i.toFixed(p));
      }
      return _results;
    },
    tls: function(n) {
      return n.toLocaleString();
    },
    randomColor: function(c) {
      var i, _i;
      if (c == null) {
        c = [];
      }
      if (c.str != null) {
        c.str = null;
      }
      for (i = _i = 0; _i <= 2; i = ++_i) {
        c[i] = this.randomInt(256);
      }
      return c;
    },
    randomGray: function(c, min, max) {
      var i, r, _i;
      if (c == null) {
        c = [];
      }
      if (min == null) {
        min = 64;
      }
      if (max == null) {
        max = 192;
      }
      if (arguments.length === 2) {
        return this.randomGray(null, c, min);
      }
      if (c.str != null) {
        c.str = null;
      }
      r = this.randomInt2(min, max);
      for (i = _i = 0; _i <= 2; i = ++_i) {
        c[i] = r;
      }
      return c;
    },
    randomMapColor: function(c, set) {
      if (c == null) {
        c = [];
      }
      if (set == null) {
        set = [0, 63, 127, 191, 255];
      }
      return this.setColor(c, this.oneOf(set), this.oneOf(set), this.oneOf(set));
    },
    randomBrightColor: function(c) {
      if (c == null) {
        c = [];
      }
      return this.randomMapColor(c, [0, 127, 255]);
    },
    randomHSBColor: function(c) {
      if (c == null) {
        c = [];
      }
      return c = this.hsbToRgb([this.randomInt(51) * 5, 255, 255]);
    },
    setColor: function(c, r, g, b, a) {
      if (c.str != null) {
        c.str = null;
      }
      c[0] = r;
      c[1] = g;
      c[2] = b;
      if (a != null) {
        c[3] = a;
      }
      return c;
    },
    setGray: function(c, g, a) {
      return this.setColor(c, g, g, g, a);
    },
    scaleColor: function(max, s, c) {
      var i, val, _i, _len;
      if (c == null) {
        c = [];
      }
      if (c.str != null) {
        c.str = null;
      }
      for (i = _i = 0, _len = max.length; _i < _len; i = ++_i) {
        val = max[i];
        c[i] = this.clamp(Math.round(val * s), 0, 255);
      }
      return c;
    },
    scaleOpacity: function(rgba, scale, result) {
      if (result == null) {
        result = u.clone(rgba);
      }
      if (result.str != null) {
        result.str = null;
      }
      if (rgba.length === 3) {
        rgba.push(1);
      }
      result[3] = this.clamp(rgba[3] * scale, 0, 1).toFixed(3);
      return result;
    },
    colorStr: function(c) {
      var s;
      if ((s = c.str) != null) {
        return s;
      }
      if (c.length === 4 && c[3] > 1) {
        this.error("alpha > 1");
      }
      return c.str = c.length === 3 ? "rgb(" + c + ")" : "rgba(" + c + ")";
    },
    colorsEqual: function(c1, c2) {
      return c1.toString() === c2.toString();
    },
    rgbToGray: function(c) {
      return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    },
    rgbToHsb: function(c) {
      var b, d, g, h, max, min, r, s, v;
      r = c[0] / 255;
      g = c[1] / 255;
      b = c[2] / 255;
      max = Math.max(r, g, b);
      min = Math.min(r, g, b);
      v = max;
      h = 0;
      d = max - min;
      s = max === 0 ? 0 : d / max;
      if (max !== min) {
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
        }
      }
      return [Math.round(255 * h / 6), Math.round(255 * s), Math.round(255 * v)];
    },
    hsbToRgb: function(c) {
      var b, f, g, h, i, p, q, r, s, t, v;
      h = c[0] / 255;
      s = c[1] / 255;
      v = c[2] / 255;
      i = Math.floor(h * 6);
      f = h * 6 - i;
      p = v * (1 - s);
      q = v * (1 - f * s);
      t = v * (1 - (1 - f) * s);
      switch (i % 6) {
        case 0:
          r = v;
          g = t;
          b = p;
          break;
        case 1:
          r = q;
          g = v;
          b = p;
          break;
        case 2:
          r = p;
          g = v;
          b = t;
          break;
        case 3:
          r = p;
          g = q;
          b = v;
          break;
        case 4:
          r = t;
          g = p;
          b = v;
          break;
        case 5:
          r = v;
          g = p;
          b = q;
      }
      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    },
    rgbMap: function(R, G, B) {
      var b, g, i, map, r, _i, _j, _k, _len, _len1, _len2;
      if (G == null) {
        G = R;
      }
      if (B == null) {
        B = R;
      }
      if (typeof R === "number") {
        R = (function() {
          var _i, _results;
          _results = [];
          for (i = _i = 0; 0 <= R ? _i < R : _i > R; i = 0 <= R ? ++_i : --_i) {
            _results.push(Math.round(i * 255 / (R - 1)));
          }
          return _results;
        })();
      }
      if (typeof G === "number") {
        G = (function() {
          var _i, _results;
          _results = [];
          for (i = _i = 0; 0 <= G ? _i < G : _i > G; i = 0 <= G ? ++_i : --_i) {
            _results.push(Math.round(i * 255 / (G - 1)));
          }
          return _results;
        })();
      }
      if (typeof B === "number") {
        B = (function() {
          var _i, _results;
          _results = [];
          for (i = _i = 0; 0 <= B ? _i < B : _i > B; i = 0 <= B ? ++_i : --_i) {
            _results.push(Math.round(i * 255 / (B - 1)));
          }
          return _results;
        })();
      }
      map = [];
      for (_i = 0, _len = R.length; _i < _len; _i++) {
        r = R[_i];
        for (_j = 0, _len1 = G.length; _j < _len1; _j++) {
          g = G[_j];
          for (_k = 0, _len2 = B.length; _k < _len2; _k++) {
            b = B[_k];
            map.push([r, g, b]);
          }
        }
      }
      return map;
    },
    grayMap: function() {
      var i, _i, _results;
      _results = [];
      for (i = _i = 0; _i <= 255; i = ++_i) {
        _results.push([i, i, i]);
      }
      return _results;
    },
    hsbMap: function(n, s, b) {
      var i, _i, _results;
      if (n == null) {
        n = 256;
      }
      if (s == null) {
        s = 255;
      }
      if (b == null) {
        b = 255;
      }
      _results = [];
      for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
        _results.push(this.hsbToRgb([i * 255 / (n - 1), s, b]));
      }
      return _results;
    },
    gradientMap: function(nColors, stops, locs) {
      var ctx, grad, i, id, _i, _j, _ref, _ref1, _results;
      if (locs == null) {
        locs = (function() {
          var _i, _ref, _results;
          _results = [];
          for (i = _i = 0, _ref = stops.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            _results.push(i / (stops.length - 1));
          }
          return _results;
        })();
      }
      ctx = this.createCtx(nColors, 1);
      grad = ctx.createLinearGradient(0, 0, nColors, 0);
      for (i = _i = 0, _ref = stops.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        grad.addColorStop(locs[i], this.colorStr(stops[i]));
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, nColors, 1);
      id = this.ctxToImageData(ctx).data;
      _results = [];
      for (i = _j = 0, _ref1 = id.length; _j < _ref1; i = _j += 4) {
        _results.push([id[i], id[i + 1], id[i + 2]]);
      }
      return _results;
    },
    isLittleEndian: function() {
      var d32;
      d32 = new Uint32Array([0x01020304]);
      return (new Uint8ClampedArray(d32.buffer))[0] === 4;
    },
    degToRad: function(degrees) {
      return degrees * Math.PI / 180;
    },
    radToDeg: function(radians) {
      return radians * 180 / Math.PI;
    },
    subtractRads: function(rad1, rad2) {
      var PI, dr;
      dr = rad1 - rad2;
      PI = Math.PI;
      if (dr <= -PI) {
        dr += 2 * PI;
      }
      if (dr > PI) {
        dr -= 2 * PI;
      }
      return dr;
    },
    ownKeys: function(obj) {
      var key, value, _results;
      _results = [];
      for (key in obj) {
        if (!__hasProp.call(obj, key)) continue;
        value = obj[key];
        _results.push(key);
      }
      return _results;
    },
    ownVarKeys: function(obj) {
      var key, value, _results;
      _results = [];
      for (key in obj) {
        if (!__hasProp.call(obj, key)) continue;
        value = obj[key];
        if (!this.isFunction(value)) {
          _results.push(key);
        }
      }
      return _results;
    },
    ownValues: function(obj) {
      var key, value, _results;
      _results = [];
      for (key in obj) {
        if (!__hasProp.call(obj, key)) continue;
        value = obj[key];
        _results.push(value);
      }
      return _results;
    },
    cloneObject: function(obj) {
      var key, newObj, value;
      newObj = {};
      for (key in obj) {
        if (!__hasProp.call(obj, key)) continue;
        value = obj[key];
        newObj[key] = obj[key];
      }
      if (obj.__proto__ !== Object.prototype) {
        console.log("cloneObject, setting proto");
        newObj.__proto__ = obj.__proto__;
      }
      return newObj;
    },
    cloneClass: function(oldClass, newName) {
      var ctorStr;
      ctorStr = oldClass.toString().replace(/^/, "var ctor = ");
      if (newName) {
        ctorStr = ctorStr.replace(/function.*{/, "function " + newName + "() {");
      }
      eval(ctorStr);
      ctor.prototype = this.cloneObject(oldClass.prototype);
      ctor.constructor = oldClass.constructor;
      ctor.prototype.constructor = oldClass.prototype.constructor;
      return ctor;
    },
    mixin: function(destObj, srcObject) {
      var key, _ref, _results;
      for (key in srcObject) {
        if (!__hasProp.call(srcObject, key)) continue;
        destObj[key] = srcObject[key];
      }
      _ref = srcObject.__proto__;
      _results = [];
      for (key in _ref) {
        if (!__hasProp.call(_ref, key)) continue;
        _results.push(destObj.__proto__[key] = srcObject.__proto__[key]);
      }
      return _results;
    },
    parseToPrimitive: function(s) {
      var e;
      try {
        return JSON.parse(s);
      } catch (_error) {
        e = _error;
        return decodeURIComponent(s);
      }
    },
    parseQueryString: function(query) {
      var res, s, t, _i, _len, _ref;
      if (query == null) {
        query = window.location.search.substring(1);
      }
      res = {};
      _ref = query.split("&");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        if (!(query.length !== 0)) {
          continue;
        }
        t = s.split("=");
        res[t[0]] = t.length === 1 ? true : this.parseToPrimitive(t[1]);
      }
      return res;
    },
    any: function(array) {
      return array.length !== 0;
    },
    empty: function(array) {
      return array.length === 0;
    },
    clone: function(array, begin, end) {
      var op;
      op = array.slice != null ? "slice" : "subarray";
      if (begin != null) {
        return array[op](begin, end);
      } else {
        return array[op](0);
      }
    },
    last: function(array) {
      if (this.empty(array)) {
        this.error("last: empty array");
      }
      return array[array.length - 1];
    },
    oneOf: function(array) {
      if (this.empty(array)) {
        this.error("oneOf: empty array");
      }
      return array[this.randomInt(array.length)];
    },
    nOf: function(array, n) {
      var o, r;
      n = Math.min(array.length, Math.floor(n));
      r = [];
      while (r.length < n) {
        o = this.oneOf(array);
        if (__indexOf.call(r, o) < 0) {
          r.push(o);
        }
      }
      return r;
    },
    contains: function(array, item, f) {
      return this.indexOf(array, item, f) >= 0;
    },
    removeItem: function(array, item, f) {
      var i;
      if (!((i = this.indexOf(array, item, f)) < 0)) {
        return array.splice(i, 1);
      } else {
        return this.error("removeItem: item not found");
      }
    },
    removeItems: function(array, items, f) {
      var i, _i, _len;
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        i = items[_i];
        this.removeItem(array, i, f);
      }
      return array;
    },
    insertItem: function(array, item, f) {
      var i;
      i = this.sortedIndex(array, item, f);
      if (array[i] === item) {
        error("insertItem: item already in array");
      }
      return array.splice(i, 0, item);
    },
    shuffle: function(array) {
      return array.sort(function() {
        return 0.5 - Math.random();
      });
    },
    minOneOf: function(array, f, valueToo) {
      var a, o, r, r1, _i, _len;
      if (f == null) {
        f = this.identity;
      }
      if (valueToo == null) {
        valueToo = false;
      }
      if (this.empty(array)) {
        this.error("minOneOf: empty array");
      }
      r = Infinity;
      o = null;
      if (this.isString(f)) {
        f = this.propFcn(f);
      }
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        a = array[_i];
        if ((r1 = f(a)) < r) {
          r = r1;
          o = a;
        }
      }
      if (valueToo) {
        return [o, r];
      } else {
        return o;
      }
    },
    maxOneOf: function(array, f, valueToo) {
      var a, o, r, r1, _i, _len;
      if (f == null) {
        f = this.identity;
      }
      if (valueToo == null) {
        valueToo = false;
      }
      if (this.empty(array)) {
        this.error("maxOneOf: empty array");
      }
      r = -Infinity;
      o = null;
      if (this.isString(f)) {
        f = this.propFcn(f);
      }
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        a = array[_i];
        if ((r1 = f(a)) > r) {
          r = r1;
          o = a;
        }
      }
      if (valueToo) {
        return [o, r];
      } else {
        return o;
      }
    },
    firstOneOf: function(array, f) {
      var a, i, _i, _len;
      for (i = _i = 0, _len = array.length; _i < _len; i = ++_i) {
        a = array[i];
        if (f(a)) {
          return i;
        }
      }
      return -1;
    },
    histOf: function(array, bin, f) {
      var a, i, r, ri, val, _i, _j, _len, _len1;
      if (bin == null) {
        bin = 1;
      }
      if (f == null) {
        f = function(i) {
          return i;
        };
      }
      r = [];
      if (this.isString(f)) {
        f = this.propFcn(f);
      }
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        a = array[_i];
        i = Math.floor(f(a) / bin);
        r[i] = (ri = r[i]) != null ? ri + 1 : 1;
      }
      for (i = _j = 0, _len1 = r.length; _j < _len1; i = ++_j) {
        val = r[i];
        if (val == null) {
          r[i] = 0;
        }
      }
      return r;
    },
    sortBy: function(array, f) {
      if (this.isString(f)) {
        f = this.propFcn(f);
      }
      return array.sort(function(a, b) {
        return f(a) - f(b);
      });
    },
    sortNums: function(array, ascending) {
      var f;
      if (ascending == null) {
        ascending = true;
      }
      f = ascending ? function(a, b) {
        return a - b;
      } : function(a, b) {
        return b - a;
      };
      if (array.sort != null) {
        return array.sort(f);
      } else {
        return Array.prototype.sort.call(array, f);
      }
    },
    uniq: function(array) {
      var i, _i, _ref;
      if (array.length < 2) {
        return array;
      }
      for (i = _i = _ref = array.length - 1; _i >= 1; i = _i += -1) {
        if (array[i - 1] === array[i]) {
          array.splice(i, 1);
        }
      }
      return array;
    },
    flatten: function(matrix) {
      return matrix.reduce(function(a, b) {
        return a.concat(b);
      });
    },
    aProp: function(array, propOrFn) {
      var a, _i, _j, _len, _len1, _results, _results1;
      if (typeof propOrFn === 'function') {
        _results = [];
        for (_i = 0, _len = array.length; _i < _len; _i++) {
          a = array[_i];
          _results.push(propOrFn(a));
        }
        return _results;
      } else {
        _results1 = [];
        for (_j = 0, _len1 = array.length; _j < _len1; _j++) {
          a = array[_j];
          _results1.push(a[propOrFn]);
        }
        return _results1;
      }
    },
    aToObj: function(array, names) {
      var i, n, _i, _len;
      for (i = _i = 0, _len = names.length; _i < _len; i = ++_i) {
        n = names[i];
        array[n] = array[i];
      }
      return array;
    },
    aMax: function(array) {
      var a, v, _i, _len;
      v = array[0];
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        a = array[_i];
        v = Math.max(v, a);
      }
      return v;
    },
    aMin: function(array) {
      var a, v, _i, _len;
      v = array[0];
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        a = array[_i];
        v = Math.min(v, a);
      }
      return v;
    },
    aSum: function(array) {
      var a, v, _i, _len;
      v = 0;
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        a = array[_i];
        v += a;
      }
      return v;
    },
    aAvg: function(array) {
      return this.aSum(array) / array.length;
    },
    aMid: function(array) {
      array = array.sort != null ? this.clone(array) : this.typedToJS(array);
      this.sortNums(array);
      return array[Math.floor(array.length / 2)];
    },
    aStats: function(array) {
      var avg, max, mid, min;
      min = this.aMin(array);
      max = this.aMax(array);
      avg = this.aAvg(array);
      mid = this.aMid(array);
      return {
        min: min,
        max: max,
        avg: avg,
        mid: mid
      };
    },
    aNaNs: function(array) {
      var i, v, _i, _len, _results;
      _results = [];
      for (i = _i = 0, _len = array.length; _i < _len; i = ++_i) {
        v = array[i];
        if (isNaN(v)) {
          _results.push(i);
        }
      }
      return _results;
    },
    aRange: function(start, stop, step) {
      var x, _i, _results;
      if (step == null) {
        step = 1;
      }
      _results = [];
      for (x = _i = start; step > 0 ? _i <= stop : _i >= stop; x = _i += step) {
        _results.push(x);
      }
      return _results;
    },
    aRamp: function(start, stop, numItems) {
      var i, step, _i, _results;
      step = (stop - start) / (numItems - 1);
      _results = [];
      for (i = _i = 0; 0 <= numItems ? _i < numItems : _i > numItems; i = 0 <= numItems ? ++_i : --_i) {
        _results.push(start + step * i);
      }
      return _results;
    },
    aIntRamp: function(start, stop, numItems) {
      var num, _i, _len, _ref, _results;
      _ref = this.aRamp(start, stop, numItems);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        num = _ref[_i];
        _results.push(Math.round(num));
      }
      return _results;
    },
    aPairwise: function(a1, a2, f) {
      var i, v, _i, _len, _results;
      v = 0;
      _results = [];
      for (i = _i = 0, _len = a1.length; _i < _len; i = ++_i) {
        v = a1[i];
        _results.push(f(v, a2[i]));
      }
      return _results;
    },
    aPairSum: function(a1, a2) {
      return this.aPairwise(a1, a2, function(a, b) {
        return a + b;
      });
    },
    aPairDif: function(a1, a2) {
      return this.aPairwise(a1, a2, function(a, b) {
        return a - b;
      });
    },
    aPairMul: function(a1, a2) {
      return this.aPairwise(a1, a2, function(a, b) {
        return a * b;
      });
    },
    typedToJS: function(typedArray) {
      var i, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = typedArray.length; _i < _len; _i++) {
        i = typedArray[_i];
        _results.push(i);
      }
      return _results;
    },
    lerp: function(lo, hi, scale) {
      if (lo <= hi) {
        return lo + (hi - lo) * scale;
      } else {
        return lo - (lo - hi) * scale;
      }
    },
    lerpScale: function(number, lo, hi) {
      return (number - lo) / (hi - lo);
    },
    lerp2: function(x0, y0, x1, y1, scale) {
      return [this.lerp(x0, x1, scale), this.lerp(y0, y1, scale)];
    },
    normalize: function(array, lo, hi) {
      var max, min, num, scale, _i, _len, _results;
      if (lo == null) {
        lo = 0;
      }
      if (hi == null) {
        hi = 1;
      }
      min = this.aMin(array);
      max = this.aMax(array);
      scale = 1 / (max - min);
      _results = [];
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        num = array[_i];
        _results.push(this.lerp(lo, hi, scale * (num - min)));
      }
      return _results;
    },
    normalize8: function(array) {
      return new Uint8ClampedArray(this.normalize(array, -.5, 255.5));
    },
    normalizeInt: function(array, lo, hi) {
      var i, _i, _len, _ref, _results;
      _ref = this.normalize(array, lo, hi);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        _results.push(Math.round(i));
      }
      return _results;
    },
    sortedIndex: function(array, item, f) {
      var high, low, mid, value;
      if (f == null) {
        f = function(o) {
          return o;
        };
      }
      if (this.isString(f)) {
        f = this.propFcn(f);
      }
      value = f(item);
      low = 0;
      high = array.length;
      while (low < high) {
        mid = (low + high) >>> 1;
        if (f(array[mid]) < value) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return low;
    },
    identity: function(o) {
      return o;
    },
    propFcn: function(prop) {
      return function(o) {
        return o[prop];
      };
    },
    indexOf: function(array, item, property) {
      var i;
      if (property != null) {
        i = this.sortedIndex(array, item, property === "" ? null : property);
        if (array[i] === item) {
          return i;
        } else {
          return -1;
        }
      } else {
        return array.indexOf(item);
      }
    },
    radsToward: function(x1, y1, x2, y2) {
      return Math.atan2(y2 - y1, x2 - x1);
    },
    inCone: function(heading, cone, radius, x1, y1, x2, y2) {
      var angle12;
      if (radius < this.distance(x1, y1, x2, y2)) {
        return false;
      }
      angle12 = this.radsToward(x1, y1, x2, y2);
      return cone / 2 >= Math.abs(this.subtractRads(heading, angle12));
    },
    distance: function(x1, y1, x2, y2) {
      var dx, dy;
      dx = x1 - x2;
      dy = y1 - y2;
      return Math.sqrt(dx * dx + dy * dy);
    },
    sqDistance: function(x1, y1, x2, y2) {
      var dx, dy;
      dx = x1 - x2;
      dy = y1 - y2;
      return dx * dx + dy * dy;
    },
    polarToXY: function(r, theta, x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      return [x + r * Math.cos(theta), y + r * Math.sin(theta)];
    },
    torusDistance: function(x1, y1, x2, y2, w, h) {
      return Math.sqrt(this.torusSqDistance(x1, y1, x2, y2, w, h));
    },
    torusSqDistance: function(x1, y1, x2, y2, w, h) {
      var dx, dxMin, dy, dyMin;
      dx = Math.abs(x2 - x1);
      dy = Math.abs(y2 - y1);
      dxMin = Math.min(dx, w - dx);
      dyMin = Math.min(dy, h - dy);
      return dxMin * dxMin + dyMin * dyMin;
    },
    torusWraps: function(x1, y1, x2, y2, w, h) {
      var dx, dy;
      dx = Math.abs(x2 - x1);
      dy = Math.abs(y2 - y1);
      return dx > w - dx || dy > h - dy;
    },
    torus4Pts: function(x1, y1, x2, y2, w, h) {
      var x2r, y2r;
      x2r = x2 < x1 ? x2 + w : x2 - w;
      y2r = y2 < y1 ? y2 + h : y2 - h;
      return [[x2, y2], [x2r, y2], [x2, y2r], [x2r, y2r]];
    },
    torusPt: function(x1, y1, x2, y2, w, h) {
      var x, x2r, y, y2r;
      x2r = x2 < x1 ? x2 + w : x2 - w;
      y2r = y2 < y1 ? y2 + h : y2 - h;
      x = Math.abs(x2r - x1) < Math.abs(x2 - x1) ? x2r : x2;
      y = Math.abs(y2r - y1) < Math.abs(y2 - y1) ? y2r : y2;
      return [x, y];
    },
    torusRadsToward: function(x1, y1, x2, y2, w, h) {
      var _ref;
      _ref = this.torusPt(x1, y1, x2, y2, w, h), x2 = _ref[0], y2 = _ref[1];
      return this.radsToward(x1, y1, x2, y2);
    },
    inTorusCone: function(heading, cone, radius, x1, y1, x2, y2, w, h) {
      var p, _i, _len, _ref;
      _ref = this.torus4Pts(x1, y1, x2, y2, w, h);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        if (this.inCone(heading, cone, radius, x1, y1, p[0], p[1])) {
          return true;
        }
      }
      return false;
    },
    fileIndex: {},
    importImage: function(name, f) {
      var img;
      if (f == null) {
        f = function() {};
      }
      if ((img = this.fileIndex[name]) != null) {
        f(img);
      } else {
        this.fileIndex[name] = img = new Image();
        img.isDone = false;
        img.crossOrigin = "Anonymous";
        img.onload = function() {
          f(img);
          return img.isDone = true;
        };
        img.src = name;
      }
      return img;
    },
    xhrLoadFile: function(name, method, type, f) {
      var xhr;
      if (method == null) {
        method = "GET";
      }
      if (type == null) {
        type = "text";
      }
      if (f == null) {
        f = function() {};
      }
      if ((xhr = this.fileIndex[name]) != null) {
        f(xhr.response);
      } else {
        this.fileIndex[name] = xhr = new XMLHttpRequest();
        xhr.isDone = false;
        xhr.open(method, name);
        xhr.responseType = type;
        xhr.onload = function() {
          f(xhr.response);
          return xhr.isDone = true;
        };
        xhr.send();
      }
      return xhr;
    },
    filesLoaded: function(files) {
      var array, v;
      if (files == null) {
        files = this.fileIndex;
      }
      array = (function() {
        var _i, _len, _ref, _results;
        _ref = this.ownValues(files);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          v = _ref[_i];
          _results.push(v.isDone);
        }
        return _results;
      }).call(this);
      return array.reduce((function(a, b) {
        return a && b;
      }), true);
    },
    waitOnFiles: function(f, files) {
      if (files == null) {
        files = this.fileIndex;
      }
      return this.waitOn(((function(_this) {
        return function() {
          return _this.filesLoaded(files);
        };
      })(this)), f);
    },
    waitOn: function(done, f) {
      if (done()) {
        return f();
      } else {
        return setTimeout(((function(_this) {
          return function() {
            return _this.waitOn(done, f);
          };
        })(this)), 1000);
      }
    },
    cloneImage: function(img) {
      var i;
      (i = new Image()).src = img.src;
      return i;
    },
    imageToData: function(img, f, arrayType) {
      if (f == null) {
        f = this.pixelByte(0);
      }
      if (arrayType == null) {
        arrayType = Uint8ClampedArray;
      }
      return this.imageRowsToData(img, img.height, f, arrayType);
    },
    imageRowsToData: function(img, rowsPerSlice, f, arrayType) {
      var ctx, data, dataStart, i, idata, rows, rowsDone, _i, _ref;
      if (f == null) {
        f = this.pixelByte(0);
      }
      if (arrayType == null) {
        arrayType = Uint8ClampedArray;
      }
      rowsDone = 0;
      data = new arrayType(img.width * img.height);
      while (rowsDone < img.height) {
        rows = Math.min(img.height - rowsDone, rowsPerSlice);
        ctx = this.imageSliceToCtx(img, 0, rowsDone, img.width, rows);
        idata = this.ctxToImageData(ctx).data;
        dataStart = rowsDone * img.width;
        for (i = _i = 0, _ref = idata.length / 4; _i < _ref; i = _i += 1) {
          data[dataStart + i] = f(idata, 4 * i);
        }
        rowsDone += rows;
      }
      return data;
    },
    pixelBytesToInt: function(a) {
      var ImageByteFmts;
      ImageByteFmts = [[2], [1, 2], [0, 1, 2], [3, 0, 1, 2]];
      if (typeof a === "number") {
        a = ImageByteFmts[a - 1];
      }
      return function(id, i) {
        var j, val, _i, _len;
        val = 0;
        for (_i = 0, _len = a.length; _i < _len; _i++) {
          j = a[_i];
          val = val * 256 + id[i + j];
        }
        return val;
      };
    },
    pixelByte: function(n) {
      return function(id, i) {
        return id[i + n];
      };
    },
    createCanvas: function(width, height) {
      var can;
      can = document.createElement('canvas');
      can.width = width;
      can.height = height;
      return can;
    },
    createCtx: function(width, height, ctxType) {
      var can, _ref;
      if (ctxType == null) {
        ctxType = "2d";
      }
      can = this.createCanvas(width, height);
      if (ctxType === "2d") {
        return can.getContext("2d");
      } else {
        return (_ref = can.getContext("webgl")) != null ? _ref : can.getContext("experimental-webgl");
      }
    },
    createLayer: function(div, width, height, z, ctx) {
      var element;
      if (ctx == null) {
        ctx = "2d";
      }
      if (ctx === "img") {
        element = ctx = new Image();
        ctx.width = width;
        ctx.height = height;
      } else {
        element = (ctx = this.createCtx(width, height, ctx)).canvas;
      }
      this.insertLayer(div, element, width, height, z);
      return ctx;
    },
    insertLayer: function(div, element, w, h, z) {
      element.setAttribute('style', "position:absolute;top:0;left:0;width:" + w + ";height:" + h + ";z-index:" + z);
      return div.appendChild(element);
    },
    setCtxSmoothing: function(ctx, smoothing) {
      ctx.imageSmoothingEnabled = smoothing;
      ctx.mozImageSmoothingEnabled = smoothing;
      ctx.oImageSmoothingEnabled = smoothing;
      return ctx.webkitImageSmoothingEnabled = smoothing;
    },
    setIdentity: function(ctx) {
      ctx.save();
      return ctx.setTransform(1, 0, 0, 1, 0, 0);
    },
    clearCtx: function(ctx) {
      if (ctx.save != null) {
        this.setIdentity(ctx);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        return ctx.restore();
      } else {
        ctx.clearColor(0, 0, 0, 0);
        return ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
      }
    },
    fillCtx: function(ctx, color) {
      if (ctx.fillStyle != null) {
        this.setIdentity(ctx);
        ctx.fillStyle = this.colorStr(color);
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        return ctx.restore();
      } else {
        ctx.clearColor.apply(ctx, __slice.call(color).concat([1]));
        return ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
      }
    },
    ctxDrawText: function(ctx, string, x, y, color, setIdentity) {
      if (color == null) {
        color = [0, 0, 0];
      }
      if (setIdentity == null) {
        setIdentity = true;
      }
      if (setIdentity) {
        this.setIdentity(ctx);
      }
      ctx.fillStyle = this.colorStr(color);
      ctx.fillText(string, x, y);
      if (setIdentity) {
        return ctx.restore();
      }
    },
    ctxTextParams: function(ctx, font, align, baseline) {
      if (align == null) {
        align = "center";
      }
      if (baseline == null) {
        baseline = "middle";
      }
      ctx.font = font;
      ctx.textAlign = align;
      return ctx.textBaseline = baseline;
    },
    elementTextParams: function(e, font, align, baseline) {
      if (align == null) {
        align = "center";
      }
      if (baseline == null) {
        baseline = "middle";
      }
      if (e.canvas != null) {
        e = e.canvas;
      }
      e.style.font = font;
      e.style.textAlign = align;
      return e.style.textBaseline = baseline;
    },
    imageToCtx: function(img, w, h) {
      var ctx;
      if ((w != null) && (h != null)) {
        ctx = this.createCtx(w, h);
        ctx.drawImage(img, 0, 0, w, h);
      } else {
        ctx = this.createCtx(img.width, img.height);
        ctx.drawImage(img, 0, 0);
      }
      return ctx;
    },
    imageSliceToCtx: function(img, sx, sy, sw, sh, ctx) {
      if (ctx != null) {
        ctx.canvas.width = sw;
        ctx.canvas.height = sh;
      } else {
        ctx = this.createCtx(sw, sh);
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      return ctx;
    },
    imageToCtxDownStepped: function(img, tw, th) {
      var can, ctx, ctx1, h, ihalf, step, steps, w, _i;
      ctx1 = this.createCtx(tw, th);
      w = img.width;
      h = img.height;
      ihalf = function(n) {
        return Math.ceil(n / 2);
      };
      steps = Math.ceil(this.log2((w / tw) > (h / th) ? w / tw : h / th));
      console.log("steps", steps);
      if (steps <= 1) {
        ctx1.drawImage(img, 0, 0, tw, th);
      } else {
        console.log("img w/h", w, h, "->", ihalf(w), ihalf(h));
        ctx = this.createCtx(w = ihalf(w), h = ihalf(h));
        can = ctx.canvas;
        ctx.drawImage(img, 0, 0, w, h);
        for (step = _i = steps; steps <= 2 ? _i < 2 : _i > 2; step = steps <= 2 ? ++_i : --_i) {
          console.log("can w/h", w, h, "->", ihalf(w), ihalf(h));
          ctx.drawImage(can, 0, 0, w, h, 0, 0, w = ihalf(w), h = ihalf(h));
        }
        console.log("target w/h", w, h, "->", tw, th);
        ctx1.drawImage(can, 0, 0, w, h, 0, 0, tw, th);
      }
      return ctx1;
    },
    ctxToDataUrl: function(ctx) {
      return ctx.canvas.toDataURL("image/png");
    },
    ctxToDataUrlImage: function(ctx, f) {
      var img;
      img = new Image();
      if (f != null) {
        img.onload = function() {
          return f(img);
        };
      }
      img.src = ctx.canvas.toDataURL("image/png");
      return img;
    },
    ctxToImageData: function(ctx) {
      return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    },
    drawCenteredImage: function(ctx, img, rad, x, y, dx, dy) {
      ctx.translate(x, y);
      ctx.rotate(rad);
      return ctx.drawImage(img, -dx / 2, -dy / 2);
    },
    copyCtx: function(ctx0) {
      var ctx;
      ctx = this.createCtx(ctx0.canvas.width, ctx0.canvas.height);
      ctx.drawImage(ctx0.canvas, 0, 0);
      return ctx;
    },
    resizeCtx: function(ctx, width, height, scale) {
      var copy;
      if (scale == null) {
        scale = false;
      }
      copy = this.copyCtx(ctx);
      ctx.canvas.width = width;
      ctx.canvas.height = height;
      return ctx.drawImage(copy.canvas, 0, 0);
    }
  };

  Evented = (function() {
    function Evented() {
      this.events = {};
    }

    Evented.prototype.emit = function() {
      var args, cb, name, _i, _len, _ref, _results;
      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (this.events[name]) {
        _ref = this.events[name];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cb = _ref[_i];
          _results.push(cb.apply(null, args));
        }
        return _results;
      }
    };

    Evented.prototype.on = function(name, cb) {
      var _base;
      return ((_base = this.events)[name] != null ? _base[name] : _base[name] = []).push(cb);
    };

    Evented.prototype.off = function(name, cb) {
      var l;
      if (this.events[name]) {
        if (cb) {
          return this.events[name] = (function() {
            var _i, _len, _ref, _results;
            _ref = this.events[name];
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              l = _ref[_i];
              if (l !== cb) {
                _results.push(l);
              }
            }
            return _results;
          }).call(this);
        } else {
          return delete this.events[name];
        }
      }
    };

    return Evented;

  })();

  window.c = Color = {
    rgbString: function(r, g, b, a) {
      if (a == null) {
        a = 1;
      }
      if (a > 1) {
        throw new Error("alpha > 1");
      }
      if (a === 1) {
        return "rgb(" + r + "," + g + "," + b + ")";
      } else {
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
      }
    },
    hslString: function(h, s, l, a) {
      if (a == null) {
        a = 1;
      }
      if (a > 1) {
        throw new Error("alpha > 1");
      }
      if (a === 1) {
        return "hsl(" + h + "," + s + "%," + l + "%)";
      } else {
        return "hsla(" + h + "," + s + "%," + l + "%," + a + ")";
      }
    },
    rgbIntensity: function(r, g, b) {
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    },
    rgbToHex: function(r, g, b) {
      return "#" + (0x1000000 | (b | g << 8 | r << 16)).toString(16).slice(-6);
    },
    rgbToPixel: function(r, g, b, a255, arrayToo) {
      var pixel, rgba255;
      if (a255 == null) {
        a255 = 255;
      }
      if (arrayToo == null) {
        arrayToo = false;
      }
      rgba255 = new Uint8ClampedArray([r, g, b, a255]);
      pixel = new Uint32Array(rgba255.buffer)[0];
      if (arrayToo) {
        return [pixel, rgba255];
      } else {
        return pixel;
      }
    },
    pixelToRgb: function(pixel) {
      var pixelArray;
      pixelArray = new Uint32Array([pixel]);
      return new Uint8ClampedArray(pixelArray.buffer);
    },
    sharedCtx1x1: u.createCtx(1, 1),
    stringToRgb: function(string) {
      var a, b, g, r, _ref;
      string = string.toLowerCase();
      this.sharedCtx1x1.clearRect(0, 0, 1, 1);
      this.sharedCtx1x1.fillStyle = string;
      this.sharedCtx1x1.fillRect(0, 0, 1, 1);
      string = string.replace(/\ */g, '');
      _ref = this.sharedCtx1x1.getImageData(0, 0, 1, 1).data, r = _ref[0], g = _ref[1], b = _ref[2], a = _ref[3];
      if ((r + g + b !== 0) || (string === "#000" || string === "#000000" || string === "transparent" || string === "black") || (string.match(/rgba{0,1}\(0,0,0/)) || (string.match(/hsla{0,1}\([^,]*,[^,]*,0%/))) {
        return [r, g, b];
      }
      return null;
    },
    roundToInt: function(float, max) {
      var int;
      if (max == null) {
        max = 255;
      }
      if (!((0 <= float && float <= 1))) {
        console.log("roundToInt: float " + float + ", max " + max);
      }
      int = Math.round(max * float);
      if (!((0 <= int && int <= max))) {
        console.log("roundToInt: int " + int + ", max " + max);
      }
      return u.clamp(int, 0, max);
    },
    rgbToHsl: function(r, g, b) {
      var diff, h, l, max, min, s, sum;
      r = r / 255;
      g = g / 255;
      b = b / 255;
      max = Math.max(r, g, b);
      min = Math.min(r, g, b);
      sum = max + min;
      diff = max - min;
      l = sum / 2;
      if (max === min) {
        h = s = 0;
      } else {
        s = l > 0.5 ? diff / (2 - sum) : diff / sum;
        switch (max) {
          case r:
            h = ((g - b) / diff) + (g < b ? 6 : 0);
            break;
          case g:
            h = ((b - r) / diff) + 2;
            break;
          case b:
            h = ((r - g) / diff) + 4;
        }
      }
      return [this.roundToInt(h / 6, 360), this.roundToInt(s, 100), this.roundToInt(l, 100)];
    },
    hslToRgb: function(h, s, l) {
      var str;
      str = this.hslString(h, s, l);
      return this.stringToRgb(str);
    },
    randomRgbColor: function() {
      var i, _i, _results;
      _results = [];
      for (i = _i = 0; _i <= 2; i = ++_i) {
        _results.push(u.randomInt(256));
      }
      return _results;
    },
    rgbDistance: function(r1, g1, b1, r2, g2, b2) {
      var db, dg, dr, rMean, _ref;
      rMean = Math.round((r1 + r2) / 2);
      _ref = [r1 - r2, g1 - g2, b1 - b2], dr = _ref[0], dg = _ref[1], db = _ref[2];
      return Math.sqrt((((512 + rMean) * dr * dr) >> 8) + (4 * dg * dg) + (((767 - rMean) * db * db) >> 8));
    },
    rgbLerp: function(value, min, max, rgb1, rgb0) {
      var i, scale, _i, _results;
      if (rgb0 == null) {
        rgb0 = [0, 0, 0];
      }
      scale = u.lerpScale(value, min, max);
      _results = [];
      for (i = _i = 0; _i <= 2; i = ++_i) {
        _results.push(Math.round(u.lerp(rgb0[i], rgb1[i], scale)));
      }
      return _results;
    },
    options: function() {
      return {
        hsl: true,
        pixel: true,
        intensity: true,
        rgbString: true,
        hexString: true
      };
    },
    colorObject: function(r, g, b, a, opt) {
      var o, _ref;
      if (a == null) {
        a = 1;
      }
      if (opt == null) {
        opt = this.options();
      }
      o = {
        r: r,
        g: g,
        b: b,
        a: a
      };
      if (o.hsl) {
        _ref = this.rgbToHsl(r, g, b), o.h = _ref[0], o.s = _ref[1], o.l = _ref[2];
      }
      if (opt.pixel) {
        o.a255 = Math.round(a * 255);
        o.pixel = this.rgbToPixel(r, g, b, o.a255);
      }
      if (opt.intensity) {
        o.intensity = this.rgbIntensity(r, g, b);
      }
      if (opt.rgbString) {
        o.rgbString = this.rgbString(r, g, b, a);
      }
      if (opt.hexString) {
        o.hexString = this.rgbToHex(r, g, b);
      }
      return o;
    },
    colorObjToRgb: function(o) {
      if (o.a === 1) {
        return [o.r, o.g, o.b];
      } else {
        return [o.r, o.g, o.b, o.a];
      }
    },
    randomColorObject: function(a, opt) {
      if (a == null) {
        a = 1;
      }
      if (opt == null) {
        opt = this.options();
      }
      return this.colorObject.apply(this, __slice.call(this.randomRgbColor()).concat([a], [opt]));
    },
    DataColorMap: DataColorMap = (function(_super) {
      __extends(DataColorMap, _super);

      function DataColorMap(array, aToColor) {
        var a, _i, _len;
        if (aToColor == null) {
          aToColor = function(a) {
            return a;
          };
        }
        DataColorMap.__super__.constructor.call(this, 0);
        for (_i = 0, _len = array.length; _i < _len; _i++) {
          a = array[_i];
          this.push(aToColor(a));
        }
      }

      DataColorMap.prototype.randomIndex = function() {
        return u.randomInt(this.length);
      };

      DataColorMap.prototype.randomColor = function() {
        return this[this.randomIndex()];
      };

      DataColorMap.prototype.scaleIndex = function(number, min, max, minColor, maxColor) {
        var scale;
        if (minColor == null) {
          minColor = 0;
        }
        if (maxColor == null) {
          maxColor = this.length - 1;
        }
        scale = u.lerpScale(number, min, max);
        return Math.round(u.lerp(minColor, maxColor, scale));
      };

      DataColorMap.prototype.scaleColor = function(number, min, max, minColor, maxColor) {
        if (minColor == null) {
          minColor = 0;
        }
        if (maxColor == null) {
          maxColor = this.length - 1;
        }
        return this[this.scaleIndex(number, min, max, minColor, maxColor)];
      };

      return DataColorMap;

    })(Array),
    ColorMap: ColorMap = (function(_super) {
      __extends(ColorMap, _super);

      function ColorMap(rgbArray, options, dupsOK) {
        var i, rgb, _i, _len;
        this.options = options != null ? options : Color.options();
        this.dupsOK = dupsOK != null ? dupsOK : false;
        ColorMap.__super__.constructor.call(this, 0);
        this.index = {};
        for (i = _i = 0, _len = rgbArray.length; _i < _len; i = ++_i) {
          rgb = rgbArray[i];
          this.addColor.apply(this, rgb);
        }
      }

      ColorMap.prototype.addColor = function(r, g, b, a) {
        var color, rgbString;
        if (a == null) {
          a = 1;
        }
        rgbString = Color.rgbString(r, g, b, a);
        if (!this.dupsOK) {
          color = this.index[rgbString];
          if (color) {
            console.log("dup color", color);
          }
        }
        if (!color) {
          color = Color.colorObject(r, g, b, a, this.options);
          color.ix = this.length;
          color.map = this;
          this.index[rgbString] = color;
          this.push(color);
        }
        return color;
      };

      ColorMap.prototype.sort = function(f) {
        var color, i, _i, _len;
        ColorMap.__super__.sort.call(this, f);
        for (i = _i = 0, _len = this.length; _i < _len; i = ++_i) {
          color = this[i];
          color.ix = i;
        }
        return this;
      };

      ColorMap.prototype.sortBy = function(key, ascenting) {
        var compare;
        if (ascenting == null) {
          ascenting = true;
        }
        compare = function(a, b) {
          if (ascenting) {
            return a[key] - b[key];
          } else {
            return b[key] - a[key];
          }
        };
        return this.sort(compare);
      };

      ColorMap.prototype.findRgb = function(r, g, b, a) {
        if (a == null) {
          a = 1;
        }
        return this.index[Color.rgbString(r, g, b, a)];
      };

      ColorMap.prototype.findKey = function(key, value) {
        var color, i, _i, _len;
        for (i = _i = 0, _len = this.length; _i < _len; i = ++_i) {
          color = this[i];
          if (color[key] === value) {
            return color;
          }
        }
        return void 0;
      };

      ColorMap.prototype.randomIndex = function() {
        return u.randomInt(this.length);
      };

      ColorMap.prototype.randomColor = function() {
        return this[this.randomIndex()];
      };

      ColorMap.prototype.scaleColor = function(number, min, max, minColor, maxColor) {
        var index, scale;
        if (minColor == null) {
          minColor = 0;
        }
        if (maxColor == null) {
          maxColor = this.length - 1;
        }
        scale = u.lerpScale(number, min, max);
        index = Math.round(u.lerp(minColor, maxColor, scale));
        return this[index];
      };

      ColorMap.prototype.findClosest = function(r, g, b) {
        var color, d, i, ixMin, minDist, _i, _len;
        if ((color = this.findRgb(r, g, b))) {
          return color;
        }
        minDist = Infinity;
        ixMin = 0;
        for (i = _i = 0, _len = this.length; _i < _len; i = ++_i) {
          color = this[i];
          d = Color.rgbDistance(color.r, color.g, color.b, r, g, b);
          if (d < minDist) {
            minDist = d;
            ixMin = i;
          }
        }
        return this[ixMin];
      };

      return ColorMap;

    })(Array),
    grayValueArray: function(size) {
      if (size == null) {
        size = 256;
      }
      if (size > 256) {
        u.error("Color: gray value > 256");
      }
      return u.aIntRamp(0, 255, size);
    },
    grayColorArray: function(size) {
      var i, _i, _len, _ref, _results;
      if (size == null) {
        size = 256;
      }
      _ref = this.grayValueArray(size);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        _results.push([i, i, i]);
      }
      return _results;
    },
    grayColorMap: function(size, options) {
      if (size == null) {
        size = 256;
      }
      return new ColorMap(this.grayColorArray(size), options, false);
    },
    permuteColors: function(isRGB, A1, A2, A3) {
      var A, a1, a2, a3, array, i, max, _i, _j, _k, _len, _len1, _len2, _ref;
      if (A2 == null) {
        A2 = A1;
      }
      if (A3 == null) {
        A3 = A2;
      }
      max = isRGB ? [255, 255, 255] : [359, 100, 100];
      _ref = (function() {
        var _i, _len, _ref, _results;
        _ref = [A1, A2, A3];
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          A = _ref[i];
          if (typeof A === "number") {
            if (A === 1) {
              _results.push([max[i]]);
            } else {
              _results.push(u.aIntRamp(0, max[i], A));
            }
          } else {
            _results.push(A);
          }
        }
        return _results;
      })(), A1 = _ref[0], A2 = _ref[1], A3 = _ref[2];
      array = [];
      for (_i = 0, _len = A3.length; _i < _len; _i++) {
        a3 = A3[_i];
        for (_j = 0, _len1 = A2.length; _j < _len1; _j++) {
          a2 = A2[_j];
          for (_k = 0, _len2 = A1.length; _k < _len2; _k++) {
            a1 = A1[_k];
            array.push([a1, a2, a3]);
          }
        }
      }
      return array;
    },
    rgbColorArray: function(R, G, B) {
      if (G == null) {
        G = R;
      }
      if (B == null) {
        B = R;
      }
      return this.permuteColors(true, R, G, B);
    },
    rgbColorMap: function(R, G, B, options, dupsOK) {
      var map;
      if (G == null) {
        G = R;
      }
      if (B == null) {
        B = R;
      }
      return map = new ColorMap(this.rgbColorArray(R, G, B), options, dupsOK);
    },
    hslColorArray: function(H, S, L) {
      if (S == null) {
        S = 1;
      }
      if (L == null) {
        L = 1;
      }
      return this.permuteColors(false, H, S, L);
    },
    hslColorMap: function(H, S, L, options, dupsOK) {
      var a, hslArray, rgbArray;
      if (S == null) {
        S = 1;
      }
      if (L == null) {
        L = 1;
      }
      hslArray = this.hslColorArray(H, S, L);
      rgbArray = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = hslArray.length; _i < _len; _i++) {
          a = hslArray[_i];
          _results.push(this.hslToRgb.apply(this, a));
        }
        return _results;
      }).call(this);
      return new ColorMap(rgbArray, options, dupsOK);
    },
    gradientColorArray: function(nColors, stops, locs) {
      var ctx, grad, i, id, _i, _j, _ref, _ref1, _results;
      if (locs == null) {
        locs = (function() {
          var _i, _ref, _results;
          _results = [];
          for (i = _i = 0, _ref = stops.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            _results.push(i / (stops.length - 1));
          }
          return _results;
        })();
      }
      ctx = u.createCtx(nColors, 1);
      grad = ctx.createLinearGradient(0, 0, nColors, 0);
      for (i = _i = 0, _ref = stops.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        grad.addColorStop(locs[i], this.rgbString.apply(this, stops[i]));
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, nColors, 1);
      id = u.ctxToImageData(ctx).data;
      _results = [];
      for (i = _j = 0, _ref1 = id.length; _j < _ref1; i = _j += 4) {
        _results.push([id[i], id[i + 1], id[i + 2]]);
      }
      return _results;
    },
    gradientColorMap: function(nColors, stops, locs, options, dupsOK) {
      return new ColorMap(this.gradientColorArray(nColors, stops, locs), options, dupsOK);
    },
    nameColorMap: function(colorPairs, options, dupsOK) {
      var color, i, k, map, name, names, rgbs, v, _i, _len;
      if (dupsOK == null) {
        dupsOK = true;
      }
      rgbs = (function() {
        var _results;
        _results = [];
        for (k in colorPairs) {
          v = colorPairs[k];
          _results.push(v);
        }
        return _results;
      })();
      names = (function() {
        var _results;
        _results = [];
        for (k in colorPairs) {
          v = colorPairs[k];
          _results.push(k);
        }
        return _results;
      })();
      map = new ColorMap(rgbs, options, dupsOK);
      for (i = _i = 0, _len = map.length; _i < _len; i = ++_i) {
        color = map[i];
        name = names[i];
        map.index[name] = color;
      }
      return map;
    },
    randomColorArray: function(nColors) {
      var i, _i, _results;
      _results = [];
      for (i = _i = 0; 0 <= nColors ? _i < nColors : _i > nColors; i = 0 <= nColors ? ++_i : --_i) {
        _results.push(this.randomRgbColor());
      }
      return _results;
    },
    randomColorMap: function(nColors, options, dupsOK) {
      return new ColorMap(this.randomColorArray(nColors), options, dupsOK);
    }
  };

  shapes = Shapes = (function() {
    var ccirc, cimg, circ, csq, fillSlot, poly, spriteSheets;
    poly = function(c, a) {
      var i, p, _i, _len;
      for (i = _i = 0, _len = a.length; _i < _len; i = ++_i) {
        p = a[i];
        if (i === 0) {
          c.moveTo(p[0], p[1]);
        } else {
          c.lineTo(p[0], p[1]);
        }
      }
      return null;
    };
    circ = function(c, x, y, s) {
      return c.arc(x, y, s / 2, 0, 2 * Math.PI);
    };
    ccirc = function(c, x, y, s) {
      return c.arc(x, y, s / 2, 0, 2 * Math.PI, true);
    };
    cimg = function(c, x, y, s, img) {
      c.scale(1, -1);
      c.drawImage(img, x - s / 2, y - s / 2, s, s);
      return c.scale(1, -1);
    };
    csq = function(c, x, y, s) {
      return c.fillRect(x - s / 2, y - s / 2, s, s);
    };
    fillSlot = function(slot, img) {
      slot.ctx.save();
      slot.ctx.scale(1, -1);
      slot.ctx.drawImage(img, slot.x, -(slot.y + slot.spriteSize), slot.spriteSize, slot.spriteSize);
      return slot.ctx.restore();
    };
    spriteSheets = [];
    return {
      "default": {
        rotate: true,
        draw: function(c) {
          return poly(c, [[.5, 0], [-.5, -.5], [-.25, 0], [-.5, .5]]);
        }
      },
      triangle: {
        rotate: true,
        draw: function(c) {
          return poly(c, [[.5, 0], [-.5, -.4], [-.5, .4]]);
        }
      },
      arrow: {
        rotate: true,
        draw: function(c) {
          return poly(c, [[.5, 0], [0, .5], [0, .2], [-.5, .2], [-.5, -.2], [0, -.2], [0, -.5]]);
        }
      },
      bug: {
        rotate: true,
        draw: function(c) {
          c.strokeStyle = c.fillStyle;
          c.lineWidth = .05;
          poly(c, [[.4, .225], [.2, 0], [.4, -.225]]);
          c.stroke();
          c.beginPath();
          circ(c, .12, 0, .26);
          circ(c, -.05, 0, .26);
          return circ(c, -.27, 0, .4);
        }
      },
      pyramid: {
        rotate: false,
        draw: function(c) {
          return poly(c, [[0, .5], [-.433, -.25], [.433, -.25]]);
        }
      },
      circle: {
        shortcut: function(c, x, y, s) {
          c.beginPath();
          circ(c, x, y, s);
          c.closePath();
          return c.fill();
        },
        rotate: false,
        draw: function(c) {
          return circ(c, 0, 0, 1);
        }
      },
      square: {
        shortcut: function(c, x, y, s) {
          return csq(c, x, y, s);
        },
        rotate: false,
        draw: function(c) {
          return csq(c, 0, 0, 1);
        }
      },
      pentagon: {
        rotate: false,
        draw: function(c) {
          return poly(c, [[0, .45], [-.45, .1], [-.3, -.45], [.3, -.45], [.45, .1]]);
        }
      },
      ring: {
        rotate: false,
        draw: function(c) {
          circ(c, 0, 0, 1);
          c.closePath();
          return ccirc(c, 0, 0, .6);
        }
      },
      filledRing: {
        rotate: false,
        draw: function(c) {
          var tempStyle;
          circ(c, 0, 0, 1);
          tempStyle = c.fillStyle;
          c.fillStyle = c.strokeStyle;
          c.fill();
          c.fillStyle = tempStyle;
          c.beginPath();
          return circ(c, 0, 0, .8);
        }
      },
      person: {
        rotate: false,
        draw: function(c) {
          poly(c, [[.15, .2], [.3, 0], [.125, -.1], [.125, .05], [.1, -.15], [.25, -.5], [.05, -.5], [0, -.25], [-.05, -.5], [-.25, -.5], [-.1, -.15], [-.125, .05], [-.125, -.1], [-.3, 0], [-.15, .2]]);
          c.closePath();
          return circ(c, 0, .35, .30);
        }
      },
      names: function() {
        var name, val, _results;
        _results = [];
        for (name in this) {
          if (!__hasProp.call(this, name)) continue;
          val = this[name];
          if ((val.rotate != null) && (val.draw != null)) {
            _results.push(name);
          }
        }
        return _results;
      },
      add: function(name, rotate, draw, shortcut) {
        var s;
        s = this[name] = u.isFunction(draw) ? {
          rotate: rotate,
          draw: draw
        } : {
          rotate: rotate,
          img: draw,
          draw: function(c) {
            return cimg(c, .5, .5, 1, this.img);
          }
        };
        if ((s.img != null) && !s.rotate) {
          s.shortcut = function(c, x, y, s) {
            return cimg(c, x, y, s, this.img);
          };
        }
        if (shortcut != null) {
          return s.shortcut = shortcut;
        }
      },
      poly: poly,
      circ: circ,
      ccirc: ccirc,
      cimg: cimg,
      csq: csq,
      spriteSheets: spriteSheets,
      draw: function(ctx, shape, x, y, size, rad, color, strokeColor) {
        if (shape.shortcut != null) {
          if (shape.img == null) {
            ctx.fillStyle = u.colorStr(color);
          }
          shape.shortcut(ctx, x, y, size);
        } else {
          ctx.save();
          ctx.translate(x, y);
          if (size !== 1) {
            ctx.scale(size, size);
          }
          if (rad !== 0) {
            ctx.rotate(rad);
          }
          if (shape.img != null) {
            shape.draw(ctx);
          } else {
            ctx.fillStyle = u.colorStr(color);
            if (strokeColor) {
              ctx.strokeStyle = u.colorStr(strokeColor);
              ctx.lineWidth = 0.05;
            }
            ctx.save();
            ctx.beginPath();
            shape.draw(ctx);
            ctx.closePath();
            ctx.restore();
            ctx.fill();
            if (strokeColor) {
              ctx.stroke();
            }
          }
          ctx.restore();
        }
        return shape;
      },
      drawSprite: function(ctx, s, x, y, size, rad) {
        if (rad === 0) {
          ctx.drawImage(s.ctx.canvas, s.x, s.y, s.spriteSize, s.spriteSize, x - size / 2, y - size / 2, size, size);
        } else {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(rad);
          ctx.drawImage(s.ctx.canvas, s.x, s.y, s.spriteSize, s.spriteSize, -size / 2, -size / 2, size, size);
          ctx.restore();
        }
        return s;
      },
      shapeToSprite: function(name, color, size, strokeColor) {
        var ctx, foundSlot, img, index, shape, slot, slotSize, spriteSize, strokePadding, x, y;
        spriteSize = Math.ceil(size);
        strokePadding = 4;
        slotSize = spriteSize + strokePadding;
        shape = this[name];
        index = shape.img != null ? name : "" + name + "-" + (u.colorStr(color));
        ctx = spriteSheets[slotSize];
        if (ctx == null) {
          spriteSheets[slotSize] = ctx = u.createCtx(slotSize * 10, slotSize);
          ctx.nextX = 0;
          ctx.nextY = 0;
          ctx.index = {};
        }
        if ((foundSlot = ctx.index[index]) != null) {
          return foundSlot;
        }
        if (slotSize * ctx.nextX === ctx.canvas.width) {
          u.resizeCtx(ctx, ctx.canvas.width, ctx.canvas.height + slotSize);
          ctx.nextX = 0;
          ctx.nextY++;
        }
        x = slotSize * ctx.nextX + strokePadding / 2;
        y = slotSize * ctx.nextY + strokePadding / 2;
        slot = {
          ctx: ctx,
          x: x,
          y: y,
          size: size,
          spriteSize: spriteSize,
          name: name,
          color: color,
          strokeColor: strokeColor,
          index: index
        };
        ctx.index[index] = slot;
        if ((img = shape.img) != null) {
          if (img.height !== 0) {
            fillSlot(slot, img);
          } else {
            img.onload = function() {
              return fillSlot(slot, img);
            };
          }
        } else {
          ctx.save();
          ctx.translate((ctx.nextX + 0.5) * slotSize, (ctx.nextY + 0.5) * slotSize);
          ctx.scale(spriteSize, spriteSize);
          ctx.fillStyle = u.colorStr(color);
          if (strokeColor) {
            ctx.strokeStyle = u.colorStr(strokeColor);
            ctx.lineWidth = 0.05;
          }
          ctx.save();
          ctx.beginPath();
          shape.draw(ctx);
          ctx.closePath();
          ctx.restore();
          ctx.fill();
          if (strokeColor) {
            ctx.stroke();
          }
          ctx.restore();
        }
        ctx.nextX++;
        return slot;
      }
    };
  })();

  AgentSet = (function(_super) {
    __extends(AgentSet, _super);

    AgentSet.asSet = function(a, setType) {
      var _ref;
      if (setType == null) {
        setType = AgentSet;
      }
      a.__proto__ = (_ref = setType.prototype) != null ? _ref : setType.constructor.prototype;
      if (a[0] != null) {
        a.model = a[0].model;
      }
      return a;
    };

    function AgentSet(model, agentClass, name, mainSet) {
      this.model = model;
      this.agentClass = agentClass;
      this.name = name;
      this.mainSet = mainSet;
      AgentSet.__super__.constructor.call(this, 0);
      if (this.mainSet == null) {
        this.breeds = [];
      }
      this.agentClass.prototype.breed = this;
      this.agentClass.prototype.model = this.model;
      this.ownVariables = [];
      if (this.mainSet == null) {
        this.ID = 0;
      }
    }

    AgentSet.prototype.create = function() {};

    AgentSet.prototype.add = function(o) {
      if (this.mainSet != null) {
        this.mainSet.add(o);
      } else {
        o.id = this.ID++;
      }
      this.push(o);
      return o;
    };

    AgentSet.prototype.remove = function(o) {
      if (this.mainSet != null) {
        u.removeItem(this.mainSet, o);
      }
      u.removeItem(this, o);
      return this;
    };

    AgentSet.prototype.setDefault = function(name, value) {
      this.agentClass.prototype[name] = value;
      return this;
    };

    AgentSet.prototype.own = function(vars) {
      var name, _i, _len, _ref;
      _ref = vars.split(" ");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        this.setDefault(name, null);
        this.ownVariables.push(name);
      }
      return this;
    };

    AgentSet.prototype.setBreed = function(a) {
      var k, proto, v;
      if (a.breed.mainSet != null) {
        u.removeItem(a.breed, a, "id");
      }
      if (this.mainSet != null) {
        u.insertItem(this, a, "id");
      }
      proto = a.__proto__ = this.agentClass.prototype;
      for (k in a) {
        if (!__hasProp.call(a, k)) continue;
        v = a[k];
        if (proto[k] != null) {
          delete a[k];
        }
      }
      return a;
    };

    AgentSet.prototype.exclude = function(breeds) {
      var o;
      breeds = breeds.split(" ");
      return this.asSet((function() {
        var _i, _len, _ref, _results;
        _results = [];
        for (_i = 0, _len = this.length; _i < _len; _i++) {
          o = this[_i];
          if (_ref = o.breed.name, __indexOf.call(breeds, _ref) < 0) {
            _results.push(o);
          }
        }
        return _results;
      }).call(this));
    };

    AgentSet.prototype.floodFill = function(aset, fCandidate, fJoin, fNeighbors, asetLast) {
      var floodFunc, _results;
      if (asetLast == null) {
        asetLast = [];
      }
      floodFunc = this.floodFillOnce(aset, fCandidate, fJoin, fNeighbors, asetLast);
      _results = [];
      while (floodFunc) {
        _results.push(floodFunc = floodFunc());
      }
      return _results;
    };

    AgentSet.prototype.floodFillOnce = function(aset, fCandidate, fJoin, fNeighbors, asetLast) {
      var asetNext, n, p, _i, _j, _k, _len, _len1, _len2, _ref;
      if (asetLast == null) {
        asetLast = [];
      }
      for (_i = 0, _len = aset.length; _i < _len; _i++) {
        p = aset[_i];
        fJoin(p, asetLast);
      }
      asetNext = [];
      for (_j = 0, _len1 = aset.length; _j < _len1; _j++) {
        p = aset[_j];
        _ref = fNeighbors(p);
        for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
          n = _ref[_k];
          if (fCandidate(n, aset)) {
            if (asetNext.indexOf(n) < 0) {
              asetNext.push(n);
            }
          }
        }
      }
      if (asetNext.length === 0) {
        return null;
      } else {
        return (function(_this) {
          return function() {
            return _this.floodFillOnce(asetNext, fCandidate, fJoin, fNeighbors, aset);
          };
        })(this);
      }
    };

    AgentSet.prototype.uniq = function() {
      return u.uniq(this);
    };

    AgentSet.prototype.asSet = function(a, setType) {
      if (setType == null) {
        setType = this;
      }
      return AgentSet.asSet(a, setType);
    };

    AgentSet.prototype.asOrderedSet = function(a) {
      return this.asSet(a).sortById();
    };

    AgentSet.prototype.toString = function() {
      var a;
      return "[" + ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = this.length; _i < _len; _i++) {
          a = this[_i];
          _results.push(a.toString());
        }
        return _results;
      }).call(this)).join(", ") + "]";
    };

    AgentSet.prototype.getProp = function(prop) {
      return u.aProp(this, prop);
    };

    AgentSet.prototype.getPropWith = function(prop, value) {
      var o;
      return this.asSet((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = this.length; _i < _len; _i++) {
          o = this[_i];
          if (o[prop] === value) {
            _results.push(o);
          }
        }
        return _results;
      }).call(this));
    };

    AgentSet.prototype.setProp = function(prop, value) {
      var i, o, _i, _j, _len, _len1;
      if (u.isArray(value)) {
        for (i = _i = 0, _len = this.length; _i < _len; i = ++_i) {
          o = this[i];
          o[prop] = value[i];
        }
        return this;
      } else {
        for (_j = 0, _len1 = this.length; _j < _len1; _j++) {
          o = this[_j];
          o[prop] = value;
        }
        return this;
      }
    };

    AgentSet.prototype.maxProp = function(prop) {
      return u.aMax(this.getProp(prop));
    };

    AgentSet.prototype.minProp = function(prop) {
      return u.aMin(this.getProp(prop));
    };

    AgentSet.prototype.histOfProp = function(prop, bin) {
      if (bin == null) {
        bin = 1;
      }
      return u.histOf(this, bin, prop);
    };

    AgentSet.prototype.shuffle = function() {
      return u.shuffle(this);
    };

    AgentSet.prototype.sortById = function() {
      return u.sortBy(this, "id");
    };

    AgentSet.prototype.clone = function() {
      return this.asSet(u.clone(this));
    };

    AgentSet.prototype.last = function() {
      return u.last(this);
    };

    AgentSet.prototype.any = function() {
      return u.any(this);
    };

    AgentSet.prototype.other = function(a) {
      var o;
      return this.asSet((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = this.length; _i < _len; _i++) {
          o = this[_i];
          if (o !== a) {
            _results.push(o);
          }
        }
        return _results;
      }).call(this));
    };

    AgentSet.prototype.oneOf = function() {
      return u.oneOf(this);
    };

    AgentSet.prototype.nOf = function(n) {
      return this.asSet(u.nOf(this, n));
    };

    AgentSet.prototype.minOneOf = function(f, valueToo) {
      if (valueToo == null) {
        valueToo = false;
      }
      return u.minOneOf(this, f, valueToo);
    };

    AgentSet.prototype.maxOneOf = function(f, valueToo) {
      if (valueToo == null) {
        valueToo = false;
      }
      return u.maxOneOf(this, f, valueToo);
    };

    AgentSet.prototype.draw = function(ctx) {
      var o, _i, _len;
      u.clearCtx(ctx);
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        o = this[_i];
        if (!o.hidden) {
          o.draw(ctx);
        }
      }
      return null;
    };

    AgentSet.prototype.show = function() {
      var o, _i, _len;
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        o = this[_i];
        o.hidden = false;
      }
      return this.draw(this.model.contexts[this.name]);
    };

    AgentSet.prototype.hide = function() {
      var o, _i, _len;
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        o = this[_i];
        o.hidden = true;
      }
      return this.draw(this.model.contexts[this.name]);
    };

    AgentSet.prototype.inRadius = function(o, d, meToo) {
      var a, d2, h, w, x, y;
      if (meToo == null) {
        meToo = false;
      }
      d2 = d * d;
      x = o.x;
      y = o.y;
      if (this.model.patches.isTorus) {
        w = this.model.patches.numX;
        h = this.model.patches.numY;
        return this.asSet((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = this.length; _i < _len; _i++) {
            a = this[_i];
            if (u.torusSqDistance(x, y, a.x, a.y, w, h) <= d2 && (meToo || a !== o)) {
              _results.push(a);
            }
          }
          return _results;
        }).call(this));
      } else {
        return this.asSet((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = this.length; _i < _len; _i++) {
            a = this[_i];
            if (u.sqDistance(x, y, a.x, a.y) <= d2 && (meToo || a !== o)) {
              _results.push(a);
            }
          }
          return _results;
        }).call(this));
      }
    };

    AgentSet.prototype.inCone = function(o, heading, cone, radius, meToo) {
      var a, h, rSet, w, x, y;
      if (meToo == null) {
        meToo = false;
      }
      rSet = this.inRadius(o, radius, meToo);
      x = o.x;
      y = o.y;
      if (this.model.patches.isTorus) {
        w = this.model.patches.numX;
        h = this.model.patches.numY;
        return this.asSet((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = rSet.length; _i < _len; _i++) {
            a = rSet[_i];
            if ((a === o && meToo) || u.inTorusCone(heading, cone, radius, x, y, a.x, a.y, w, h)) {
              _results.push(a);
            }
          }
          return _results;
        })());
      } else {
        return this.asSet((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = rSet.length; _i < _len; _i++) {
            a = rSet[_i];
            if ((a === o && meToo) || u.inCone(heading, cone, radius, x, y, a.x, a.y)) {
              _results.push(a);
            }
          }
          return _results;
        })());
      }
    };

    AgentSet.prototype.ask = function(f) {
      var o, _i, _len;
      if (u.isString(f)) {
        eval("f=function(o){return " + f + ";}");
      }
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        o = this[_i];
        f(o);
      }
      return this;
    };

    AgentSet.prototype["with"] = function(f) {
      var o;
      if (u.isString(f)) {
        eval("f=function(o){return " + f + ";}");
      }
      return this.asSet((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = this.length; _i < _len; _i++) {
          o = this[_i];
          if (f(o)) {
            _results.push(o);
          }
        }
        return _results;
      }).call(this));
    };

    return AgentSet;

  })(Array);

  Patch = (function() {
    Patch.prototype.id = null;

    Patch.prototype.breed = null;

    Patch.prototype.x = null;

    Patch.prototype.y = null;

    Patch.prototype.n = null;

    Patch.prototype.n4 = null;

    Patch.prototype.color = [0, 0, 0];

    Patch.prototype.hidden = false;

    Patch.prototype.label = null;

    Patch.prototype.labelColor = [0, 0, 0];

    Patch.prototype.labelOffset = [0, 0];

    Patch.prototype.pRect = null;

    function Patch(x, y) {
      this.x = x;
      this.y = y;
    }

    Patch.prototype.toString = function() {
      return "{id:" + this.id + " xy:" + [this.x, this.y] + " c:" + this.color + "}";
    };

    Patch.prototype.scaleColor = function(c, s) {
      if (!this.hasOwnProperty("color")) {
        this.color = u.clone(this.color);
      }
      return u.scaleColor(c, s, this.color);
    };

    Patch.prototype.scaleOpacity = function(c, s) {
      if (!this.hasOwnProperty("color")) {
        this.color = u.clone(this.color);
      }
      return u.scaleOpacity(c, s, this.color);
    };

    Patch.prototype.draw = function(ctx) {
      var x, y, _ref;
      ctx.fillStyle = u.colorStr(this.color);
      ctx.fillRect(this.x - .5, this.y - .5, 1, 1);
      if (this.label != null) {
        _ref = this.breed.patchXYtoPixelXY(this.x, this.y), x = _ref[0], y = _ref[1];
        return u.ctxDrawText(ctx, this.label, x + this.labelOffset[0], y + this.labelOffset[1], this.labelColor);
      }
    };

    Patch.prototype.agentsHere = function() {
      var a, _ref;
      return (_ref = this.agents) != null ? _ref : (function() {
        var _i, _len, _ref1, _results;
        _ref1 = this.model.agents;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          a = _ref1[_i];
          if (a.p === this) {
            _results.push(a);
          }
        }
        return _results;
      }).call(this);
    };

    Patch.prototype.isOnEdge = function() {
      return this.x === this.breed.minX || this.x === this.breed.maxX || this.y === this.breed.minY || this.y === this.breed.maxY;
    };

    Patch.prototype.sprout = function(num, breed, init) {
      if (num == null) {
        num = 1;
      }
      if (breed == null) {
        breed = this.model.agents;
      }
      if (init == null) {
        init = function() {};
      }
      return breed.create(num, (function(_this) {
        return function(a) {
          a.setXY(_this.x, _this.y);
          init(a);
          return a;
        };
      })(this));
    };

    return Patch;

  })();

  Patches = (function(_super) {
    __extends(Patches, _super);

    function Patches() {
      var k, v, _ref;
      Patches.__super__.constructor.apply(this, arguments);
      this.monochrome = false;
      _ref = this.model.world;
      for (k in _ref) {
        if (!__hasProp.call(_ref, k)) continue;
        v = _ref[k];
        this[k] = v;
      }
      if (this.mainSet == null) {
        this.populate();
      }
    }

    Patches.prototype.populate = function() {
      var x, y, _i, _j, _ref, _ref1, _ref2, _ref3;
      for (y = _i = _ref = this.maxY, _ref1 = this.minY; _i >= _ref1; y = _i += -1) {
        for (x = _j = _ref2 = this.minX, _ref3 = this.maxX; _j <= _ref3; x = _j += 1) {
          this.add(new this.agentClass(x, y));
        }
      }
      if (this.hasNeighbors) {
        this.setNeighbors();
      }
      if (!this.isHeadless) {
        return this.setPixels();
      }
    };

    Patches.prototype.cacheAgentsHere = function() {
      var p, _i, _len;
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        p = this[_i];
        p.agents = [];
      }
      return null;
    };

    Patches.prototype.usePixels = function(drawWithPixels) {
      var ctx;
      this.drawWithPixels = drawWithPixels != null ? drawWithPixels : true;
      ctx = this.model.contexts.patches;
      return u.setCtxSmoothing(ctx, !this.drawWithPixels);
    };

    Patches.prototype.cacheRect = function(radius, meToo) {
      var p, _i, _len;
      if (meToo == null) {
        meToo = false;
      }
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        p = this[_i];
        p.pRect = this.patchRect(p, radius, radius, meToo);
        p.pRect.radius = radius;
      }
      return radius;
    };

    Patches.prototype.setNeighbors = function() {
      var n, p, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        p = this[_i];
        p.n = this.patchRect(p, 1, 1);
        _results.push(p.n4 = this.asSet((function() {
          var _j, _len1, _ref, _results1;
          _ref = p.n;
          _results1 = [];
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            n = _ref[_j];
            if (n.x === p.x || n.y === p.y) {
              _results1.push(n);
            }
          }
          return _results1;
        })()));
      }
      return _results;
    };

    Patches.prototype.setPixels = function() {
      if (this.size === 1) {
        this.usePixels();
        this.pixelsCtx = this.model.contexts.patches;
      } else {
        this.pixelsCtx = u.createCtx(this.numX, this.numY);
      }
      this.pixelsImageData = this.pixelsCtx.getImageData(0, 0, this.numX, this.numY);
      this.pixelsData = this.pixelsImageData.data;
      if (this.pixelsData instanceof Uint8Array) {
        this.pixelsData32 = new Uint32Array(this.pixelsData.buffer);
        return this.pixelsAreLittleEndian = u.isLittleEndian();
      }
    };

    Patches.prototype.draw = function(ctx) {
      if (this.monochrome) {
        return u.fillCtx(ctx, this.agentClass.prototype.color);
      } else if (this.drawWithPixels) {
        return this.drawScaledPixels(ctx);
      } else {
        return Patches.__super__.draw.call(this, ctx);
      }
    };

    Patches.prototype.patchIndex = function(x, y) {
      return x - this.minX + this.numX * (this.maxY - y);
    };

    Patches.prototype.patchXY = function(x, y) {
      return this[this.patchIndex(x, y)];
    };

    Patches.prototype.clamp = function(x, y) {
      return [u.clamp(x, this.minXcor, this.maxXcor), u.clamp(y, this.minYcor, this.maxYcor)];
    };

    Patches.prototype.wrap = function(x, y) {
      return [u.wrap(x, this.minXcor, this.maxXcor), u.wrap(y, this.minYcor, this.maxYcor)];
    };

    Patches.prototype.coord = function(x, y) {
      if (this.isTorus) {
        return this.wrap(x, y);
      } else {
        return this.clamp(x, y);
      }
    };

    Patches.prototype.isOnWorld = function(x, y) {
      return this.isTorus || ((this.minXcor <= x && x <= this.maxXcor) && (this.minYcor <= y && y <= this.maxYcor));
    };

    Patches.prototype.patch = function(x, y) {
      var _ref;
      _ref = this.coord(x, y), x = _ref[0], y = _ref[1];
      x = u.clamp(Math.round(x), this.minX, this.maxX);
      y = u.clamp(Math.round(y), this.minY, this.maxY);
      return this.patchXY(x, y);
    };

    Patches.prototype.randomPt = function() {
      return [u.randomFloat2(this.minXcor, this.maxXcor), u.randomFloat2(this.minYcor, this.maxYcor)];
    };

    Patches.prototype.toBits = function(p) {
      return p * this.size;
    };

    Patches.prototype.fromBits = function(b) {
      return b / this.size;
    };

    Patches.prototype.patchRect = function(p, dx, dy, meToo) {
      var pnext, rect, x, y, _i, _j, _ref, _ref1, _ref2, _ref3;
      if (meToo == null) {
        meToo = false;
      }
      if ((p.pRect != null) && p.pRect.radius === dx) {
        return p.pRect;
      }
      rect = [];
      for (y = _i = _ref = p.y - dy, _ref1 = p.y + dy; _i <= _ref1; y = _i += 1) {
        for (x = _j = _ref2 = p.x - dx, _ref3 = p.x + dx; _j <= _ref3; x = _j += 1) {
          if (this.isTorus || ((this.minX <= x && x <= this.maxX) && (this.minY <= y && y <= this.maxY))) {
            if (this.isTorus) {
              if (x < this.minX) {
                x += this.numX;
              }
              if (x > this.maxX) {
                x -= this.numX;
              }
              if (y < this.minY) {
                y += this.numY;
              }
              if (y > this.maxY) {
                y -= this.numY;
              }
            }
            pnext = this.patchXY(x, y);
            if (pnext == null) {
              u.error("patchRect: x,y out of bounds, see console.log");
              console.log("x " + x + " y " + y + " p.x " + p.x + " p.y " + p.y + " dx " + dx + " dy " + dy);
            }
            if (meToo || p !== pnext) {
              rect.push(pnext);
            }
          }
        }
      }
      return this.asSet(rect);
    };

    Patches.prototype.importDrawing = function(imageSrc, f) {
      return u.importImage(imageSrc, (function(_this) {
        return function(img) {
          _this.installDrawing(img);
          if (f != null) {
            return f();
          }
        };
      })(this));
    };

    Patches.prototype.installDrawing = function(img, ctx) {
      if (ctx == null) {
        ctx = this.model.contexts.drawing;
      }
      u.setIdentity(ctx);
      ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
      return ctx.restore();
    };

    Patches.prototype.pixelByteIndex = function(p) {
      return 4 * p.id;
    };

    Patches.prototype.pixelWordIndex = function(p) {
      return p.id;
    };

    Patches.prototype.pixelXYtoPatchXY = function(x, y) {
      return [this.minXcor + (x / this.size), this.maxYcor - (y / this.size)];
    };

    Patches.prototype.patchXYtoPixelXY = function(x, y) {
      return [(x - this.minXcor) * this.size, (this.maxYcor - y) * this.size];
    };

    Patches.prototype.importColors = function(imageSrc, f, map) {
      return u.importImage(imageSrc, (function(_this) {
        return function(img) {
          _this.installColors(img, map);
          if (f != null) {
            return f();
          }
        };
      })(this));
    };

    Patches.prototype.installColors = function(img, map) {
      var data, i, p, _i, _len;
      u.setIdentity(this.pixelsCtx);
      this.pixelsCtx.drawImage(img, 0, 0, this.numX, this.numY);
      data = this.pixelsCtx.getImageData(0, 0, this.numX, this.numY).data;
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        p = this[_i];
        i = this.pixelByteIndex(p);
        p.color = map != null ? map[i] : [data[i++], data[i++], data[i]];
      }
      return this.pixelsCtx.restore();
    };

    Patches.prototype.drawScaledPixels = function(ctx) {
      if (this.size !== 1) {
        u.setIdentity(ctx);
      }
      if (this.pixelsData32 != null) {
        this.drawScaledPixels32(ctx);
      } else {
        this.drawScaledPixels8(ctx);
      }
      if (this.size !== 1) {
        return ctx.restore();
      }
    };

    Patches.prototype.drawScaledPixels8 = function(ctx) {
      var a, c, data, i, j, p, _i, _j, _len;
      data = this.pixelsData;
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        p = this[_i];
        i = this.pixelByteIndex(p);
        c = p.color;
        a = c.length === 4 ? c[3] : 255;
        for (j = _j = 0; _j <= 2; j = ++_j) {
          data[i + j] = c[j];
        }
        data[i + 3] = a;
      }
      this.pixelsCtx.putImageData(this.pixelsImageData, 0, 0);
      if (this.size === 1) {
        return;
      }
      return ctx.drawImage(this.pixelsCtx.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height);
    };

    Patches.prototype.drawScaledPixels32 = function(ctx) {
      var a, c, data, i, p, _i, _len;
      data = this.pixelsData32;
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        p = this[_i];
        i = this.pixelWordIndex(p);
        c = p.color;
        a = c.length === 4 ? c[3] : 255;
        if (this.pixelsAreLittleEndian) {
          data[i] = (a << 24) | (c[2] << 16) | (c[1] << 8) | c[0];
        } else {
          data[i] = (c[0] << 24) | (c[1] << 16) | (c[2] << 8) | a;
        }
      }
      this.pixelsCtx.putImageData(this.pixelsImageData, 0, 0);
      if (this.size === 1) {
        return;
      }
      return ctx.drawImage(this.pixelsCtx.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height);
    };

    Patches.prototype.floodFillOnce = function(aset, fCandidate, fJoin, fNeighbors, asetLast) {
      if (fNeighbors == null) {
        fNeighbors = (function(p) {
          return p.n;
        });
      }
      if (asetLast == null) {
        asetLast = [];
      }
      return Patches.__super__.floodFillOnce.call(this, aset, fCandidate, fJoin, fNeighbors, asetLast);
    };

    Patches.prototype.diffuse = function(v, rate, c) {
      var dv, dv8, n, nn, p, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref;
      if (this[0]._diffuseNext == null) {
        for (_i = 0, _len = this.length; _i < _len; _i++) {
          p = this[_i];
          p._diffuseNext = 0;
        }
      }
      for (_j = 0, _len1 = this.length; _j < _len1; _j++) {
        p = this[_j];
        dv = p[v] * rate;
        dv8 = dv / 8;
        nn = p.n.length;
        p._diffuseNext += p[v] - dv + (8 - nn) * dv8;
        _ref = p.n;
        for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
          n = _ref[_k];
          n._diffuseNext += dv8;
        }
      }
      for (_l = 0, _len3 = this.length; _l < _len3; _l++) {
        p = this[_l];
        p[v] = p._diffuseNext;
        p._diffuseNext = 0;
        if (c) {
          p.scaleColor(c, p[v]);
        }
      }
      return null;
    };

    return Patches;

  })(AgentSet);

  Agent = (function() {
    Agent.prototype.id = null;

    Agent.prototype.breed = null;

    Agent.prototype.x = 0;

    Agent.prototype.y = 0;

    Agent.prototype.p = null;

    Agent.prototype.size = 1;

    Agent.prototype.color = null;

    Agent.prototype.strokeColor = null;

    Agent.prototype.shape = "default";

    Agent.prototype.hidden = false;

    Agent.prototype.label = null;

    Agent.prototype.labelColor = [0, 0, 0];

    Agent.prototype.labelOffset = [0, 0];

    Agent.prototype.penDown = false;

    Agent.prototype.penSize = 1;

    Agent.prototype.heading = null;

    Agent.prototype.sprite = null;

    Agent.prototype.cacheLinks = false;

    Agent.prototype.links = null;

    function Agent() {
      this.x = this.y = 0;
      this.p = this.model.patches.patch(this.x, this.y);
      if (this.color == null) {
        this.color = u.randomColor();
      }
      if (this.heading == null) {
        this.heading = u.randomFloat(Math.PI * 2);
      }
      if (this.p.agents != null) {
        this.p.agents.push(this);
      }
      if (this.cacheLinks) {
        this.links = [];
      }
    }

    Agent.prototype.scaleColor = function(c, s) {
      if (!this.hasOwnProperty("color")) {
        this.color = u.clone(this.color);
      }
      return u.scaleColor(c, s, this.color);
    };

    Agent.prototype.scaleOpacity = function(c, s) {
      if (!this.hasOwnProperty("color")) {
        this.color = u.clone(this.color);
      }
      return u.scaleOpacity(c, s, this.color);
    };

    Agent.prototype.toString = function() {
      var h;
      return "{id:" + this.id + " xy:" + (u.aToFixed([this.x, this.y])) + " c:" + this.color + " h: " + (h = this.heading.toFixed(2)) + "/" + (Math.round(u.radToDeg(h))) + "}";
    };

    Agent.prototype.setXY = function(x, y) {
      var drawing, p, x0, y0, _ref, _ref1;
      if (this.penDown) {
        _ref = [this.x, this.y], x0 = _ref[0], y0 = _ref[1];
      }
      _ref1 = this.model.patches.coord(x, y), this.x = _ref1[0], this.y = _ref1[1];
      p = this.p;
      this.p = this.model.patches.patch(this.x, this.y);
      if ((p.agents != null) && p !== this.p) {
        u.removeItem(p.agents, this);
        this.p.agents.push(this);
      }
      if (this.penDown) {
        drawing = this.model.drawing;
        drawing.strokeStyle = u.colorStr(this.color);
        drawing.lineWidth = this.model.patches.fromBits(this.penSize);
        drawing.beginPath();
        drawing.moveTo(x0, y0);
        drawing.lineTo(x, y);
        return drawing.stroke();
      }
    };

    Agent.prototype.moveTo = function(a) {
      return this.setXY(a.x, a.y);
    };

    Agent.prototype.forward = function(d) {
      return this.setXY(this.x + d * Math.cos(this.heading), this.y + d * Math.sin(this.heading));
    };

    Agent.prototype.rotate = function(rad) {
      return this.heading = u.wrap(this.heading + rad, 0, Math.PI * 2);
    };

    Agent.prototype.right = function(rad) {
      return this.rotate(-rad);
    };

    Agent.prototype.left = function(rad) {
      return this.rotate(rad);
    };

    Agent.prototype.draw = function(ctx) {
      var rad, shape, x, y, _ref;
      shape = Shapes[this.shape];
      rad = shape.rotate ? this.heading : 0;
      if ((this.sprite != null) || this.breed.useSprites) {
        if (this.sprite == null) {
          this.setSprite();
        }
        Shapes.drawSprite(ctx, this.sprite, this.x, this.y, this.size, rad);
      } else {
        Shapes.draw(ctx, shape, this.x, this.y, this.size, rad, this.color, this.strokeColor);
      }
      if (this.label != null) {
        _ref = this.model.patches.patchXYtoPixelXY(this.x, this.y), x = _ref[0], y = _ref[1];
        return u.ctxDrawText(ctx, this.label, x + this.labelOffset[0], y + this.labelOffset[1], this.labelColor);
      }
    };

    Agent.prototype.setSprite = function(sprite) {
      var s;
      if ((s = sprite) != null) {
        this.sprite = s;
        this.color = s.color;
        this.strokeColor = s.strokeColor;
        this.shape = s.shape;
        return this.size = s.size;
      } else {
        if (this.color == null) {
          this.color = u.randomColor;
        }
        return this.sprite = Shapes.shapeToSprite(this.shape, this.color, this.model.patches.toBits(this.size), this.strokeColor);
      }
    };

    Agent.prototype.stamp = function() {
      return this.draw(this.model.drawing);
    };

    Agent.prototype.distanceXY = function(x, y) {
      if (this.model.patches.isTorus) {
        return u.torusDistance(this.x, this.y, x, y, this.model.patches.numX, this.model.patches.numY);
      } else {
        return u.distance(this.x, this.y, x, y);
      }
    };

    Agent.prototype.distance = function(o) {
      return this.distanceXY(o.x, o.y);
    };

    Agent.prototype.torusPtXY = function(x, y) {
      return u.torusPt(this.x, this.y, x, y, this.model.patches.numX, this.model.patches.numY);
    };

    Agent.prototype.torusPt = function(o) {
      return this.torusPtXY(o.x, o.y);
    };

    Agent.prototype.face = function(o) {
      return this.heading = this.towards(o);
    };

    Agent.prototype.towardsXY = function(x, y) {
      var ps;
      if ((ps = this.model.patches).isTorus) {
        return u.torusRadsToward(this.x, this.y, x, y, ps.numX, ps.numY);
      } else {
        return u.radsToward(this.x, this.y, x, y);
      }
    };

    Agent.prototype.towards = function(o) {
      return this.towardsXY(o.x, o.y);
    };

    Agent.prototype.patchAtHeadingAndDistance = function(h, d) {
      var dx, dy, _ref;
      _ref = u.polarToXY(d, h + this.heading), dx = _ref[0], dy = _ref[1];
      return this.patchAt(dx, dy);
    };

    Agent.prototype.patchLeftAndAhead = function(dh, d) {
      return this.patchAtHeadingAndDistance(dh, d);
    };

    Agent.prototype.patchRightAndAhead = function(dh, d) {
      return this.patchAtHeadingAndDistance(-dh, d);
    };

    Agent.prototype.patchAhead = function(d) {
      return this.patchAtHeadingAndDistance(0, d);
    };

    Agent.prototype.canMove = function(d) {
      return this.patchAhead(d) != null;
    };

    Agent.prototype.patchAt = function(dx, dy) {
      var ps, x, y;
      x = this.x + dx;
      y = this.y + dy;
      if ((ps = this.model.patches).isOnWorld(x, y)) {
        return ps.patch(x, y);
      } else {
        return null;
      }
    };

    Agent.prototype.die = function() {
      var l, _i, _ref;
      this.breed.remove(this);
      _ref = this.myLinks();
      for (_i = _ref.length - 1; _i >= 0; _i += -1) {
        l = _ref[_i];
        l.die();
      }
      if (this.p.agents != null) {
        u.removeItem(this.p.agents, this);
      }
      return null;
    };

    Agent.prototype.hatch = function(num, breed, init) {
      if (num == null) {
        num = 1;
      }
      if (breed == null) {
        breed = this.model.agents;
      }
      if (init == null) {
        init = function() {};
      }
      return breed.create(num, (function(_this) {
        return function(a) {
          var k, v;
          a.setXY(_this.x, _this.y);
          for (k in _this) {
            if (!__hasProp.call(_this, k)) continue;
            v = _this[k];
            if (k !== "id") {
              a[k] = v;
            }
          }
          init(a);
          return a;
        };
      })(this));
    };

    Agent.prototype.inCone = function(aset, cone, radius, meToo) {
      if (meToo == null) {
        meToo = false;
      }
      return aset.inCone(this.p, this.heading, cone, radius, meToo);
    };

    Agent.prototype.otherEnd = function(l) {
      if (l.end1 === this) {
        return l.end2;
      } else {
        return l.end1;
      }
    };

    Agent.prototype.myLinks = function() {
      var l, _ref;
      return (_ref = this.links) != null ? _ref : (function() {
        var _i, _len, _ref1, _results;
        _ref1 = this.model.links;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          l = _ref1[_i];
          if ((l.end1 === this) || (l.end2 === this)) {
            _results.push(l);
          }
        }
        return _results;
      }).call(this);
    };

    Agent.prototype.linkNeighbors = function() {
      var l, _i, _len, _ref, _results;
      _ref = this.myLinks();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        l = _ref[_i];
        _results.push(this.otherEnd(l));
      }
      return _results;
    };

    Agent.prototype.myInLinks = function() {
      var l, _i, _len, _ref, _results;
      _ref = this.myLinks();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        l = _ref[_i];
        if (l.end2 === this) {
          _results.push(l);
        }
      }
      return _results;
    };

    Agent.prototype.inLinkNeighbors = function() {
      var l, _i, _len, _ref, _results;
      _ref = this.myLinks();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        l = _ref[_i];
        if (l.end2 === this) {
          _results.push(l.end1);
        }
      }
      return _results;
    };

    Agent.prototype.myOutLinks = function() {
      var l, _i, _len, _ref, _results;
      _ref = this.myLinks();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        l = _ref[_i];
        if (l.end1 === this) {
          _results.push(l);
        }
      }
      return _results;
    };

    Agent.prototype.outLinkNeighbors = function() {
      var l, _i, _len, _ref, _results;
      _ref = this.myLinks();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        l = _ref[_i];
        if (l.end1 === this) {
          _results.push(l.end2);
        }
      }
      return _results;
    };

    return Agent;

  })();

  Agents = (function(_super) {
    __extends(Agents, _super);

    function Agents() {
      Agents.__super__.constructor.apply(this, arguments);
      this.useSprites = false;
    }

    Agents.prototype.cacheLinks = function() {
      return this.agentClass.prototype.cacheLinks = true;
    };

    Agents.prototype.setUseSprites = function(useSprites) {
      this.useSprites = useSprites != null ? useSprites : true;
    };

    Agents.prototype["in"] = function(array) {
      var o;
      return this.asSet((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = array.length; _i < _len; _i++) {
          o = array[_i];
          if (o.breed === this) {
            _results.push(o);
          }
        }
        return _results;
      }).call(this));
    };

    Agents.prototype.create = function(num, init) {
      var i, _i, _results;
      if (init == null) {
        init = function() {};
      }
      _results = [];
      for (i = _i = 1; _i <= num; i = _i += 1) {
        _results.push((function(o) {
          init(o);
          return o;
        })(this.add(new this.agentClass)));
      }
      return _results;
    };

    Agents.prototype.clear = function() {
      while (this.any()) {
        this.last().die();
      }
      return null;
    };

    Agents.prototype.inPatches = function(patches) {
      var array, p, _i, _len;
      array = [];
      for (_i = 0, _len = patches.length; _i < _len; _i++) {
        p = patches[_i];
        array.push.apply(array, p.agentsHere());
      }
      if (this.mainSet != null) {
        return this["in"](array);
      } else {
        return this.asSet(array);
      }
    };

    Agents.prototype.inRect = function(a, dx, dy, meToo) {
      var rect;
      if (meToo == null) {
        meToo = false;
      }
      rect = this.model.patches.patchRect(a.p, dx, dy, true);
      rect = this.inPatches(rect);
      if (!meToo) {
        u.removeItem(rect, a);
      }
      return rect;
    };

    Agents.prototype.inCone = function(a, heading, cone, radius, meToo) {
      var as;
      if (meToo == null) {
        meToo = false;
      }
      as = this.inRect(a, radius, radius, true);
      return Agents.__super__.inCone.call(this, a, heading, cone, radius, meToo);
    };

    Agents.prototype.inRadius = function(a, radius, meToo) {
      var as;
      if (meToo == null) {
        meToo = false;
      }
      as = this.inRect(a, radius, radius, true);
      return Agents.__super__.inRadius.call(this, a, radius, meToo);
    };

    return Agents;

  })(AgentSet);

  Link = (function() {
    Link.prototype.id = null;

    Link.prototype.breed = null;

    Link.prototype.end1 = null;

    Link.prototype.end2 = null;

    Link.prototype.color = [130, 130, 130];

    Link.prototype.thickness = 2;

    Link.prototype.hidden = false;

    Link.prototype.label = null;

    Link.prototype.labelColor = [0, 0, 0];

    Link.prototype.labelOffset = [0, 0];

    function Link(end1, end2) {
      this.end1 = end1;
      this.end2 = end2;
      if (this.end1.links != null) {
        this.end1.links.push(this);
        this.end2.links.push(this);
      }
    }

    Link.prototype.draw = function(ctx) {
      var pt, x, x0, y, y0, _ref, _ref1;
      ctx.save();
      ctx.strokeStyle = u.colorStr(this.color);
      ctx.lineWidth = this.model.patches.fromBits(this.thickness);
      ctx.beginPath();
      if (!this.model.patches.isTorus) {
        ctx.moveTo(this.end1.x, this.end1.y);
        ctx.lineTo(this.end2.x, this.end2.y);
      } else {
        pt = this.end1.torusPt(this.end2);
        ctx.moveTo(this.end1.x, this.end1.y);
        ctx.lineTo.apply(ctx, pt);
        if (pt[0] !== this.end2.x || pt[1] !== this.end2.y) {
          pt = this.end2.torusPt(this.end1);
          ctx.moveTo(this.end2.x, this.end2.y);
          ctx.lineTo.apply(ctx, pt);
        }
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
      if (this.label != null) {
        _ref = u.lerp2(this.end1.x, this.end1.y, this.end2.x, this.end2.y, .5), x0 = _ref[0], y0 = _ref[1];
        _ref1 = this.model.patches.patchXYtoPixelXY(x0, y0), x = _ref1[0], y = _ref1[1];
        return u.ctxDrawText(ctx, this.label, x + this.labelOffset[0], y + this.labelOffset[1], this.labelColor);
      }
    };

    Link.prototype.die = function() {
      this.breed.remove(this);
      if (this.end1.links != null) {
        u.removeItem(this.end1.links, this);
      }
      if (this.end2.links != null) {
        u.removeItem(this.end2.links, this);
      }
      return null;
    };

    Link.prototype.bothEnds = function() {
      return [this.end1, this.end2];
    };

    Link.prototype.length = function() {
      return this.end1.distance(this.end2);
    };

    Link.prototype.otherEnd = function(a) {
      if (this.end1 === a) {
        return this.end2;
      } else {
        return this.end1;
      }
    };

    return Link;

  })();

  Links = (function(_super) {
    __extends(Links, _super);

    function Links() {
      Links.__super__.constructor.apply(this, arguments);
    }

    Links.prototype.create = function(from, to, init) {
      var a, _i, _len, _results;
      if (init == null) {
        init = function() {};
      }
      if (to.length == null) {
        to = [to];
      }
      _results = [];
      for (_i = 0, _len = to.length; _i < _len; _i++) {
        a = to[_i];
        _results.push((function(o) {
          init(o);
          return o;
        })(this.add(new this.agentClass(from, a))));
      }
      return _results;
    };

    Links.prototype.clear = function() {
      while (this.any()) {
        this.last().die();
      }
      return null;
    };

    Links.prototype.allEnds = function() {
      var l, n, _i, _len;
      n = this.asSet([]);
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        l = this[_i];
        n.push(l.end1, l.end2);
      }
      return n;
    };

    Links.prototype.nodes = function() {
      return this.allEnds().sortById().uniq();
    };

    Links.prototype.layoutCircle = function(list, radius, startAngle, direction) {
      var a, dTheta, i, _i, _len;
      if (startAngle == null) {
        startAngle = Math.PI / 2;
      }
      if (direction == null) {
        direction = -1;
      }
      dTheta = 2 * Math.PI / list.length;
      for (i = _i = 0, _len = list.length; _i < _len; i = ++_i) {
        a = list[i];
        a.setXY(0, 0);
        a.heading = startAngle + direction * dTheta * i;
        a.forward(radius);
      }
      return null;
    };

    return Links;

  })(AgentSet);

  Model = (function() {
    Model.prototype.contextsInit = {
      patches: {
        z: 10,
        ctx: "2d"
      },
      drawing: {
        z: 20,
        ctx: "2d"
      },
      links: {
        z: 30,
        ctx: "2d"
      },
      agents: {
        z: 40,
        ctx: "2d"
      },
      spotlight: {
        z: 50,
        ctx: "2d"
      }
    };

    function Model(divOrOpts, size, minX, maxX, minY, maxY, isTorus, hasNeighbors, isHeadless) {
      var ctx, div, k, v, _ref;
      if (size == null) {
        size = 13;
      }
      if (minX == null) {
        minX = -16;
      }
      if (maxX == null) {
        maxX = 16;
      }
      if (minY == null) {
        minY = -16;
      }
      if (maxY == null) {
        maxY = 16;
      }
      if (isTorus == null) {
        isTorus = false;
      }
      if (hasNeighbors == null) {
        hasNeighbors = true;
      }
      if (isHeadless == null) {
        isHeadless = false;
      }
      u.mixin(this, new Evented());
      if (typeof divOrOpts === 'string') {
        div = divOrOpts;
        this.setWorldDeprecated(size, minX, maxX, minY, maxY, isTorus, hasNeighbors, isHeadless);
      } else {
        div = divOrOpts.div;
        isHeadless = divOrOpts.isHeadless = divOrOpts.isHeadless || (div == null);
        this.setWorld(divOrOpts);
      }
      this.contexts = {};
      if (!isHeadless) {
        (this.div = document.getElementById(div)).setAttribute('style', "position:relative; width:" + this.world.pxWidth + "px; height:" + this.world.pxHeight + "px");
        _ref = this.contextsInit;
        for (k in _ref) {
          if (!__hasProp.call(_ref, k)) continue;
          v = _ref[k];
          this.contexts[k] = ctx = u.createLayer(this.div, this.world.pxWidth, this.world.pxHeight, v.z, v.ctx);
          if (ctx.canvas != null) {
            this.setCtxTransform(ctx);
          }
          if (ctx.canvas != null) {
            ctx.canvas.style.pointerEvents = 'none';
          }
          u.elementTextParams(ctx, "10px sans-serif", "center", "middle");
        }
        this.drawing = this.contexts.drawing;
        this.drawing.clear = (function(_this) {
          return function() {
            return u.clearCtx(_this.drawing);
          };
        })(this);
        this.contexts.spotlight.globalCompositeOperation = "xor";
      }
      this.anim = new Animator(this);
      this.refreshLinks = this.refreshAgents = this.refreshPatches = true;
      this.Patches = Patches;
      this.Patch = u.cloneClass(Patch);
      this.Agents = Agents;
      this.Agent = u.cloneClass(Agent);
      this.Links = Links;
      this.Link = u.cloneClass(Link);
      this.patches = new this.Patches(this, this.Patch, "patches");
      this.agents = new this.Agents(this, this.Agent, "agents");
      this.links = new this.Links(this, this.Link, "links");
      this.debugging = false;
      this.modelReady = false;
      this.globalNames = null;
      this.globalNames = u.ownKeys(this);
      this.globalNames.set = false;
      this.startup();
      u.waitOnFiles((function(_this) {
        return function() {
          _this.modelReady = true;
          _this.setupAndEmit();
          if (!_this.globalNames.set) {
            return _this.globals();
          }
        };
      })(this));
    }

    Model.prototype.setWorld = function(opts) {
      var defaults, hasNeighbors, isHeadless, isTorus, k, maxX, maxXcor, maxY, maxYcor, minX, minXcor, minY, minYcor, numX, numY, pxHeight, pxWidth, size, v, w;
      w = defaults = {
        size: 13,
        minX: -16,
        maxX: 16,
        minY: -16,
        maxY: 16,
        isTorus: false,
        hasNeighbors: true,
        isHeadless: false
      };
      for (k in opts) {
        if (!__hasProp.call(opts, k)) continue;
        v = opts[k];
        w[k] = v;
      }
      size = w.size, minX = w.minX, maxX = w.maxX, minY = w.minY, maxY = w.maxY, isTorus = w.isTorus, hasNeighbors = w.hasNeighbors, isHeadless = w.isHeadless;
      numX = maxX - minX + 1;
      numY = maxY - minY + 1;
      pxWidth = numX * size;
      pxHeight = numY * size;
      minXcor = minX - .5;
      maxXcor = maxX + .5;
      minYcor = minY - .5;
      maxYcor = maxY + .5;
      return this.world = {
        size: size,
        minX: minX,
        maxX: maxX,
        minY: minY,
        maxY: maxY,
        minXcor: minXcor,
        maxXcor: maxXcor,
        minYcor: minYcor,
        maxYcor: maxYcor,
        numX: numX,
        numY: numY,
        pxWidth: pxWidth,
        pxHeight: pxHeight,
        isTorus: isTorus,
        hasNeighbors: hasNeighbors,
        isHeadless: isHeadless
      };
    };

    Model.prototype.setWorldDeprecated = function(size, minX, maxX, minY, maxY, isTorus, hasNeighbors, isHeadless) {
      var maxXcor, maxYcor, minXcor, minYcor, numX, numY, pxHeight, pxWidth;
      numX = maxX - minX + 1;
      numY = maxY - minY + 1;
      pxWidth = numX * size;
      pxHeight = numY * size;
      minXcor = minX - .5;
      maxXcor = maxX + .5;
      minYcor = minY - .5;
      maxYcor = maxY + .5;
      return this.world = {
        size: size,
        minX: minX,
        maxX: maxX,
        minY: minY,
        maxY: maxY,
        minXcor: minXcor,
        maxXcor: maxXcor,
        minYcor: minYcor,
        maxYcor: maxYcor,
        numX: numX,
        numY: numY,
        pxWidth: pxWidth,
        pxHeight: pxHeight,
        isTorus: isTorus,
        hasNeighbors: hasNeighbors,
        isHeadless: isHeadless
      };
    };

    Model.prototype.setCtxTransform = function(ctx) {
      ctx.canvas.width = this.world.pxWidth;
      ctx.canvas.height = this.world.pxHeight;
      ctx.save();
      ctx.scale(this.world.size, -this.world.size);
      return ctx.translate(-this.world.minXcor, -this.world.maxYcor);
    };

    Model.prototype.globals = function(globalNames) {
      if (globalNames != null) {
        this.globalNames = globalNames;
        return this.globalNames.set = true;
      } else {
        return this.globalNames = u.removeItems(u.ownKeys(this), this.globalNames);
      }
    };

    Model.prototype.setFastPatches = function() {
      return this.patches.usePixels();
    };

    Model.prototype.setMonochromePatches = function() {
      return this.patches.monochrome = true;
    };

    Model.prototype.setCacheAgentsHere = function() {
      return this.patches.cacheAgentsHere();
    };

    Model.prototype.setCacheMyLinks = function() {
      return this.agents.cacheLinks();
    };

    Model.prototype.setCachePatchRect = function(radius, meToo) {
      if (meToo == null) {
        meToo = false;
      }
      return this.patches.cacheRect(radius, meToo);
    };

    Model.prototype.startup = function() {};

    Model.prototype.setup = function() {};

    Model.prototype.step = function() {};

    Model.prototype.start = function() {
      u.waitOn(((function(_this) {
        return function() {
          return _this.modelReady;
        };
      })(this)), ((function(_this) {
        return function() {
          return _this.anim.start();
        };
      })(this)));
      return this;
    };

    Model.prototype.stop = function() {
      return this.anim.stop();
    };

    Model.prototype.once = function() {
      if (!this.anim.stopped) {
        this.stop();
      }
      return this.anim.once();
    };

    Model.prototype.reset = function(restart) {
      var k, v, _ref;
      if (restart == null) {
        restart = false;
      }
      console.log("reset: anim");
      this.anim.reset();
      console.log("reset: contexts");
      _ref = this.contexts;
      for (k in _ref) {
        v = _ref[k];
        if (v.canvas != null) {
          v.restore();
          this.setCtxTransform(v);
        }
      }
      console.log("reset: patches");
      this.patches = new this.Patches(this, this.Patch, "patches");
      console.log("reset: agents");
      this.agents = new this.Agents(this, this.Agent, "agents");
      console.log("reset: links");
      this.links = new this.Links(this, this.Link, "links");
      Shapes.spriteSheets.length = 0;
      console.log("reset: setup");
      this.setupAndEmit();
      if (this.debugging) {
        this.setRootVars();
      }
      if (restart) {
        return this.start();
      }
    };

    Model.prototype.draw = function(force) {
      if (force == null) {
        force = this.anim.stopped;
      }
      if (force || this.refreshPatches || this.anim.draws === 1) {
        this.patches.draw(this.contexts.patches);
      }
      if (force || this.refreshLinks || this.anim.draws === 1) {
        this.links.draw(this.contexts.links);
      }
      if (force || this.refreshAgents || this.anim.draws === 1) {
        this.agents.draw(this.contexts.agents);
      }
      if (this.spotlightAgent != null) {
        this.drawSpotlight(this.spotlightAgent, this.contexts.spotlight);
      }
      return this.emit('draw');
    };

    Model.prototype.setupAndEmit = function() {
      this.setup();
      return this.emit('setup');
    };

    Model.prototype.stepAndEmit = function() {
      this.step();
      return this.emit('step');
    };

    Model.prototype.setSpotlight = function(spotlightAgent) {
      this.spotlightAgent = spotlightAgent;
      if (this.spotlightAgent == null) {
        return u.clearCtx(this.contexts.spotlight);
      }
    };

    Model.prototype.drawSpotlight = function(agent, ctx) {
      u.clearCtx(ctx);
      u.fillCtx(ctx, [0, 0, 0, 0.6]);
      ctx.beginPath();
      ctx.arc(agent.x, agent.y, 3, 0, 2 * Math.PI, false);
      return ctx.fill();
    };

    Model.prototype.createBreeds = function(s, agentClass, breedSet) {
      var b, breed, breeds, c, cname, _i, _len, _ref;
      breeds = [];
      breeds.classes = {};
      breeds.sets = {};
      _ref = s.split(" ");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        b = _ref[_i];
        cname = b.charAt(0).toUpperCase() + b.substr(1);
        c = u.cloneClass(agentClass, cname);
        breed = this[b] = new breedSet(this, c, b, agentClass.prototype.breed);
        breeds.push(breed);
        breeds.sets[b] = breed;
        breeds.classes["" + b + "Class"] = c;
      }
      return breeds;
    };

    Model.prototype.patchBreeds = function(s) {
      return this.patches.breeds = this.createBreeds(s, this.Patch, this.Patches);
    };

    Model.prototype.agentBreeds = function(s) {
      return this.agents.breeds = this.createBreeds(s, this.Agent, this.Agents);
    };

    Model.prototype.linkBreeds = function(s) {
      return this.links.breeds = this.createBreeds(s, this.Link, this.Links);
    };

    Model.prototype.asSet = function(a, setType) {
      if (setType == null) {
        setType = AgentSet;
      }
      return AgentSet.asSet(a, setType);
    };

    Model.prototype.debug = function(debugging) {
      this.debugging = debugging != null ? debugging : true;
      u.waitOn(((function(_this) {
        return function() {
          return _this.modelReady;
        };
      })(this)), ((function(_this) {
        return function() {
          return _this.setRootVars();
        };
      })(this)));
      return this;
    };

    Model.prototype.setRootVars = function() {
      window.psc = this.Patches;
      window.pc = this.Patch;
      window.ps = this.patches;
      window.p0 = this.patches[0];
      window.asc = this.Agents;
      window.ac = this.Agent;
      window.as = this.agents;
      window.a0 = this.agents[0];
      window.lsc = this.Links;
      window.lc = this.Link;
      window.ls = this.links;
      window.l0 = this.links[0];
      window.dr = this.drawing;
      window.u = Util;
      window.cx = this.contexts;
      window.an = this.anim;
      window.gl = this.globals();
      window.dv = this.div;
      return window.app = this;
    };

    return Model;

  })();

  this.ABM = {
    util: util,
    shapes: shapes,
    Util: Util,
    Color: Color,
    Shapes: Shapes,
    AgentSet: AgentSet,
    Patch: Patch,
    Patches: Patches,
    Agent: Agent,
    Agents: Agents,
    Link: Link,
    Links: Links,
    Animator: Animator,
    Evented: Evented,
    Model: Model
  };

  Animator = (function() {
    function Animator(model, rate, multiStep) {
      this.model = model;
      this.rate = rate != null ? rate : 30;
      this.multiStep = multiStep != null ? multiStep : model.world.isHeadless;
      this.animateDraws = __bind(this.animateDraws, this);
      this.animateSteps = __bind(this.animateSteps, this);
      this.isHeadless = model.world.isHeadless;
      this.reset();
    }

    Animator.prototype.setRate = function(rate, multiStep) {
      this.rate = rate;
      this.multiStep = multiStep != null ? multiStep : this.isHeadless;
      return this.resetTimes();
    };

    Animator.prototype.start = function() {
      if (!this.stopped) {
        return;
      }
      this.resetTimes();
      this.stopped = false;
      return this.animate();
    };

    Animator.prototype.stop = function() {
      this.stopped = true;
      if (this.animHandle != null) {
        cancelAnimationFrame(this.animHandle);
      }
      if (this.timeoutHandle != null) {
        clearTimeout(this.timeoutHandle);
      }
      if (this.intervalHandle != null) {
        clearInterval(this.intervalHandle);
      }
      return this.animHandle = this.timerHandle = this.intervalHandle = null;
    };

    Animator.prototype.resetTimes = function() {
      this.startMS = this.now();
      this.startTick = this.ticks;
      return this.startDraw = this.draws;
    };

    Animator.prototype.reset = function() {
      this.stop();
      return this.ticks = this.draws = 0;
    };

    Animator.prototype.step = function() {
      this.ticks++;
      return this.model.stepAndEmit();
    };

    Animator.prototype.draw = function() {
      this.draws++;
      return this.model.draw();
    };

    Animator.prototype.once = function() {
      this.step();
      return this.draw();
    };

    Animator.prototype.now = function() {
      return (typeof performance !== "undefined" && performance !== null ? performance : Date).now();
    };

    Animator.prototype.ms = function() {
      return this.now() - this.startMS;
    };

    Animator.prototype.ticksPerSec = function() {
      var elapsed;
      if ((elapsed = this.ticks - this.startTick) === 0) {
        return 0;
      } else {
        return Math.round(elapsed * 1000 / this.ms());
      }
    };

    Animator.prototype.drawsPerSec = function() {
      var elapsed;
      if ((elapsed = this.draws - this.startDraw) === 0) {
        return 0;
      } else {
        return Math.round(elapsed * 1000 / this.ms());
      }
    };

    Animator.prototype.toString = function() {
      return "ticks: " + this.ticks + ", draws: " + this.draws + ", rate: " + this.rate + " tps/dps: " + (this.ticksPerSec()) + "/" + (this.drawsPerSec());
    };

    Animator.prototype.animateSteps = function() {
      this.step();
      if (!this.stopped) {
        return this.timeoutHandle = setTimeout(this.animateSteps, 10);
      }
    };

    Animator.prototype.animateDraws = function() {
      if (this.isHeadless) {
        if (this.ticksPerSec() < this.rate) {
          this.step();
        }
      } else if (this.drawsPerSec() < this.rate) {
        if (!this.multiStep) {
          this.step();
        }
        this.draw();
      }
      if (!this.stopped) {
        return this.animHandle = requestAnimationFrame(this.animateDraws);
      }
    };

    Animator.prototype.animate = function() {
      if (this.multiStep) {
        this.animateSteps();
      }
      if (!(this.isHeadless && this.multiStep)) {
        return this.animateDraws();
      }
    };

    return Animator;

  })();

}).call(this);
