import { Direction, Stage, type GlobalState } from '@/types';
import { inject } from 'vue';

export const useActions = () => {
  const state = inject('state') as GlobalState;

  /**
   * Check if puzzle string is valid
   */
  const puzzleStringValidator = (str: string) => {
    if (str.length !== 9) {
      // Illegal puzzle string, length not equal to 9
      return false;
    } else {
      for (let i = 1; i < 10; i++) {
        if (str.indexOf(i.toString(10)) === -1) {
          // Illegal puzzle string, can't find all numbers from 1 to 9
          return false;
        }
      }
    }

    // Everything is OK
    return true;
  };

  /**
   * Check if the problem is solvable (Implemented by comparing number of inversions)
   */
  const isSolvable = () => {
    /** Simple inversions counting function */
    const inversionsCount = (str: string) => {
      let temp = str;

      // Remove the lucky dog
      temp = temp.replace(state.lucky.toString(10), '');

      let sum = 0;
      for (let i = 0; i < temp.length; i++) {
        const partialString = temp.slice(i + 1);
        for (const item of partialString) {
          if (Number.parseInt(item) < Number.parseInt(temp[i])) {
            sum++;
          }
        }
      }
      return sum;
    };

    if (inversionsCount(state.initial) % 2 === inversionsCount(state.target) % 2) {
      // Solvable
      return true;
    } else {
      // Not solvable
      return false;
    }
  };

  /**
   * Check if the problem is solvable
   */
  const analyzeSolvability = () => {
    if (isSolvable()) {
      state.stage = Stage.Solvable;
    } else {
      state.stage = Stage.NotSolvable;
    }
  };

  /**
   * Swap the lucky dog with another. This will update state.current immediately.
   *
   * @param direction - 0: Up, 1: Down, 2: Left, 3: Right
   */
  const move = (direction: Direction) => {
    /** Simple swap function for state.current */
    const swap = (a: number, b: number) => {
      const arr = state.current.split('');
      const temp = arr[a];
      arr[a] = arr[b];
      arr[b] = temp;
      state.current = arr.join('');
    };

    const luckyIndex = state.current.indexOf(state.lucky.toString(10));

    switch (direction) {
      case Direction.Up:
        if (luckyIndex > 2) swap(luckyIndex, luckyIndex - 3);
        break;
      case Direction.Down:
        if (luckyIndex < 6) swap(luckyIndex, luckyIndex + 3);
        break;
      case Direction.Left:
        if (luckyIndex % 3 > 0) swap(luckyIndex, luckyIndex - 1);
        break;
      case Direction.Right:
        if (luckyIndex % 3 < 2) swap(luckyIndex, luckyIndex + 1);
        break;
    }
  };

  /**
   * Randomly generate a puzzle string, but not guaranteed to have a solution.
   */
  const getRandomPuzzleString = () => {
    let str = '';
    const unused = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    while (unused.length > 1) {
      str = str + unused.splice(Math.floor(Math.random() * (unused.length + 1) - 1), 1)[0];
    }

    return str + unused[0];
  };

  /**
   * Apply the current puzzle string to the checkerboard.
   */
  const applyCurrentPuzzleString = () => {
    // Result schema ready
    const result = {
      x: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      y: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    } as {
      x: [null, number, number, number, number, number, number, number, number, number];
      y: [null, number, number, number, number, number, number, number, number, number];
    };

    // Calculate the coordinates of the corresponding checker based on the position where the number appears
    for (let i = 0; i < 9; i++) {
      result.x[Number.parseInt(state.current[i])] = i % 3;
      result.y[Number.parseInt(state.current[i])] = Math.floor(i / 3);
    }

    // Assign result to state
    Object.assign(state, result);
  };

  return {
    puzzleStringValidator,
    analyzeSolvability,
    move,
    getRandomPuzzleString,
    applyCurrentPuzzleString,
  };
};
