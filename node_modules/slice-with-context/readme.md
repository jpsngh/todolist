# slice-with-context&emsp;[![](https://img.shields.io/npm/v/slice-with-context.svg?style=flat-square)](https://www.npmjs.com/package/slice-with-context) [![](https://img.shields.io/travis/anko/slice-with-context.svg?style=flat-square)](https://travis-ci.org/anko/slice-with-context) [![](https://img.shields.io/david/anko/slice-with-context?style=flat-square)](https://david-dm.org/anko/slice-with-context)

Basically `String.prototype.slice`, but with a configurably-positioned window
around it, showing context.

    npm i slice-with-context

The module exports 1 function:

## `sliceWithContext(inputString, windowSize, cutOffset, cutLength [, windowLeftBias] [, overflowLeftBias])`

Params:

 - `inputString`:`String`&emsp;string to cut
 - `windowSize`:`Number`&emsp;size of window
 - `cutOffset`:`Number`&emsp;cut start position, in characters
 - `cutLength`:`Number`&emsp;cut length, in characters
 - `windowLeftBias`:`Number` between 0–1 [*optional*]&emsp;if there is space
   left in the window on both sides of the sliced part, this option determines
   what proportion of what's left to show on the left rather than the right.

   0 means only show context on the left. 1 means only show context on the
   right. (default 0.5)

 - `overflowLeftBias`:`Number`between 0–1 [*optional*]&emsp;if the window is
   too small to show the sliced part fully, this option determines which part
   of the sliced part should be shown.

   0 means only show the very start of the slice. 1 means only show the very
   end of the slice.  Intermediate values mean to show that far along the
   middle of the slice.  (default 0)

Throws if the slice parameters would miss the string entirely, by being too
long, offset past it, or other such obviously wrong nonsense.

Clamps `windowLeftBias` and `overflowLeftBias` to 0–1.

<!-- !test program
  # Replace `require` with current directory, then run with node.
  node -e "
  const stdin = require('fs').readFileSync(0, 'utf-8')
  process.stdout.write(
    stdin.replace(
      /require\('slice-with-context'\)/g,
      'require(\'.\')'))
  " | node
-->

## Example

Suppose you want to slice the bold part out of 1234<b>5678</b>9, showing a
total of 6 characters; the sliced part and the rest just for context because
you have space to spare.

<!-- !test in example -->

```js
const sliceWithContext = require('slice-with-context')
const output = sliceWithContext(
  '1234567890',
  6,    // windowSize
  4,    // offset
  4,    // length
  0.5, // windowLeftBias
  0,    // overflowLeftBias
)
console.log(output)
```

<!-- !test out example -->

> ```
> {
>   fit: true,
>   withContext: '456789',
>   visibleSlice: '5678',
>   fullSlice: '5678',
>   position: { offset: 1, length: 4 }
> }
> ```

If you're writing a compiler or something, you might render that as—

    456789
     ^^^^

Or use ANSI colour codes, or some such.

## Specific situations

<details><summary>
Equal amounts of context on either side
</summary>

<!-- !test in basic -->

```js
const sliceWithContext = require('slice-with-context')
const output = sliceWithContext(
  '1234567890',
  6,   // windowSize
  4,   // offset
  4,   // length
  0.5, // windowLeftBias
  0,   // overflowLeftBias
)
console.log(output)
```

<!-- !test out basic -->

> ```
> {
>   fit: true,
>   withContext: '456789',
>   visibleSlice: '5678',
>   fullSlice: '5678',
>   position: { offset: 1, length: 4 }
> }
> ```
</details>



<details><summary>
With context only on the left
</summary>

<!-- !test in left context only -->

```js
const sliceWithContext = require('slice-with-context')
const output = sliceWithContext(
  '1234567890',
  6, // windowSize
  4, // offset
  4, // length
  1, // windowLeftBias
  0, // overflowLeftBias
)
console.log(output)
```

<!-- !test out left context only-->

> ```
> {
>   fit: true,
>   withContext: '345678',
>   visibleSlice: '5678',
>   fullSlice: '5678',
>   position: { offset: 2, length: 4 }
> }
> ```
</details>



<details><summary>
With context only on the right
</summary>

<!-- !test in right context only -->

```js
const sliceWithContext = require('slice-with-context')
const output = sliceWithContext(
  '1234567890',
  6, // windowSize
  4, // offset
  4, // length
  0, // windowLeftBias
  0, // overflowLeftBias
)
console.log(output)
```

<!-- !test out right context only-->

> ```
> {
>   fit: true,
>   withContext: '567890',
>   visibleSlice: '5678',
>   fullSlice: '5678',
>   position: { offset: 0, length: 4 }
> }
> ```
</details>



<details><summary>
Left context only, but with no space
</summary>

<!-- !test in left context with no space -->

```js
const sliceWithContext = require('slice-with-context')
const output = sliceWithContext(
  '1234567890',
  6, // windowSize
  0, // offset
  4, // length
  1, // windowLeftBias
  0, // overflowLeftBias
)
console.log(output)
```

<!-- !test out left context with no space -->

> ```
> {
>   fit: true,
>   withContext: '123456',
>   visibleSlice: '1234',
>   fullSlice: '1234',
>   position: { offset: 0, length: 4 }
> }
> ```
</details>



<details><summary>
Both-sided context, but no space at end
</summary>

<!-- !test in both sides context but at end -->

```js
const sliceWithContext = require('slice-with-context')
const output = sliceWithContext(
  '1234567890',
  6, // windowSize
  6, // offset
  4, // length
  0.5, // windowLeftBias
  0, // overflowLeftBias
)
console.log(output)
```

<!-- !test out both sides context but at end -->

> ```
> {
>   fit: true,
>   withContext: '567890',
>   visibleSlice: '7890',
>   fullSlice: '7890',
>   position: { offset: 2, length: 4 }
> }
> ```
</details>



<details><summary>
Insufficient space in window, truncated to show start
</summary>

<!-- !test in truncate to left -->

```js
const sliceWithContext = require('slice-with-context')
const output = sliceWithContext(
  '1234567890',
  6, // windowSize
  0, // offset
  8, // length
  1, // windowLeftBias
  1, // overflowLeftBias
)
console.log(output)
```

<!-- !test out truncate to left -->

> ```
> {
>   fit: false,
>   withContext: '123456',
>   visibleSlice: '123456',
>   fullSlice: '12345678',
>   position: { offset: 0, length: 6 }
> }
> ```
</details>



<details><summary>
Insufficient space in window, truncated to show end
</summary>

<!-- !test in truncate to right -->

```js
const sliceWithContext = require('slice-with-context')
const output = sliceWithContext(
  '1234567890',
  6, // windowSize
  0, // offset
  8, // length
  1, // windowLeftBias
  0, // overflowLeftBias
)
console.log(output)
```

<!-- !test out truncate to right -->

> ```
> {
>   fit: false,
>   withContext: '345678',
>   visibleSlice: '345678',
>   fullSlice: '12345678',
>   position: { offset: 0, length: 6 }
> }
> ```
</details>

## Tests

That's the code examples above!  They're run with
[txm](https://github.com/anko/txm).
