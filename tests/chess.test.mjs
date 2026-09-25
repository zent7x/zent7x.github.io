import test from "node:test";
import assert from "node:assert/strict";
import { Chess } from "../public/vendor/chess.mjs";
import { PUZZLES, PuzzleSession, SQUARES, adjacentSquare } from "../public/chess.js";

test("every position is live, legal, and has exactly its stated mate in one", () => {
  for (const puzzle of PUZZLES) {
    const game = new Chess(puzzle.fen);
    assert.equal(game.turn(), "w");
    assert.equal(game.isGameOver(), false);
    assert.equal(game.isCheck(), false);
    const blackToMove = new Chess(puzzle.fen.replace(" w ", " b "));
    assert.equal(blackToMove.isCheck(), false, "Black must not already be in check");
    const mates = [];
    for (const move of game.moves({ verbose: true })) {
      game.move(move);
      if (game.isCheckmate()) mates.push({ from: move.from, to: move.to, san: move.san });
      game.undo();
    }
    assert.deepEqual(mates, [puzzle.solution]);
  }
});

test("source/destination selection solves all three puzzles and locks the position", () => {
  for (let index = 0; index < PUZZLES.length; index += 1) {
    const session = new PuzzleSession(index);
    const { from, to, san } = session.puzzle.solution;
    assert.equal(session.choose(from).kind, "selected");
    assert.ok(session.destinations().includes(to));
    assert.equal(session.choose(to).san, san);
    assert.equal(session.solved, true);
    assert.equal(session.game.isCheckmate(), true);
    const solvedPosition = session.game.fen();
    assert.equal(session.choose("g1").kind, "solved");
    assert.equal(session.game.fen(), solvedPosition);
  }
});

test("legal non-mating attempts reset the position and allow another attempt", () => {
  const session = new PuzzleSession();
  session.choose("e1");
  const before = session.game.fen();
  assert.equal(session.choose("e2").kind, "try-again");
  assert.equal(session.game.fen(), before);
  assert.equal(session.selected, "e1");
  assert.equal(session.solved, false);
  assert.equal(session.choose("e8").kind, "mate");
});

test("illegal moves and selecting black or empty squares never change the position", () => {
  const session = new PuzzleSession();
  const before = session.game.fen();
  assert.equal(session.choose("g8").kind, "select");
  assert.equal(session.choose("e4").kind, "select");
  session.choose("e1");
  assert.equal(session.choose("f3").kind, "illegal");
  assert.equal(session.game.fen(), before);
  assert.equal(session.selected, "e1");
  assert.equal(session.move("g8", "h8").kind, "illegal");
  assert.equal(session.game.fen(), before);
});

test("switching pieces, deselecting, hint, retry, and rotation keep state consistent", () => {
  const session = new PuzzleSession();
  session.choose("e1");
  session.choose("f2");
  assert.equal(session.selected, "f2");
  assert.equal(session.choose("f2").kind, "ready");
  assert.equal(session.selected, null);
  const before = session.game.fen();
  assert.equal(session.hint().kind, "hint");
  assert.equal(session.selected, "e1");
  assert.equal(session.game.fen(), before);
  session.choose("e8");
  session.reset();
  assert.equal(session.game.fen(), before);
  assert.equal(session.solved, false);
  assert.equal(session.selected, null);
  assert.equal(session.lastMove, null);
  for (let index = 1; index <= PUZZLES.length; index += 1) {
    session.next();
    assert.equal(session.index, index % PUZZLES.length);
    assert.equal(session.game.fen(), PUZZLES[index % PUZZLES.length].fen);
  }
});

test("keyboard navigation follows visual rows and never wraps across board edges", () => {
  assert.equal(SQUARES.length, 64);
  assert.equal(new Set(SQUARES).size, 64);
  assert.equal(adjacentSquare("a8", "ArrowLeft"), "a8");
  assert.equal(adjacentSquare("a8", "ArrowUp"), "a8");
  assert.equal(adjacentSquare("h1", "ArrowRight"), "h1");
  assert.equal(adjacentSquare("h1", "ArrowDown"), "h1");
  assert.equal(adjacentSquare("e1", "ArrowUp"), "e2");
  assert.equal(adjacentSquare("e8", "ArrowDown"), "e7");
  assert.equal(adjacentSquare("e4", "Home"), "a4");
  assert.equal(adjacentSquare("e4", "End"), "h4");
});
