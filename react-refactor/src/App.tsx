import "./App.css";
import Menu from "./components/Menu";
import Modal from "./components/Modal";
import { GameState, Player } from "./types";
import classNames from "classnames";
import { useLocalStorage } from "./useLocalStorage";
import { deriveGame, deriveStats } from "./utils";


export default function App() {
  // const [state, setState] = useState<GameState>({
  //   currentGameMoves: [],
  //   history: {
  //     currentRoundGames: [],
  //     allGames: [],
  //   },
  // });

  const [state, setState] = useLocalStorage("game-state-key", {
    currentGameMoves: [],
    history: {
      currentRoundGames: [],
      allGames: [],
    },
  } as GameState);

  const game = deriveGame(state);
  const stats = deriveStats(state);
  // console.log(game);

  function resetGame(isNewRound: boolean) {
    setState((prev) => {
      const stateClone = structuredClone(prev);
      const { status, moves } = game;

      if (status.isComplete) {
        stateClone.history.currentRoundGames.push({
          moves,
          status,
        });
      }
      stateClone.currentGameMoves = [];
      if (isNewRound) {
        stateClone.history.allGames.push(...stateClone.history.currentRoundGames);
        stateClone.history.currentRoundGames = [];
      }
      return stateClone;
    });
  }

  function handlePlayerMove(squareId: number, player: Player) {
    setState((prev) => {
      const stateClone = structuredClone(prev);
      stateClone.currentGameMoves.push({
        squareId,
        player: game.currentPlayer,
      });
      return stateClone;
    });
  }

  return (
    <>
      <main>
        <div className="grid">
          <div className={classNames("turn", game.currentPlayer.colorClass)}>
            <i
              className={classNames("fa-solid", game.currentPlayer.iconClass)}
            ></i>
            <p>{game.currentPlayer.name}</p>
          </div>

          <Menu onAction={(action) => resetGame(action === "new round")} />

          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((squareId) => {
            const existingMove = game.moves.find(
              (move) => move.squareId === squareId
            );
            return (
              <div
                className="square shadow"
                key={squareId}
                onClick={() => {
                  if (existingMove) return;

                  handlePlayerMove(squareId, game.currentPlayer);
                }}
              >
                {existingMove && (
                  <i
                    className={classNames(
                      "fa-solid",
                      existingMove.player.colorClass,
                      existingMove.player.iconClass
                    )}
                  ></i>
                )}
              </div>
            );
          })}

          <div
            className="score shadow"
            style={{ backgroundColor: "var(--turquoise)" }}
          >
            <p>Player 1</p>
            <span>{stats.playerWithStats[0].wins} Wins</span>
          </div>
          <div
            className="score shadow"
            style={{ backgroundColor: "var(--light-gray)" }}
          >
            <p>Ties</p>
            <span>{stats.ties}</span>
          </div>
          <div
            className="score shadow"
            style={{ backgroundColor: "var(--yellow)" }}
          >
            <p>Player 2</p>
            <span>{stats.playerWithStats[1].wins} Wins</span>
          </div>
        </div>
      </main>
      {game.status.isComplete && (
        <Modal
          message={
            game.status.winner ? `${game.status.winner.name} wins` : "Tie"
          }
          onClick={() => resetGame(false)}
        />
      )}
    </>
  );
}
