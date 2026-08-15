import {
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Link } from "react-router-dom";
import {
  Chess,
  type Square,
  type PieceSymbol,
  type Color,
} from "chess.js";

import RedoxChessEngine from "../utils/redoxchessEngine";
import "./Play.css";

// ============================================================
// CHESS PIECES
// ============================================================

const PIECES: Record<string, string> = {
  wK: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path stroke-linejoin="miter" d="M22.5 11.63V6M20 8h5"/><path fill="#fff" stroke-linecap="butt" stroke-linejoin="miter" d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"/><path fill="#fff" d="M12.5 37c5.5 3.5 14.5 3.5 20 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7"/><path d="M12.5 30c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0"/></g></svg>`,

  wQ: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/><path stroke-linecap="butt" d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15L14 11v14L7 14l2 12z"/><path stroke-linecap="butt" d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/><path fill="none" d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0"/></g></svg>`,

  wR: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path stroke-linecap="butt" d="M9 39h27v-3H9v3zm3-3v-4h21v4H12zm-1-22V9h4v2h5V9h5v2h5V9h4v5"/><path d="M34 14l-3 3H14l-3-3"/><path stroke-linecap="butt" stroke-linejoin="miter" d="M31 17v12.5H14V17"/><path d="M31 29.5l1.5 2.5h-20l1.5-2.5"/><path fill="none" stroke-linejoin="miter" d="M11 14h23"/></g></svg>`,

  wB: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><g fill="#fff" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path stroke-linejoin="miter" d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5"/></g></svg>`,

  wN: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path fill="#fff" d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"/><path fill="#fff" d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3"/><path fill="#000" d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z"/></g></svg>`,

  wP: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path fill="#fff" stroke="#000" stroke-width="1.5" stroke-linecap="round" d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"/></svg>`,

  bK: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path stroke-linejoin="miter" d="M22.5 11.63V6M20 8h5" stroke="#c2a4ff"/><path fill="#1a1a2e" stroke="#c2a4ff" d="M20 8h5"/><path fill="#1a1a2e" stroke="#c2a4ff" stroke-linecap="butt" stroke-linejoin="miter" d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"/><path fill="#1a1a2e" stroke="#c2a4ff" d="M12.5 37c5.5 3.5 14.5 3.5 20 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7"/><path stroke="#c2a4ff" d="M12.5 30c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0"/></g></svg>`,

  bQ: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill-rule="evenodd" stroke="#c2a4ff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><g fill="#1a1a2e"><circle cx="6" cy="12" r="2.75"/><circle cx="14" cy="9" r="2.75"/><circle cx="22.5" cy="8" r="2.75"/><circle cx="31" cy="9" r="2.75"/><circle cx="39" cy="12" r="2.75"/></g><path fill="#1a1a2e" stroke-linecap="butt" d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z"/><path fill="#1a1a2e" stroke-linecap="butt" d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/><path fill="none" stroke-linecap="butt" d="M11 38.5a35 35 1 0 0 23 0"/><path fill="none" d="M11 29a35 35 0 0 1 23 0m-21.5 2.5h20m-21 3a35 35 0 0 0 22 0"/></g></svg>`,

  bR: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill-rule="evenodd" stroke="#c2a4ff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path fill="#1a1a2e" stroke-linecap="butt" d="M9 39h27v-3H9v3zm3.5-7l1.5-2.5h17l1.5 2.5h-20zm-.5 4v-4h21v4H12z"/><path fill="#1a1a2e" stroke-linecap="butt" stroke-linejoin="miter" d="M14 29.5v-13h17v13H14z"/><path fill="#1a1a2e" stroke-linecap="butt" d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z"/><path fill="none" stroke-linejoin="miter" d="M12 35.5h21m-20-4h19m-18-2h17m-17-13h17M11 14h23"/></g></svg>`,

  bB: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#c2a4ff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><g fill="#1a1a2e" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path stroke-linejoin="miter" d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5"/></g></svg>`,

  bN: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#c2a4ff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path fill="#1a1a2e" d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"/><path fill="#1a1a2e" d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3"/><path fill="#c2a4ff" d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z"/></g></svg>`,

  bP: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path fill="#1a1a2e" stroke="#c2a4ff" stroke-width="1.5" stroke-linecap="round" d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"/></svg>`,
};

