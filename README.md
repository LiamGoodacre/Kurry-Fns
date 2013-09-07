# Kurry-Fns

A small collection of functions for dealing with JavaScript functions


# Documentation (work in progress)

This library explicitly depends on [Kurry.js](https://github.com/LiamGoodacre/Kurry).

All functions are wrapped with `Kurry.autopoly`.
The following is an example of what this means:

```js
var _f = function (a, b, c) { return a+b+c }
var f = Kurry.autopoly(_f)

_f(2, 3, 4) //= 9
f(2, 3, 4) //= 9
f(2, 3)(4) //= 9
f(2)(3)(4) //= 9
f(2)(3, 4) //= 9

_f(2, 3)(4) //# Error, number is not a function
```


## Fns.flip : (a &rarr; b) &rarr; b &rarr; a

Given a function, flip the first two arguments round.

```js
var div = function (a, b) { return a / b }
var divr = Fns.flip(div)
[div(3, 4), divr(3, 4), divr(4, 3)]
//= [0.75, 1.3(3), 0.75]
```


## Fns.runl : (a &rarr; b) &rarr; a &rarr; b

The function application function.  Given a function and
a value, apply the function to the value.

```js
var f = function (a) { return a * 10 }

f(4) //= 40
Fns.runl(f, 4) //= 40
Fns.runl(f)(4) //= 40
```


## Fns.runr : a &rarr; (a &rarr; b) &rarr; b

Flipped version of runl.  Given a value and a function,
apply the function to the value.

```js
var f = function (a) { return a * 2 }

f(8) //= 16
Fns.runr(8, f) //= 16
Fns.runr(8)(f) //= 16

var apply8 = Fns.runr(8)
apply8(f) //= 16
```


## Fns.comp : (b &rarr; c) &rarr; (a &rarr; b) &rarr; a &rarr; c

Function composition.  `comp(g, f)(x) = g(f(x))`.

```js
var g = function (a) { return a * 1000 }
var f = function (a) { return a + 20 }
var h = Fns.comp(g, f)
var i = Fns.comp(f, g)

h(6)
//= g(f(6))
//= g(6+20)
//= 26*1000
//= 26000

i(6)
//= f(g(6))
//= f(6*1000)
//= 6000+20
//= 6020
```


## Fns.compr : (b &rarr; c) &rarr; (a &rarr; b) &rarr; a &rarr; c

Flipped version of comp.

```js
compr(f, g) = comp(g, f)
```


## Fns.seq : [a &rarr; b, b &rarr; &hellip; &rarr; ?] &rarr; a &rarr; ?

Given a list of functions and a value.  Apply each function from
left to right to the output of the previous application, starting
with the input value.

```js
var g = function (a) { return a * 1000 }
var f = function (a) { return a + 20 }
var h = Fns.seq([f, g])
var i = Fns.seq([g, f])

h(6)
//= g(f(6))
//= g(6+20)
//= 26*1000
//= 26000

i(6)
//= f(g(6))
//= f(6*1000)
//= 6000+20
//= 6020
```


## Fns.seqr : [? &rarr; &hellip; &rarr; b, b &rarr; a] &rarr; ? &rarr; a

Same as seq, except the functions are applied right to left.

```js
seq([a, b, c]) = seqr([c, b, a])
```


## Fns.try : (a &rarr; Error | b) &rarr; b &rarr; a &rarr; b

Given a function, a default value, and an input, try to apply the function
to the input.  If it throws an exception, return the default value instead.

```js
var div10By = function (b) {
  if (b === 0) { throw new Error('Division by zero!') }
  return 10 / b
}

Fns.try(div10By, 42, 2)
//= 10 / 2
//= 5

Fns.try(div10By, 42, 0)
//= 42, default value
```


## Fns.template : Object (a &rarr; ?) &rarr; a &rarr; Object ?

Given an object from keys to functions, and an input value: produce an
object from keys to the results of applying the functions to the input.

```js
var get = Kurry.autopoly(function (k, v) { return v[k] })
var templ = Fns.template({
  len: get('length'),
  name: get('name')
})

templ(function ADD(a, b) { return a + b })
//= { len: 2, name: 'ADD' }
```


