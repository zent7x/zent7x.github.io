import { Chess } from "./vendor/chess.mjs";

// Original teaching positions, each with exactly one legal mate in one.
export const PUZZLES = Object.freeze([
  Object.freeze({
    fen: "6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
    solution: Object.freeze({ from: "e1", to: "e8", san: "Re8#" }),
    hint: "The king is boxed in by its own pawns. Take the rook up the open file.",
  }),
  Object.freeze({
    fen: "6rk/6pp/8/6N1/8/8/8/6K1 w - - 0 1",
    solution: Object.freeze({ from: "g5", to: "f7", san: "Nf7#" }),
    hint: "The king has no empty square beside it. A knight’s check cannot be blocked.",
  }),
  Object.freeze({
    fen: "7k/R7/5N2/8/8/8/8/6K1 w - - 0 1",
    solution: Object.freeze({ from: "a7", to: "h7", san: "Rh7#" }),
    hint: "The knight already guards g8 and h7. Bring the rook across to finish the job.",
  }),
]);

const PIECE_NAMES = { k: "king", q: "queen", r: "rook", b: "bishop", n: "knight", p: "pawn" };
const FILES = "abcdefgh";
export const SQUARES = Object.freeze(
  Array.from({ length: 64 }, (_, index) => `${FILES[index % 8]}${8 - Math.floor(index / 8)}`),
);

// Separate puzzle state from its UI so actual legal moves can be tested directly.
export class PuzzleSession {
  constructor(index = 0) {
    this.index = ((index % PUZZLES.length) + PUZZLES.length) % PUZZLES.length;
    this.reset();
  }

  get puzzle() { return PUZZLES[this.index]; }

  reset() {
    this.game = new Chess(this.puzzle.fen);
    this.selected = null;
    this.solved = false;
    this.lastMove = null;
    return { kind: "ready", message: "White to move. Find checkmate in one move." };
  }

  next() {
    this.index = (this.index + 1) % PUZZLES.length;
    return this.reset();
  }

  destinations() {
    if (!this.selected || this.solved) return [];
    return this.game.moves({ square: this.selected, verbose: true }).map((move) => move.to);
  }

  choose(square) {
    if (this.solved) return { kind: "solved", message: "Solved. Choose Next puzzle to keep going." };
    const piece = this.game.get(square);
    if (square === this.selected) {
      this.selected = null;
      return { kind: "ready", message: "Selection cleared. Choose a white piece." };
    }
    if (piece?.color === "w") {
      this.selected = square;
      return { kind: "selected", message: `White ${PIECE_NAMES[piece.type]} on ${square} selected. Choose its destination.` };
    }
    if (!this.selected) return { kind: "select", message: "Choose a white piece first." };
    return this.move(this.selected, square);
  }

  move(from, to) {
    if (this.solved) return { kind: "solved", message: "Solved. Choose Next puzzle to keep going." };
    let move;
    try { move = this.game.move({ from, to }); } catch {
      return { kind: "illegal", message: `That move to ${to} is not legal. Choose another square.` };
    }
    if (this.game.isCheckmate()) {
      this.solved = true;
      this.selected = null;
      this.lastMove = { from, to };
      return { kind: "mate", san: move.san, message: `${move.san} — checkmate. Nicely found.` };
    }
    this.game.undo();
    return { kind: "try-again", san: move.san, message: `${move.san} is legal, but not checkmate. The position is reset; try another move.` };
  }

  hint() {
    if (this.solved) return { kind: "solved", message: "You already found it. Choose Next puzzle for another position." };
    this.selected = this.puzzle.solution.from;
    return { kind: "hint", message: this.puzzle.hint };
  }
}

// Clamp at board edges; arrows follow the visual board, white at the bottom.
export function adjacentSquare(square, key) {
  const index = SQUARES.indexOf(square);
  if (index < 0) return SQUARES[0];
  const row = Math.floor(index / 8);
  const column = index % 8;
  if (key === "ArrowUp") return SQUARES[Math.max(0, row - 1) * 8 + column];
  if (key === "ArrowDown") return SQUARES[Math.min(7, row + 1) * 8 + column];
  if (key === "ArrowLeft") return SQUARES[row * 8 + Math.max(0, column - 1)];
  if (key === "ArrowRight") return SQUARES[row * 8 + Math.min(7, column + 1)];
  if (key === "Home") return SQUARES[row * 8];
  if (key === "End") return SQUARES[row * 8 + 7];
  return square;
}

// Small, original vector drawings keep piece shapes consistent across platforms.
const PIECES = {
  k: '<path d="M20 4v8m-4-4h8" fill="none"/><path d="M12 29 10 17q-1-5 4-5 4 0 6 4 2-4 6-4 5 0 4 5l-2 12Z"/><path d="M11 29h18l2 6H9Z"/><path d="M12 25h16" fill="none"/>',
  r: '<path d="M10 6h5v6h3V6h4v6h3V6h5v12l-4 3v8H14v-8l-4-3Z"/><path d="M12 29h16l3 6H9Z"/><path d="M14 19h12" fill="none"/>',
  n: '<path d="M12 29c0-7 8-9 10-14l-7 5-7-3 7-9 4-1 1-4 5 4c7 3 6 13 3 22Z"/><path d="M11 29h18l2 6H9Z"/><circle cx="19" cy="11" r="1.1" class="chess-piece-eye" stroke="none"/>',
  p: '<circle cx="20" cy="10" r="5"/><path d="M16 16h8l-2 5 2 8h-8l2-8Z"/><path d="M13 29h14l4 6H9Z"/>',
};

