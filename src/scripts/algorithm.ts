import { Direction } from '@/types';

/** Simple swap function for string */
const swap = (str: string, a: number, b: number) => {
  const arr = str.split('');
  const temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
  return arr.join('');
};

/** Breadth-first search */
const bfs = (initial: string, target: string, lucky: string) => {
  // Get start time
  const startTime = new Date();

  const opened = new Array<string>();
  const closed = new Map<string, string>();
  const solution = new Array<string>();

  // Push the initial state into the opened queue
  opened.push(initial);

  // Continuously expand the opened node and store results in the closed map
  while (opened.length > 0) {
    const current = opened.shift() as string;

    // Push the current state into the closed map
    // The first time through the loop, the second parameter here is undefined, but it doesn't matter
    closed.set(current, closed.get(current) as string);

    // Check if current node is target node
    if (current === target) {
      solution.push(current);

      // Generate solution
      let previous = closed.get(current);
      while (previous) {
        solution.push(previous);
        previous = closed.get(previous);
      }

      break;
    }

    // Get index of the lucky dog
    const indexOfLucky = current.indexOf(lucky);

    // Generate all states that can reach in its next step
    for (let direction = 0; direction < 4; direction++) {
      let temp;

      if (direction === Direction.Up && indexOfLucky > 2) {
        temp = swap(current, indexOfLucky, indexOfLucky - 3);
      } else if (direction === Direction.Down && indexOfLucky < 6) {
        temp = swap(current, indexOfLucky, indexOfLucky + 3);
      } else if (direction === Direction.Left && indexOfLucky % 3 > 0) {
        temp = swap(current, indexOfLucky, indexOfLucky - 1);
      } else if (direction === Direction.Right && indexOfLucky % 3 < 2) {
        temp = swap(current, indexOfLucky, indexOfLucky + 1);
      }

      // Unreachable, skip
      if (!temp) continue;

      // Check if the result already exists in the closed map,
      // if not, push it into the opened queue
      if (!closed.has(temp)) {
        opened.push(temp);
        closed.set(temp, current);
      }
    }
  }

  return {
    solution,
    spaceConsumption: opened.length + closed.size,
    timeConsumption: (new Date().valueOf() - startTime.valueOf()) / 1000,
  };
};

const aStar = (initial: string, target: string, lucky: string) => {
  /** State Node */
  class State {
    /** Current state value */
    value: string;
    /** Previous state value */
    parent: string;
    /** g(n): The cost of the path from the start node to n */
    g: number;
    /** h(n): A heuristic function that estimates the cost of the cheapest path from n to the goal */
    h: number;

    /** f(n) = g(n) + h(n) */
    get f() {
      return this.g + this.h;
    }

    constructor(value: string, parent: string, g: number) {
      this.value = value;
      this.parent = parent;
      this.g = g;

      // h(n): The sum of the distances from the current position of all checkers to the target position
      // (Manhattan distance)
      let sum = 0;
      for (let currentIndex = 0; currentIndex < 9; currentIndex++) {
        let targetIndex = 0;

        // Before constructing, target must have been assigned a value
        while (value[currentIndex] !== target[targetIndex]) {
          targetIndex++;
        }

        // <index> % 3 is x-coordinate value
        // <index> / 3 is y-coordinate value
        sum +=
          Math.abs(Math.floor(currentIndex % 3) - Math.floor(targetIndex % 3)) +
          Math.abs(Math.floor(currentIndex / 3) - Math.floor(targetIndex / 3));
      }
      this.h = sum;
    }
  }

  // Get start time
  const startTime = new Date();

  const opened = new Array<State>();
  const closed = new Map<string, string>();
  const solution = new Array<string>();

  // Push the initial state into the opened queue
  opened.push(new State(initial, '', 0));

  // Continuously expand the best node
  while (opened.length > 0) {
    /** Get the best node */
    const getBestNode = () => {
      // Find smallest f(n)
      let minItemIndex = 0;
      for (let i = 0; i < opened.length; i++) {
        if (opened[i].f < opened[minItemIndex].f) {
          minItemIndex = i;
        }
      }

      // Returns the best node and removes it from the queue
      // Priority queue is partially implemented
      const temp = opened[minItemIndex];
      opened.splice(minItemIndex, 1);
      return temp;
    };

    const current = getBestNode();

    // Push the current state into the closed map
    // The first time through the loop, the second parameter here is undefined, but it doesn't matter
    closed.set(current.value, current.parent);

    // Check if current node is target node
    if (current.value === target) {
      solution.push(current.value);

      // Generate solution
      let previous = closed.get(current.value);
      while (previous) {
        solution.push(previous);
        previous = closed.get(previous);
      }

      break;
    }

    // Get index of the lucky dog
    const indexOfLucky = current.value.indexOf(lucky);

    // Generate all states that can reach in its next step
    for (let direction = 0; direction < 4; direction++) {
      let temp;

      if (direction === Direction.Up && indexOfLucky > 2) {
        temp = swap(current.value, indexOfLucky, indexOfLucky - 3);
      } else if (direction === Direction.Down && indexOfLucky < 6) {
        temp = swap(current.value, indexOfLucky, indexOfLucky + 3);
      } else if (direction === Direction.Left && indexOfLucky % 3 > 0) {
        temp = swap(current.value, indexOfLucky, indexOfLucky - 1);
      } else if (direction === Direction.Right && indexOfLucky % 3 < 2) {
        temp = swap(current.value, indexOfLucky, indexOfLucky + 1);
      }

      // Unreachable state, skip
      if (!temp) continue;

      // Check if the result already exists in the closed map,
      // if not, check if it is a better node
      if (!closed.has(temp)) {
        let notFoundInOpened = true;
        const tempState = new State(temp, current.value, current.g + 1);

        // Check if the result already exists in opened queue
        for (let i = 0; i < opened.length; i++) {
          if (opened[i].value === temp) {
            // Existed!
            notFoundInOpened = false;

            // Check if it is a better node
            if (tempState.f < opened[i].f) {
              // Yes, it is a better node! Update opened[i]
              opened[i] = tempState;
            }

            // It is not a better node, nothing to do
            break;
          }
        }

        // Not found in opened queue
        if (notFoundInOpened) {
          // Insert
          opened.push(tempState);
        }
      }
    }
  }

  return {
    solution,
    spaceConsumption: opened.length + closed.size,
    timeConsumption: (new Date().valueOf() - startTime.valueOf()) / 1000,
  };
};

onmessage = (e) => {
  if (e.data[0] === 'bfs') {
    postMessage(bfs(e.data[1], e.data[2], e.data[3]));
  } else {
    postMessage(aStar(e.data[1], e.data[2], e.data[3]));
  }
};
