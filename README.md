# 8-Puzzle Problem

Solving the 8-Puzzle problem using the A\* algorithm (TypeScript impl.)

**NOTE: This repo is archived, and I will not update it anymore.**

## What's this?

This web application is one of my assignments for the "Artificial Intelligence" course at Chengdu University of Information Technology for the 2022-2023 academic year.

## How to build

```bash
# You need Node.js v16+ installed first

npm install
npm run build
```

Note: If you just want to preview this application, you can use `npm run dev` to launch a development server.

## Usage

1. Click "Lucky dog: Wait for selection"
2. Click the block you want to move
3. Click "Randomly initialize" until a solvable situation is encountered (if it is unsolvable, it will prompt "Not Solvable")
4. Click "Uninformed search (BFS)" or "A\* search" to start searching for solutions
5. Click "Click to play solution", the program starts to play the solution

- Both the initial state and the target state can be customized
- If you want manual control (using the arrow keys), click "Manual control". Clicking this button again will exit manual control and restore the block position to initial state
- If you want to set custom background for blocks, click on "Upload background"
