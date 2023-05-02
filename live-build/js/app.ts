import Store from "./store.js";
import type { Player } from "./types";
import View from "./view.js";

const players: Player[] = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "turquoise",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "yellow",
  },
];

function init() {
  const view = new View();
  const store = new Store("live-t3-storage-key", players);

  //current tab state change
  store.addEventListener("statechange", () => {
    view.render(store.game, store.stats);
  });
  //diff tab state change
  window.addEventListener("storage", () => {
    console.log("state changed from another tab");
    view.render(store.game, store.stats);
  });
  //first load of doc
  view.render(store.game, store.stats);

  view.bindGameResetEvent((event) => {
    store.reset();

    // console.log(store.stats);
  });

  view.bindNewRoundEvent((event) => {
    store.newRound();
  });

  view.bindPlayerMoveEvent((square) => {
    console.log(square);
    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    );

    if (existingMove) {
      return;
    }

    //advance to next state bu pushing a move to moves arr
    store.playerMove(+square.id);
  });

  // console.log(view.$.turn);
}

window.addEventListener("load", init);
