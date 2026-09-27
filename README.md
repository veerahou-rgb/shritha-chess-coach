# Chessy's Adventure for Shritha

Public preview: https://veerahou-rgb.github.io/shritha-chess-coach/

A child-friendly chess coach prototype. Open the preview in a browser. Progress stays on that device in browser local storage; no account is needed.

## Playable now

- New-child welcome, three light and three dark square taps, then a coordinate activity with board-edge labels.
- Rocky's rook star route with a blocker and Klip-Klop's knight jumps, each followed by a quiet understanding question.
- Explore → Classes now groups twelve replayable video lessons, each with a matching Try it practice button. The twelve short MP4 lessons show the board and move before practice: board basics, Rocky, Klip-Klop, bishop, queen, king, pawn, capture, escape, promotion, Penny, and Foxy. Practice unlocks after the video finishes. Videos have large captions and gentle chimes; they have no spoken narration.
- Bishop, queen, king, and pawn movement adventures with legal-move feedback, Help, Again, Rewind, stars, and saved progress.
- World 2 legal capture, escape from check, and pawn promotion puzzles, Penny's defended pawn, and a stalemate check.
- Foxy's knight fork and a real rules-engine checkmate finishing lesson with consequence, retry, and saved position.
- Timmy Turtle legal game, quiet Foxy Challenge against a simple capture-seeking bot, two-sided Chess Playground, and rules-off Toy Box.
- Nearby Adventure Map, Puzzle Adventure, My Kingdom, My Chess Powers, Coach Review board replay and move comparison, parent hold gate, weekly real-board idea, Play Together, settings, and repeat-audio button.
- Visual Help lines on movement boards; board screens hide the header and bottom navigation to leave more room. Child lessons now use video instead of synthetic browser speech.
- Cumulative stars are never spent. Lesson progress and saved game survive page refresh. Rook and knight understanding checks schedule later, varied-position reviews; elapsed time alone never removes credit.

## Verification performed

- Ran `node test-core.cjs` after latest code changes: all checks passed. It exercises World 0 color and coordinate progression, rook rules, incorrect/correct checks, rescue cue, progression through bishop/queen/king/pawn, illegal movement, cumulative stars, and parent gate timer.
- On the published browser: played welcome → World 0 → Rocky → knight → Penny → Foxy; tried wrong answers and illegal moves; verified rook drag, Help, Rewind, and stars after refresh.
- On the published browser: played bishop → queen → king → pawn, verified bishop illegal move and Rewind, and resumed the queen midway after reload.
- On the published browser: tried a non-mating move in Finish Together, rewound, played Qg7#, and received authentic checkmate. Saved queen position survived page reload; Rewind reset it.
- On the published browser: World Map and Puzzle Adventure navigation, staged Rocky Help, World 2 capture (including a legal wrong move and Rewind), escape from check, promotion, and wrong/right stalemate choice. Coach Review alternative g3 updated the board; Rewind restored the original g2 pawn.
- On the published browser: Timmy e2-e4 and reply, saved-game resume, Toy Box creative move, Chess Playground Fool's Mate and review replay, parent hold entry, Settings, and Play Together. Foxy Challenge answered e2-e4; its Help offered no live hint. Pause remained on the Play screen after the bot timer, and saved Challenge resumed after reload.
- The class catalog was checked for 12 video and 12 practice entries in the core test. The new World 0 color sequence and due review path were run in the core test; they have not been played in a fresh/due public-browser profile. Mobile/tablet visual testing has not yet been performed.
- Rechecked the published Rocky board at 1363×936: board measured 618 pixels, Help drew a visible line, and the page required no vertical scroll. Replayed the parent hold gate. Tested the new MP4 first-launch board video and Rocky video in a fresh public-browser profile: each finished and unlocked its activity; knight video also loaded. Captions were moved clear of the player controls after visual inspection.

## ChessKid feature benchmark (original implementation)

| Experience | Current state | Needed for comparable breadth |
|---|---|---|
| Watch → learn → practice | 12 short captioned movies and linked exercises | Recorded child-friendly narration, richer animation, many more varied lessons |
| Puzzles and workouts | Several replayable puzzles and a finishing challenge | A tagged, varied puzzle bank, adaptive difficulty, endgame workouts |
| Full games | Legal chess rules, local two-player, Timmy and Foxy | Stronger bot levels and truthful engine-based game review |
| Live play with children | Not built | Accounts, server matchmaking, child protection, moderation and parent controls |
| Parents and progress | Local progress, hold gate, weekly real-board idea | Optional PIN, cross-device sync, assignments and detailed parent controls |

ChessKid’s branding, characters, videos, narration, curriculum text, and game data are not reused. This project needs original assets and content.

## Scope still to build

This is **not** the complete frozen product or a master-level curriculum. The 34 micro-levels described in the source curriculum are not all present. World 0 has color and coordinate activities; World 2 has four short activities plus Penny; World 3 has Foxy and a finishing puzzle. Timmy chooses random legal moves; Foxy checks each legal reply against one possible child response and values material and central squares; this is still a shallow beginner bot, not a strong engine. Review selects one recent move and compares a legal alternative, but does not evaluate which move is stronger. The quiet review samples one varied position, but mastery is not yet inferred from repeated varied positions, retention, and natural game use. There is no equivalent to ChessKid’s full lesson library, live child matchmaking, tournaments, clubs, puzzle database, multi-move guided replay, What If mode, full session adaptation, comprehensive lesson narration, stronger opponent, challenge mode, or cross-device sync. The parent hold gate has no optional PIN. chess.js loads from an external CDN and needs network access.

## Development

The site is a static `index.html` hosted by GitHub Pages from `main`. No build step is needed. `node test-core.cjs` runs the local core tests.
