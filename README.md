# Wordle Clone (Developer Edition)

A Wordle clone built as a **portfolio project**, focused on **React state modeling, keyboard-driven UX, and animation logic** rather than visuals alone.

The goal wasn’t to reinvent Wordle — it was to **rebuild it from scratch** to deeply understand:
- keyboard events
- animation timing
- state transitions
- edge cases
- React rendering behavior

Most of the gameplay follows the original Wordle rules, with a few implementation decisions optimized for learning and clarity.

---

##  Features

- Keyboard-only gameplay (no input fields)
- Tile-by-tile reveal animation
- Flip animation on reveal
- Active “checking” tile indicator
- Correct / close / incorrect tile states
- Random word loading from `words.txt`
- Game win / lose detection
- Restartable game loop
- No external animation libraries

---

##  Technical Highlights

- **React state-driven animations** (no DOM hacks)
- `setInterval` used safely for sequential reveals
- Keyboard handling via focusable container (`onKeyDown`)
- Proper handling of key repeat (`event.repeat`)
- No global event listeners
- Clean separation of:
  - game logic
  - animation timing
  - rendering
- Defensive word loading (handles empty lines)

---

##  Tech Stack

- **React (Functional Components)**
- **TypeScript**
- **Pure CSS** (no animation libraries)
- No Redux, no external state managers
- No UI frameworks

---

##  Word Source

Words are loaded from a simple text file:

```public/words.txt```

Each word must be on its own line:

You can replace this file with your own word list.

---

##  Installation and Run

### 1. Clone the repo
```bash
git clone https://github.com/kiboflaglet/wordle-game-react.git
cd wordle-clone
yarn install
yarn dev
```
4. Play

Type letters on your keyboard

Press Enter to submit

Press Backspace to delete

Guess the word within 6 tries

⚠️ Disclaimer

This is a learning and portfolio project inspired by Wordle.
All game mechanics are intentionally recreated for educational purposes.

📬 Feedback

Feel free to open an issue or fork the project.
Suggestions and improvements are welcome.
