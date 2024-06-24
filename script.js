$(document).ready(function () {
  let board = ["", "", "", "", "", "", "", "", ""];
  let currentPlayer = "X";
  let moves = { X: [], O: [] };
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];
  let recentGames = [];
  let players = { X: "", O: "" };
  let nowFlash = "";

  $("#player-form").on("submit", function (event) {
    event.preventDefault();
    players.X = $("#playerX").val();
    players.O = $("#playerO").val();
    resetGame(false);
    $("#form").modal("hide");

    $("#playerInfo").text(`X是${players.X}，O是${players.O}，X先下棋`);
  });

  //點下去事件
  $(".cell").on("click", function () {
    const cell = $(this);
    const index = cell.data("index");
    const opponent = getopponent();
    if (board[index] !== "") {
      alert("不要亂按");
      return;
    }

    //下棋
    board[index] = currentPlayer;
    cell.text(currentPlayer);
    moves[currentPlayer].push(index);

    wipeFlash(currentPlayer);

    // 檢查贏了 或是要換人
    if (checkWin(currentPlayer)) {
      setTimeout(() => {
        alert(`${players[currentPlayer]} (${currentPlayer}) wins!`);
        addRecentGame(players[currentPlayer]);
        resetGame(true);
      }, 100);
    } else {
      currentPlayer = opponent;
    }

    // 如果沒贏而且下一個人的步數大於等於三 就要把最新那步放閃
    if (moves[currentPlayer].length >= 3) {
      nowFlash = moves[currentPlayer][0];
      $(`[data-index='${nowFlash}']`).addClass("flash");
    }

    $("#nowForWho").text(
      `現在輪到是${players[currentPlayer]}，下${currentPlayer}`
    );
  });

  function getopponent() {
    return currentPlayer === "X" ? "O" : "X";
  }

  function checkWin(player) {
    return winPatterns.some((pattern) =>
      pattern.every((index) => board[index] === player)
    );
  }

  function resetGame(isSwap) {
    board.fill("");
    currentPlayer = "X";
    nowFlash = "";
    moves = { X: [], O: [] };
    $(".cell").text("").removeClass("flash");
    $("#nowForWho").text("");

    if (isSwap) {
      let temp = players.X;
      players.X = players.O;
      players.O = temp;
      alert("選手交換");
    }
    $("#playerInfo").text(`X是${players.X}，O是${players.O}`);
    $("#nowForWho").text(
      `現在輪到是${players[currentPlayer]}，下${currentPlayer}`
    );
  }

  function addRecentGame(winner) {
    if (recentGames.length === 10) {
      recentGames.pop();
    }
    recentGames.unshift(winner);
    updateRecentGamesList();
  }

  function updateRecentGamesList() {
    const recentGamesList = $("#recent-games");
    recentGamesList.empty();
    recentGames.forEach((game) => {
      const listItem = $("<li></li>")
        .text(`${game} wins`)
        .addClass("list-group-item");
      recentGamesList.append(listItem);
    });
  }

  function wipeFlash(player) {
    if (nowFlash === "") return;

    document
      .querySelector(`[data-index='${nowFlash}']`)
      ?.classList.remove("flash");
    const firstMove = moves[player].shift();
    board[firstMove] = "";
    document.querySelector(`[data-index='${firstMove}']`).textContent = "";

    nowFlash = "";
  }
  $("#form").modal("show");
});