function pieceMarkup(piece) {
  if (!piece) return "";
  const shape = PIECES[piece.type];
  if (!shape) return `<span aria-hidden="true">${piece.type.toUpperCase()}</span>`;
  return `<svg class="chess-piece chess-piece--${piece.color}" viewBox="0 0 40 40" aria-hidden="true" focusable="false">${shape}</svg>`;
}

export function mountChess(host) {
  if (!host || host.dataset.chessReady) return;
  host.dataset.chessReady = "true";
  host.classList.add("chess-puzzle");
  const session = new PuzzleSession();
  let focusSquare = "a8";
  let announcement;
  host.innerHTML = `
    <div class="chess-layout">
      <div class="chess-position">
        <div class="chess-ranks" aria-hidden="true">${[8, 7, 6, 5, 4, 3, 2, 1].map((rank) => `<span>${rank}</span>`).join("")}</div>
        <div class="chess-board" role="grid" aria-label="Chess board, White to move" aria-describedby="chess-instructions"></div>
        <div class="chess-files" aria-hidden="true">${[...FILES].map((file) => `<span>${file}</span>`).join("")}</div>
      </div>
      <div class="chess-side">
        <p class="chess-count"></p>
        <p class="chess-status" role="status" aria-live="polite" aria-atomic="true">White to move. Find checkmate in one move.</p>
        <p class="chess-instructions" id="chess-instructions">Select a piece, then its destination. Use arrow keys to explore the board, and Enter or Space to select. Escape clears a selection.</p>
        <div class="chess-controls">
          <button type="button" data-chess-action="hint">Hint</button>
          <button type="button" data-chess-action="retry">Retry</button>
          <button type="button" data-chess-action="next">Next puzzle <span aria-hidden="true">→</span></button>
        </div>
      </div>
    </div>`;

  const board = host.querySelector(".chess-board");
  const count = host.querySelector(".chess-count");
  const status = host.querySelector(".chess-status");
  const buttons = new Map();
  for (let rank = 8; rank >= 1; rank -= 1) {
    const row = document.createElement("div");
    row.className = "chess-row";
    row.setAttribute("role", "row");
    for (let file = 0; file < 8; file += 1) {
      const square = `${FILES[file]}${rank}`;
      const cell = document.createElement("div");
      cell.className = "chess-cell";
      cell.setAttribute("role", "gridcell");
      const button = document.createElement("button");
      button.type = "button";
      button.className = `chess-square ${(file + rank) % 2 === 0 ? "chess-square--light" : "chess-square--dark"}`;
      button.dataset.square = square;
      button.addEventListener("focus", () => setBoardFocus(square));
      button.addEventListener("click", () => {
        setBoardFocus(square);
        update(session.choose(square));
      });
      button.addEventListener("keydown", (event) => {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          const next = adjacentSquare(square, event.key);
          setBoardFocus(next);
          buttons.get(next).focus({ preventScroll: true });
        } else if (event.key === "Escape" && session.selected) {
          event.preventDefault();
          session.selected = null;
          update({ message: "Selection cleared. Choose a white piece." });
        }
      });
      buttons.set(square, button);
      cell.appendChild(button);
      row.appendChild(cell);
    }
    board.appendChild(row);
  }

  function setBoardFocus(square) {
    focusSquare = square;
    buttons.forEach((button, coordinate) => { button.tabIndex = coordinate === square ? 0 : -1; });
  }

  function render() {
    const destinations = new Set(session.destinations());
    count.textContent = `Puzzle ${session.index + 1} of ${PUZZLES.length}`;
    board.setAttribute("aria-label", session.solved ? "Chess board, checkmate" : "Chess board, White to move");
    buttons.forEach((button, square) => {
      const piece = session.game.get(square);
      const selected = session.selected === square;
      const destination = destinations.has(square);
      const pieceName = piece ? `${piece.color === "w" ? "white" : "black"} ${PIECE_NAMES[piece.type]}` : "empty";
      button.setAttribute("aria-label", `${square}, ${pieceName}${destination ? ", legal destination" : ""}`);
      button.setAttribute("aria-pressed", String(selected));
      button.classList.toggle("is-selected", selected);
      button.classList.toggle("is-destination", destination);
      button.classList.toggle("is-last-move", session.lastMove?.to === square);
      button.innerHTML = pieceMarkup(piece);
    });
    setBoardFocus(focusSquare);
  }

  function update(result) {
    render();
    clearTimeout(announcement);
    status.textContent = "";
    announcement = setTimeout(() => { status.textContent = result.message; }, 20);
  }

  host.querySelector('[data-chess-action="hint"]').addEventListener("click", () => {
    const result = session.hint();
    if (session.selected) focusSquare = session.selected;
    update(result);
  });
  host.querySelector('[data-chess-action="retry"]').addEventListener("click", () => {
    const result = session.reset();
    focusSquare = "a8";
    update(result);
  });
  host.querySelector('[data-chess-action="next"]').addEventListener("click", () => {
    const result = session.next();
    focusSquare = "a8";
    update({ ...result, message: `Puzzle ${session.index + 1} of ${PUZZLES.length}. ${result.message}` });
  });
  render();
}

if (typeof document !== "undefined") mountChess(document.getElementById("chess-puzzle"));
