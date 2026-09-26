# Chessy's Adventure for Shritha

Public preview: https://veerahou-rgb.github.io/shritha-chess-coach/

A child-friendly chess coach prototype. Open the preview in a browser. Progress stays on that device in browser local storage; no account is needed.

## Playable now

- New-child welcome and board-coordinate activity with edge labels.
- Rocky's rook star route with a blocker and Klip-Klop's knight jumps, each followed by a quiet understanding question.
- Bishop, queen, king, and pawn movement adventures with legal-move feedback, Help, Again, Rewind, stars, and saved progress.
- World 2 legal capture, escape from check, and pawn promotion puzzles, Penny's defended pawn, and a stalemate check.
- Foxy's knight fork and a real rules-engine checkmate finishing lesson with consequence, retry, and saved position.
- Timmy Turtle legal game, two-sided Chess Playground, and rules-off Toy Box.
- Nearby Adventure Map, Puzzle Adventure, My Kingdom, My Chess Powers, Coach Review replay, parent hold gate, weekly real-board idea, Play Together, settings, and repeat-audio button.
- Cumulative stars are never spent. Lesson progress and saved game survive page refresh.

## Verification performed

- Ran `node test-core.cjs` after latest code changes: all checks passed. It exercises rook rules, incorrect/correct checks, rescue cue, progression through bishop/queen/king/pawn, illegal movement, cumulative stars, and parent gate timer.
- On the published browser: played welcome → World 0 → Rocky → knight → Penny → Foxy; tried wrong answers and illegal moves; verified rook drag, Help, Rewind, and stars after refresh.
- On the published browser: played bishop → queen → king → pawn, verified bishop illegal move and Rewind, and resumed the queen midway after reload.
- On the published browser: tried a non-mating move in Finish Together, rewound, played Qg7#, and received authentic checkmate. Saved queen position survived page reload; Rewind reset it.
- On the published browser: World Map and Puzzle Adventure navigation, staged Rocky Help, World 2 capture (including a legal wrong move and Rewind), escape from check, promotion, and wrong/right stalemate choice.
- On the published browser: Timmy e2-e4 and reply, saved-game resume, Toy Box creative move, Chess Playground Fool's Mate and review replay, parent hold entry, Settings, and Play Together.
- Mobile/tablet visual testing has not yet been performed.

## Scope still to build

This is **not** the complete frozen product or a master-level curriculum. The 34 micro-levels described in the source curriculum are not all present. World 0 has one activity; World 2 has four short activities plus Penny; World 3 has Foxy and a finishing puzzle. The bot chooses random legal moves. Review replays a recent position without tactical analysis, and mastery is not based on varied positions, retention, or natural game use. There is no multi-move guided replay, What If mode, full session adaptation, comprehensive lesson narration, stronger opponent, challenge mode, or cross-device sync. The parent hold gate has no optional PIN. chess.js loads from an external CDN and needs network access.

## Development

The site is a static `index.html` hosted by GitHub Pages from `main`. No build step is needed. `node test-core.cjs` runs the local core tests.
