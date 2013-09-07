/*!
 * Kurry-Fns.js
 * The MIT License (MIT)
 * 
 * Copyright (c) 2013 Liam Goodacre
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function(define) {

  define(['Kurry'], function (Kurry) {

    if (!Kurry || !Kurry.autopoly) {
      throw new Error('Kurry-Fns not initialized; could not find Kurry.js')
    }

    var Fns = {}
    var autopoly = Kurry.autopoly

    var pairs = function (obj) {
      return Object.keys(obj).map(function (key) {
        return [key, obj[key]]
      })
    }

    var fromPairs = function (pairs) {
      return pairs.reduce(function (acc, entry) {
        acc[entry[0]] = entry[1]
        return acc
      }, {})
    }

    var objLift = function (f, ma) {
      return fromPairs(pairs(ma).map(function (pair) {
        return f(pair[0], pair[1])
      }))
    }


    //: (a -> b) -> b -> a
    Fns.flip = autopoly(function (f, a, b) {
      return f(b, a)
    })

    //: (a -> b) -> a -> b
    Fns.runl = autopoly(function (f, v) {
      return f(v)
    })

    //: a -> (a -> b) -> b
    Fns.runr = Fns.flip(Fns.runl)

    //: (b -> c) -> (a -> b) -> a -> c
    Fns.comp = autopoly(function (g, f, v) {
      return g(f(v))
    })

    //: (b -> c) -> (a -> b) -> a -> c
    Fns.compr = Fns.flip(Fns.comp)

    //: [a -> b, b -> ... -> ?] -> a -> ?
    Fns.seq = autopoly(function (fs, v) {
      return fs.reduce(Fns.runr, v)
    })

    //: [? -> ... -> b, b -> a] -> ? -> a
    Fns.seqr = autopoly(function (fs, v) {
      return Fns.seq(fs.slice().reverse(), v)
    })

    //: (a -> Error | b) -> b -> a -> b
    Fns.try = autopoly(function (f, def, v) {
      try { return f(v) }
      catch (e) { return def }
    })

    //: Object (a -> ?) -> a -> Object ?
    Fns.template = autopoly(function (plan, v) {
      return objLift(function(k, f) {
        return [k, f(v)]
      }, plan)
    })

    return Fns
  })

})(typeof define == 'function' ? define : typeof exports == 'object' ? function(ds, f) {
  module.exports = f.apply(this, ds.map(require));
} : function(ds, f) {
  var self = this;
  self[f.name] = f.apply(self, ds.map(function(d) {
    return self[d];
  }));
});