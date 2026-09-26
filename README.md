# Chessy's Adventure for Shritha

Public preview: https://veerahou-rgb.github.io/shritha-chess-coach/

A child-friendly chess coaching prototype. Open the preview in a browser. Progress is stored on that device in browser storage.

## Playable today

- New-child welcome, World 0 square finding, Rocky rook tracks with a blocker, Klip-Klop knight jumps, Penny's defended pawn, and Foxy's knight fork.
- Legal chess in Chess Playground, a basic Timmy Turtle bot, and a rules-off Toy Box.
- Pause and resume a saved game, lesson progress, cumulative stars, Help, Again, Rewind, and short understanding checks.
- My Kingdom, My Chess Powers, Coach Review replay of a recent White position, parent hold gate, Play Together, and basic audio repeat.

## Verification performed

- Public URL opened; onboarding and World 0 completed.
- Rocky blocked square rejected; rook and knight paths completed; Penny and Foxy completed.
- Tap and drag rook interaction; cumulative stars and partial rook progress survived refresh.
- Legal e2-e4 and Timmy reply; saved Timmy game resumed after refresh and rewound.
- Playground Fool's Mate ended as checkmate; Toy Box moved a piece with rules off.
- Core lesson checks: `node test-core.cjs` (rook blocker, incorrect/correct understanding check, stars unchanged, rescue cue).
- The latest changes to understanding checks and telemetry passed syntax and core checks, but have not been rechecked in the public browser after the browser session stalled.

## Current limits

This is not the complete frozen product or a master-level curriculum. World 2 and World 3 currently have one activity each. Timmy chooses random legal moves, not a pedagogical strategy. Review replays a recent position without explaining a specific blunder or choosing a stronger move. There is no varied-position mastery or spaced-retention engine, guided multi-move replay, What If exploration, PIN-backed parent gate, lesson narration throughout, cross-device sync, or polished full-session adaptation. The external chess.js script requires network access. The parent hold gate and mobile layout need fresh live verification.

## Development

The site is a single static `index.html` hosted with GitHub Pages from `main`. No build step is needed. Open it in a browser, or run `node test-core.cjs` for the core rule checks.