// ============================================================
// TYPES
// ============================================================

interface MoveHistory {
  from: string;
  to: string;
  piece: string;
  captured?: string;
  san: string;
}



// ============================================================
// PLAY COMPONENT
// ============================================================


const Play = () => {
  type PlayerColor = "w" | "b";

  const [playerColor, setPlayerColor] =
    useState<PlayerColor>("w");

  const [game, setGame] = useState<Chess>(
    () => new Chess()
  );

  const [selectedSquare, setSelectedSquare] =
    useState<Square | null>(null);

  const [possibleMoves, setPossibleMoves] =
    useState<Square[]>([]);

  const [moveHistory, setMoveHistory] =
    useState<MoveHistory[]>([]);

const [, setCapturedWhite] =
  useState<string[]>([]);

const [, setCapturedBlack] =
  useState<string[]>([]);

  const [boardFlipped, setBoardFlipped] =
    useState(false);

  const [isViewMode, setIsViewMode] =
    useState(false);

  const [showColorPicker, setShowColorPicker] =
    useState(false);

  const [lastMove, setLastMove] =
    useState<{
      from: Square;
      to: Square;
    } | null>(null);

  const [gameStatus, setGameStatus] =
    useState("YOUR TURN");

  const [engineThinking, setEngineThinking] =
    useState(false);

  const [gameResult, setGameResult] =
    useState<{
      title: string;
      description: string;
      type: "win" | "loss" | "draw";
    } | null>(null);

  const redoxchessRef =
    useRef<RedoxChessEngine | null>(null);
  const moveHistoryRef =
  useRef<HTMLDivElement | null>(null);

  const [gameSeconds, setGameSeconds] =
    useState(0);


  const aiColor: PlayerColor =
    playerColor === "w" ? "b" : "w";

  // ==========================================================
  // BOARD ORIENTATION
  // ==========================================================

  const files = boardFlipped
    ? ["h", "g", "f", "e", "d", "c", "b", "a"]
    : ["a", "b", "c", "d", "e", "f", "g", "h"];

  const ranks = boardFlipped
    ? ["1", "2", "3", "4", "5", "6", "7", "8"]
    : ["8", "7", "6", "5", "4", "3", "2", "1"];

  // ==========================================================
  // SOUND SYSTEM
  // ==========================================================

  const playSound = useCallback(
    (
      type:
        | "move"
        | "capture"
        | "check"
        | "gameover"
    ) => {
      try {
        const AudioContextClass =
          window.AudioContext ||
          (
            window as typeof window & {
              webkitAudioContext?: typeof AudioContext;
            }
          ).webkitAudioContext;

        if (!AudioContextClass) {
          return;
        }

        const audioContext =
          new AudioContextClass();

        const oscillator =
          audioContext.createOscillator();

        const gain =
          audioContext.createGain();

        const settings = {
          move: {
            frequency: 520,
            duration: 0.09,
            volume: 0.055,
          },
          capture: {
            frequency: 310,
            duration: 0.13,
            volume: 0.07,
          },
          check: {
            frequency: 760,
            duration: 0.18,
            volume: 0.075,
          },
          gameover: {
            frequency: 220,
            duration: 0.42,
            volume: 0.085,
          },
        }[type];

        oscillator.type =
          type === "gameover"
            ? "triangle"
            : "sine";

        oscillator.frequency.setValueAtTime(
          settings.frequency,
          audioContext.currentTime
        );

        gain.gain.setValueAtTime(
          settings.volume,
          audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
          0.001,
          audioContext.currentTime +
            settings.duration
        );

        oscillator.connect(gain);
        gain.connect(
          audioContext.destination
        );

        oscillator.start();

        oscillator.stop(
          audioContext.currentTime +
            settings.duration
        );

        window.setTimeout(() => {
          void audioContext.close();
        }, 700);
      } catch (error) {
        console.warn(
          "Sound playback unavailable:",
          error
        );
      }
    },
    []
  );

  // ==========================================================
  // GAME TIMER
  // ==========================================================

  useEffect(() => {
    if (game.isGameOver()) {
      return;
    }

    const timer = window.setInterval(() => {
      setGameSeconds(
        (previous) => previous + 1
      );
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [game]);

  const formatGameTime = (
    seconds: number
  ) => {
    const minutes =
      Math.floor(seconds / 60);

    const remainingSeconds =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // ==========================================================
  // GAME STATUS + RESULT
  // ==========================================================

  const updateGameStatus = useCallback(
    (currentGame: Chess) => {
      if (currentGame.isCheckmate()) {
        const winner =
          currentGame.turn() ===
          playerColor
            ? "SAI TEJA"
            : "YOU";

        if (winner === "YOU") {
          setGameStatus(
            "CHECKMATE — YOU WIN"
          );

          setGameResult({
            title: "YOU WIN!",
            description:
              "Checkmate. Excellent game!",
            type: "win",
          });
        } else {
          setGameStatus(
            "CHECKMATE — SAI TEJA WINS"
          );

          setGameResult({
            title: "SAI TEJA WINS",
            description:
              "Checkmate. Better luck next game!",
            type: "loss",
          });
        }

        return;
      }

      if (currentGame.isDraw()) {
        let reason = "DRAW";

        if (currentGame.isStalemate()) {
          reason = "DRAW — STALEMATE";
        } else if (
          currentGame.isThreefoldRepetition()
        ) {
          reason = "DRAW — REPETITION";
        } else if (
          currentGame.isInsufficientMaterial()
        ) {
          reason =
            "DRAW — INSUFFICIENT MATERIAL";
        }

        setGameStatus(reason);

        setGameResult({
          title: "DRAW",
          description: reason.replace(
            "DRAW — ",
            ""
          ),
          type: "draw",
        });

        return;
      }

      if (currentGame.isCheck()) {
        const checkedPlayer =
          currentGame.turn() ===
          playerColor
            ? "YOU ARE IN CHECK"
            : "SAI TEJA IS IN CHECK";

        setGameStatus(
          checkedPlayer
        );

        return;
      }

      setGameStatus(
        currentGame.turn() ===
          playerColor
          ? "YOUR TURN"
          : "SAI TEJA TURN"
      );
    },
    [playerColor]
  );

  useEffect(() => {
    updateGameStatus(game);
  }, [game, updateGameStatus]);


  // ==========================================================
// MOVE HISTORY — AUTO SCROLL TO LATEST MOVE
// ==========================================================

useEffect(() => {
  const history = moveHistoryRef.current;

  if (!history) {
    return;
  }

  history.scrollTo({
    top: history.scrollHeight,
    behavior: "smooth",
  });
}, [moveHistory]);

  // ==========================================================
  // MAKE MOVE
  // ==========================================================

  const makeMove = useCallback(
    (
      from: Square,
      to: Square
    ) => {
      try {
        const gameCopy =
          new Chess(game.fen());

        const move =
          gameCopy.move({
            from,
            to,
            promotion: "q",
          });

        if (!move) {
          return;
        }

        if (move.captured) {
          if (move.color === "w") {
            setCapturedBlack(
              (previous) => [
                ...previous,
                move.captured!,
              ]
            );
          } else {
            setCapturedWhite(
              (previous) => [
                ...previous,
                move.captured!,
              ]
            );
          }
        }

        setMoveHistory(
          (previous) => [
            ...previous,
            {
              from: move.from,
              to: move.to,
              piece: move.piece,
              captured:
                move.captured,
              san: move.san,
            },
          ]
        );

        setLastMove({
          from: move.from as Square,
          to: move.to as Square,
        });

        setGame(gameCopy);

        setSelectedSquare(null);
        setPossibleMoves([]);

        if (gameCopy.isGameOver()) {
          playSound("gameover");
        } else if (gameCopy.isCheck()) {
          playSound("check");
        } else if (move.captured) {
          playSound("capture");
        } else {
          playSound("move");
        }
      } catch (error) {
        console.error(
          "Move error:",
          error
        );

        setSelectedSquare(null);
        setPossibleMoves([]);
      }
    },
    [game, playSound]
  );

  // ==========================================================
  // INITIALIZE CHESS ENGINE
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    const initEngine = async () => {
      try {
        const engine =
          new RedoxChessEngine();

        redoxchessRef.current =
          engine;

        await engine.init();

        if (!mounted) {
          engine.quit();
          redoxchessRef.current =
            null;
        }
      } catch (error) {
        console.error(
          "Chess engine initialization failed:",
          error
        );
      }
    };

    initEngine();

    return () => {
      mounted = false;

      redoxchessRef.current?.quit();

      redoxchessRef.current =
        null;
    };
  }, []);

  // ==========================================================
  // AI / SAI TEJA MOVE
  // ==========================================================

  useEffect(() => {
    if (
      game.turn() !== aiColor ||
      game.isGameOver() ||
      isViewMode
    ) {
      return;
    }

    const engine =
      redoxchessRef.current;

    if (!engine) {
      return;
    }

    let cancelled = false;

    setEngineThinking(true);

    try {
      engine.setPosition(
        game.fen()
      );

      engine.getBestMove(
        (move) => {
          if (cancelled) {
            return;
          }

          if (
            !move ||
            move.length < 4
          ) {
            setEngineThinking(false);
            return;
          }

          const from =
            move.substring(
              0,
              2
            ) as Square;

          const to =
            move.substring(
              2,
              4
            ) as Square;

          makeMove(from, to);

          setEngineThinking(false);
        },
        12
      );
    } catch (error) {
      console.error(
        "Chess engine move error:",
        error
      );

      if (!cancelled) {
        setEngineThinking(false);
      }
    }

    return () => {
      cancelled = true;
    };
  }, [
    game,
    aiColor,
    isViewMode,
    makeMove,
  ]);

  // ==========================================================
  // GET PIECE
  // ==========================================================

  const getPieceAt = (
    square: Square
  ): {
    type: PieceSymbol;
    color: Color;
  } | null => {
    return game.get(square) || null;
  };

  // ==========================================================
  // HANDLE BOARD CLICK
  // ==========================================================

  const handleSquareClick = (
    square: Square
  ) => {
    // View mode is strictly read-only.
    if (isViewMode) {
      return;
    }

    // The user can only move on their own turn.
    if (
      engineThinking ||
      game.isGameOver() ||
      game.turn() !== playerColor
    ) {
      return;
    }

    const piece =
      getPieceAt(square);

    if (selectedSquare) {
      if (
        possibleMoves.includes(square)
      ) {
        makeMove(
          selectedSquare,
          square
        );

        return;
      }

      if (
        piece &&
        piece.color === playerColor
      ) {
        setSelectedSquare(square);

        const moves =
          game.moves({
            square,
            verbose: true,
          });

        setPossibleMoves(
          moves.map(
            (move) =>
              move.to as Square
          )
        );

        return;
      }

      setSelectedSquare(null);
      setPossibleMoves([]);

      return;
    }

    if (
      piece &&
      piece.color === playerColor
    ) {
      setSelectedSquare(square);

      const moves =
        game.moves({
          square,
          verbose: true,
        });

      setPossibleMoves(
        moves.map(
          (move) =>
            move.to as Square
        )
      );
    }
  };

  // ==========================================================
  // START NEW GAME
  // USER ALWAYS GETS THE FIRST TURN
  // ==========================================================

  const startNewGame = (
    color: PlayerColor
  ) => {
    const startingFen =
      color === "w"
        ? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1";

    setPlayerColor(color);

    setGame(
      new Chess(startingFen)
    );

    setSelectedSquare(null);
    setPossibleMoves([]);
    setMoveHistory([]);
    setCapturedWhite([]);
    setCapturedBlack([]);
    setLastMove(null);
    setGameSeconds(0);
    setEngineThinking(false);
    setGameResult(null);
    setIsViewMode(false);

    // User's own side is always at the bottom.
    setBoardFlipped(
      color === "b"
    );

    setShowColorPicker(false);

    setGameStatus("YOUR TURN");
  };

  const resetGame = () => {
    setShowColorPicker(true);
  };

  // ==========================================================
  // SWITCH TO VIEW / RETURN TO GAME
  // ==========================================================

  const toggleViewMode = () => {
    const nextViewMode =
      !isViewMode;

    setIsViewMode(nextViewMode);

    setSelectedSquare(null);
    setPossibleMoves([]);

    if (nextViewMode) {
      // View from Sai Teja's side.
      setBoardFlipped(
        aiColor === "b"
      );
    } else {
      // Return to the user's side.
      setBoardFlipped(
        playerColor === "b"
      );
    }
  };



  // ==========================================================
  // RENDER PIECE
  // ==========================================================

  const renderPiece = (
    piece: {
      type: PieceSymbol;
      color: Color;
    } | null
  ) => {
    if (!piece) {
      return null;
    }

    const key =
      `${piece.color}${piece.type.toUpperCase()}`;

    const svg = PIECES[key];

    if (!svg) {
      return null;
    }

    return (
      <div
        className="chess-piece"
        dangerouslySetInnerHTML={{
          __html: svg,
        }}
      />
    );
  };

  // ==========================================================
  // SQUARE COLOR
  // ==========================================================

  const isSquareLight = (
    file: string,
    rank: string
  ): boolean => {
    const fileIndex =
      "abcdefgh".indexOf(file);

    const rankIndex =
      parseInt(rank, 10) - 1;

    return (
      (fileIndex + rankIndex) %
        2 ===
      1
    );
  };

  // ==========================================================
  // STATUS DISPLAY
  // ==========================================================

  const statusTitle =
    game.isGameOver()
      ? gameStatus
      : isViewMode
      ? "VIEW MODE"
      : engineThinking
      ? "SAI TEJA IS THINKING"
      : game.turn() ===
        playerColor
      ? "YOUR TURN"
      : "SAI TEJA TURN";

  const statusDescription =
    game.isGameOver()
      ? "Game finished"
      : isViewMode
      ? "View only — tap Return to Game to play"
      : engineThinking
      ? "Sai Teja is thinking..."
      : game.turn() ===
        playerColor
      ? "Make your move"
      : "Waiting for Sai Teja";

  const boardTurnText =
    game.isGameOver()
      ? "GAME OVER"
      : isViewMode
      ? "VIEW MODE"
      : engineThinking
      ? "SAI TEJA THINKING"
      : game.turn() ===
        playerColor
      ? "YOUR TURN"
      : "SAI TEJA TURN";

  const playerColorName =
    playerColor === "w"
      ? "WHITE"
      : "BLACK";

  const aiColorName =
    aiColor === "w"
      ? "WHITE"
      : "BLACK";
  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="play-page">

      {/* =====================================================
          COLOR PICKER
          ===================================================== */}

      {showColorPicker && (
        <div className="color-picker-overlay">
          <div className="color-picker-card">

            <div className="color-picker-kicker">
              NEW CHESS GAME
            </div>

            <h2>Choose Your Color</h2>

            <p>
              You will always make the first move.
            </p>

            <div className="color-picker-buttons">

              <button
                type="button"
                onClick={() => startNewGame("w")}
                className="color-picker-option"
                data-cursor="disable"
              >
                <span className="color-picker-piece">
                  ♔
                </span>
                <span>WHITE</span>
              </button>

              <button
                type="button"
                onClick={() => startNewGame("b")}
                className="color-picker-option"
                data-cursor="disable"
              >
                <span className="color-picker-piece">
                  ♚
                </span>
                <span>BLACK</span>
              </button>

            </div>

            <button
              type="button"
              onClick={() => setShowColorPicker(false)}
              className="color-picker-cancel"
              data-cursor="disable"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

      {/* =====================================================
          RESULT POPUP
          ===================================================== */}

      {gameResult && (
        <div className="game-result-overlay">

          <div className="game-result-card">

            <div className="game-result-icon">
              {gameResult.type === "win"
                ? "🏆"
                : gameResult.type === "loss"
                ? "♟"
                : "🤝"}
            </div>

            <h2>{gameResult.title}</h2>

            <p>{gameResult.description}</p>

            <div className="game-result-actions">

              <button
                type="button"
                onClick={() => {
                  setGameResult(null);
                  setShowColorPicker(true);
                }}
                className="game-result-btn primary"
                data-cursor="disable"
              >
                New Game
              </button>

              <button
                type="button"
                onClick={() => setGameResult(null)}
                className="game-result-btn"
                data-cursor="disable"
              >
                View Board
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <header className="play-header">

        <Link
          to="/"
          className="back-button"
          data-cursor="disable"
        >
          ← Back to Portfolio
        </Link>

        <div className="online-status">
          <span className="online-dot" />
          ONLINE
        </div>

      </header>

      {/* =====================================================
          TITLE
          ===================================================== */}

      <div className="play-title-area">

        <h1 className="play-title">

          <span className="play-title-icon">
            ♟
          </span>

          PLAY{" "}

          <span className="purple">
            WITH
          </span>{" "}

          ME

        </h1>

        <p className="play-subtitle">
          Challenge me to a game of chess
        </p>

      </div>

      {/* =====================================================
          MAIN GAME AREA

          LEFT:
            Players
            Sai Teja
            You
            Game Status
            New Game
            Switch to View
            Exit Game

          CENTER:
            Chess board
            Game stats

          RIGHT:
            Move history

          Chat has been intentionally removed from this
          chess page. It will live separately in the
          portfolio chat section.

          This structure intentionally matches the reference
          screenshot. CSS will control the exact dimensions.
          ===================================================== */}

      <div className="game-layout">

        {/* ===================================================
            LEFT — PLAYERS / CONTROLS
            =================================================== */}

        <aside className="players-panel">

          <div className="players-panel-title">
            <span className="players-panel-icon">
              ♟♟
            </span>
            PLAYERS
          </div>

          {/* SAI TEJA */}

          <div
            className={`player-card saiteja-player ${
              game.turn() === aiColor
                ? "turn-glow"
                : ""
            }`}
          >

            <div className="player-avatar saiteja-avatar">

              <img
                src="/images/mypic.jpeg"
                alt="Sai Teja"
                onError={(event) => {
                  event.currentTarget.hidden = true;
                }}
              />

              <span className="player-avatar-fallback">
                S
              </span>

            </div>

            <div className="player-info">

              <div className="player-name">
                Sai Teja
              </div>

              <div className="player-rating">
                 CHESS MASTER
              </div>

              <div className="player-color">
                ♟ {aiColorName}
              </div>

            </div>

          </div>

          {/* VS */}

          <div className="players-divider">

            <span />
            <strong>VS</strong>
            <span />

          </div>

          {/* YOU */}

          <div
            className={`player-card you-player ${
              game.turn() === playerColor
                ? "turn-glow"
                : ""
            }`}
          >

            <div className="player-avatar you-avatar">
              ♟
            </div>

            <div className="player-info">

              <div className="player-name">
                You
              </div>

              <div className="player-rating">
                CHALLENGER
              </div>

              <div className="player-color">
                ♟ {playerColorName}
              </div>

            </div>

          </div>

          {/* GAME STATUS */}

          <div className="game-status-card">

            <div className="game-status-title">
              GAME STATUS
            </div>

            <div className="game-status-main">

              <span className="game-status-dot" />

              {statusTitle}

            </div>

            <div className="game-status-description">
              {statusDescription}
            </div>

          </div>

          {/* CONTROLS */}

          <div className="game-controls">

            <button
              type="button"
              onClick={resetGame}
              className="game-control-btn primary"
              data-cursor="disable"
            >
              <span>＋</span>
              New Game
            </button>

            <button
              type="button"
              onClick={toggleViewMode}
              className={`game-control-btn ${
                isViewMode ? "active" : ""
              }`}
              data-cursor="disable"
            >
              <span>
                {isViewMode ? "↩" : "◉"}
              </span>

              {isViewMode
                ? "Return to Game"
                : "Switch to View"}
            </button>

            <Link
              to="/"
              className="game-control-btn"
              data-cursor="disable"
            >
              <span>⇥</span>
              Exit Game
            </Link>

          </div>

        </aside>

        {/* ===================================================
            CENTER — CHESS BOARD
            =================================================== */}

        <main className="board-column">

          <div className="board-card">

            {isViewMode && (
              <div className="view-mode-banner">
                VIEW MODE • WATCHING FROM SAI TEJA'S SIDE
              </div>
            )}

            <div className="chess-board-wrapper">

              <div className="chess-board">

                {ranks.map((rank) =>
                  files.map((file) => {

                    const square =
                      `${file}${rank}` as Square;

                    const piece =
                      getPieceAt(square);

                    const isLight =
                      isSquareLight(
                        file,
                        rank
                      );

                    const isSelected =
                      selectedSquare === square;

                    const isPossibleMove =
                      possibleMoves.includes(square);

                    const isLastMoveSquare =
                      lastMove !== null &&
                      (
                        lastMove.from === square ||
                        lastMove.to === square
                      );

                    const isCheck =
                      game.isCheck() &&
                      piece?.type === "k" &&
                      piece?.color === game.turn();

                    return (
                      <div
                        key={square}
                        className={`
                          chess-square
                          ${isLight ? "light" : "dark"}
                          ${isSelected ? "selected" : ""}
                          ${isLastMoveSquare ? "last-move" : ""}
                          ${isCheck ? "in-check" : ""}
                        `}
                        onClick={() =>
                          handleSquareClick(square)
                        }
                        data-cursor="disable"
                      >

                        {/* RANK */}

                        {file ===
                          (
                            boardFlipped
                              ? "h"
                              : "a"
                          ) && (
                          <span className="coord-rank">
                            {rank}
                          </span>
                        )}

                        {/* FILE */}

                        {rank ===
                          (
                            boardFlipped
                              ? "8"
                              : "1"
                          ) && (
                          <span className="coord-file">
                            {file}
                          </span>
                        )}

                        {/* PIECE */}

                        {renderPiece(piece)}

                        {/* POSSIBLE MOVE */}

                        {isPossibleMove && (
                          <div
                            className={`
                              move-indicator
                              ${piece ? "capture" : ""}
                            `}
                          />
                        )}

                      </div>
                    );
                  })
                )}

              </div>

            </div>

            {/* BOARD STATS */}

            <div className="board-footer">

              <div className="board-stat">

                <div className="board-stat-value">
                  ◷ {formatGameTime(gameSeconds)}
                </div>

                <div className="board-stat-label">
                  GAME TIME
                </div>

              </div>

              <div className="board-stat">

                <div className="board-stat-value">
                  ⚔ {moveHistory.length}
                </div>

                <div className="board-stat-label">
                  MOVES MADE
                </div>

              </div>

              <div className="board-stat">

                <div className="board-stat-value purple">
                  〽 {boardTurnText}
                </div>

                <div className="board-stat-label">
                  {gameStatus}
                </div>

              </div>

            </div>

          </div>

        </main>

        {/* ===================================================
            RIGHT — HISTORY + CHAT
            =================================================== */}

        <aside className="right-panel">

          {
          
          /* =================================================
              MOVE HISTORY
              ================================================= */}

          <section className="move-history-card">

            <div className="move-history-header">

              <div className="move-history-title">
                MOVE HISTORY
              </div>

              <div className="move-history-count">
                {moveHistory.length}
              </div>

            </div>

            <div className="move-history-columns">
              <span>#</span>
              <span>YOU</span>
              <span>SAI TEJA</span>
            </div>

            <div
  ref={moveHistoryRef}
  className="move-history-list"
>

              {moveHistory.length === 0 ? (

                <div className="move-history-empty">
                  No moves yet.
                </div>

              ) : (

                Array.from(
                  {
                    length:
                      Math.ceil(
                        moveHistory.length / 2
                      ),
                  },
                  (_, index) => {

                    // The user always makes the first move.
                    // Therefore the left column is always the user
                    // and the right column is always Sai Teja,
                    // regardless of which chess color they selected.
                    const userMove =
                      moveHistory[index * 2];

                    const saiTejaMove =
                      moveHistory[index * 2 + 1];

                    const latestRow =
                      index ===
                      Math.floor(
                        (moveHistory.length - 1) / 2
                      );

                    return (
                      <div
                        key={`move-row-${index}`}
                        className={`
                          move-history-row
                          ${latestRow ? "latest-move" : ""}
                        `}
                      >

                        <span className="move-number">
                          {index + 1}.
                        </span>

                        <span className="move-san user-move">
                          {userMove?.san || "—"}
                        </span>

                        <span className="move-san saiteja-move">
                          {saiTejaMove?.san || "—"}
                        </span>

                      </div>
                    );

                  }
                )

              )}

            </div>

          </section>

         
        </aside>

      </div>

      {/* =====================================================
          SMALL DESKTOP TIP
          ===================================================== */}

      <div className="game-tip">

        <span className="tip-icon">
          💡
        </span>

        <span>
          Tip: Control the center,
          develop your pieces, and
          protect your king.
        </span>

      </div>

    </div>
  );
};

export default Play;
