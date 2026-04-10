---
title: Bidirectional Linear Search
description: A slightly different approach to linear search
date: 2025-12-25
tags:
  - data-structures
  - theory
  - tutorial
---

## Bidirectional linear search
I am revisiting the fundamentals of data structure and algorithm these days and trying a different approach to them. While at it, I had a thought after reading about two pointers and linear search.

>How about we search from both the ends linearly in a parallel manner? 

Running both the pointer simultaneously and maintaining variables to track and share the status if element is found, and on which index. Of course, there can be more than two pointers to speed-up the search theoretically but let's iterate progressively starting with bidirectional.
*We can do binary search in this manner too but that's for another day.*

Here's a small implementation of the parallel two-pointer a.k.a. bidirectional linear search:

```ts
import { Worker } from "worker_threads";
import path from "path";

export function parallelLinearSearch(
  arr: number[],
  target: number
): Promise<number> {
  const start = performance.now();

  return new Promise((resolve) => {
    const mid = Math.floor(arr.length / 2);

    // Worker 1: search from beginning
    const w1 = new Worker(path.join(__dirname, "searchWorker.ts"), {
      workerData: { arr: arr.slice(0, mid), target, offset: 0 },
      execArgv: ["-r", "ts-node/register"],
    });

    // Worker 2: search from middle to end
    const w2 = new Worker(path.join(__dirname, "searchWorker.ts"), {
      workerData: { arr: arr.slice(mid), target, offset: mid },
      execArgv: ["-r", "ts-node/register"],
    });

    let result1: number | null = null;
    let result2: number | null = null;

    const checkComplete = () => {
      if (result1 === null || result2 === null) return;

      w1.terminate();
      w2.terminate();
      const duration = Date.now() - start;

      const finalResult = result1 !== -1 ? result1 : result2;
      const worker = result1 !== -1 ? "w1" : result2 !== -1 ? "w2" : "none";

      console.log(
        `Worker: ${worker} | Found: ${
          finalResult !== -1
        } | Index: ${finalResult} | Duration: ${duration}ms`
      );
      resolve(finalResult);
    };

    w1.on("message", (index) => {
      result1 = index;
      if (index !== -1) {
        // Found it! Terminate immediately
        w2.terminate();
        const duration = Date.now() - start;
        console.log(
          `Worker: w1 | Found: true | Index: ${index} | Duration: ${duration}ms`
        );
        resolve(index);
      } else {
        checkComplete();
      }
    });

    w2.on("message", (index) => {
      result2 = index;
      if (index !== -1) {
        // Found it! Terminate immediately
        w1.terminate();
        const duration = Date.now() - start;
        console.log(
          `Worker: w2 | Found: true | Index: ${index} | Duration: ${duration}ms`
        );
        resolve(index);
      } else {
        checkComplete();
      }
    });
  });
}

```

## Code breakdown
```ts
export function parallelLinearSearch(
  arr: number[],
  target: number
): Promise<number> {}
```
Function details:
- `arr`: incoming array. For our experiment, we're assuming the array will contain numbers.
- The `target` to find.
- Return will be a promise which will be either resolved with the output message.
- We're exporting so that we can execute this in our main program.
```ts
  const start = performance.now();
```
This will start the time metric to measure performance.
```ts
return new Promise((resolve) => {
    const mid = Math.floor(arr.length / 2);
```
- We're starting the Promise block now
- Calculate the middle of the array and store it.
```ts
    // Worker 1: search from beginning
    const w1 = new Worker(path.join(__dirname, "searchWorker.ts"), {
      workerData: { arr: arr.slice(0, mid), target, offset: 0 },
      execArgv: ["-r", "ts-node/register"],
    });

    // Worker 2: search from middle to end
    const w2 = new Worker(path.join(__dirname, "searchWorker.ts"), {
      workerData: { arr: arr.slice(mid), target, offset: mid },
      execArgv: ["-r", "ts-node/register"],
    });
```
Initialise two workers threads on the array.
- `w1` will copy the first half of the array and operate on it. 
- `w2` will copy the second half of the array and operate on it.
- Array is copied using [`.slice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) method.
- `execArgv`: argument used to execute the typescript file in-memory.


```ts
import { parentPort, workerData } from "worker_threads";

const { arr, target } = workerData;

for (let i = 0; i < arr.length; i++) {
  if (arr[i] === target) {
    parentPort?.postMessage(i);
    process.exit(0);
  }
}

parentPort?.postMessage(-1);

```

`searchWorker.ts`: helper function to find the element.
`parentPort`: allowing communication with the parent thread

```ts
const checkComplete = () => {
  if (result1 === null || result2 === null) return;

  w1.terminate();
  w2.terminate();
  const duration = Date.now() - start;

  const finalResult = result1 !== -1 ? result1 : result2;
  const worker = result1 !== -1 ? "w1" : result2 !== -1 ? "w2" : "none";

  console.log(
    `Worker: ${worker} | Found: ${
      finalResult !== -1
    } | Index: ${finalResult} | Duration: ${duration}ms`
  );
  resolve(finalResult);
};

```
`checkComplete()` waits until both worker results are non-null, then terminates both workers, logs which if target is found, and resolves with the final index *(or -1 if absent)*.

```ts
w1.on("message", (index) => {
  result1 = index;
  if (index !== -1) {
    // Found it! Terminate immediately
    w2.terminate();
    const duration = Date.now() - start;
    console.log(
      `Worker: w1 | Found: true | Index: ${index} | Duration: ${duration}ms`
    );
    resolve(index);
  } else {
    checkComplete();
  }
});

w2.on("message", (index) => {
  result2 = index;
  if (index !== -1) {
    // Found it! Terminate immediately
    w1.terminate();
    const duration = Date.now() - start;
    console.log(
      `Worker: w2 | Found: true | Index: ${index} | Duration: ${duration}ms`
    );
    resolve(index);
  } else {
    checkComplete();
  }
});

```
Both workers listen to the message being sent by the helper function (utilising `parentPort`). 
If the index is found, the promise is resolved and the other worker is terminated. Otherwise, the program execution is passed on to `checkComplete()` and the remaining calculation is done there.

## Performance Analysis (Theoretical by Gemini)
### Comparison for `n = 1,000,000`
When compared to other existing methods, we have:
- Linear search: ~1,000,000 comparisons  
- Binary search: ~20 comparisons  
- Hash table: 1 lookup

This is not a practical solution because better alternatives exist:

| Problem               | Better Solution        | Why                         |
|-----------------------|------------------------|-----------------------------|
| Unsorted, small array | Sequential `O(n)`      | No overhead                 |
| Unsorted, large array | Hash table `O(1)`      | Constant-time lookup        |
| Sorted array          | Binary search `O(log n)` | Exponentially faster        |
| Repeated searches     | Build index once       | One-time `O(n)` setup       |

Parallel linear search still performs approx. 500,000 comparisons *(split across two threads)*.  
This remains far slower than binary search’s ~20 comparisons. But we can have other ways to optimise for random, unsorted arrays with some average complexity.

We'll explore it in the upcoming blogs.