# Number Puzzle

Sliding number puzzle served at `/number-puzzle/`.

## Contract

- Keep the 4x4 game, Undo, saved state, sound, 12 locales, and four related-game links working.
- While the invalid-traffic restriction is active, do not load ad scripts, rewarded/interstitial paths, fabricated ratings, hidden FAQ, or synthetic engagement events.
- Emit each private funnel event at most once: `number_puzzle_view`, `number_puzzle_start`, `number_puzzle_progress`, `number_puzzle_complete`, `number_puzzle_share`, `number_puzzle_related_click`.
- `number_puzzle_start` requires a board-changing move; page load is not a game start.
- Validate from the workspace root with `npm run verify:number-puzzle-suspension`.
