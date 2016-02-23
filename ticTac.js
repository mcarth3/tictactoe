var app = angular.module('ticTacToe', []);

app.controller('mainCtrl', function($scope) {
	$scope.gameName = "";
	$scope.player1Name = "";
	$scope.player1Wins = 0;
	$scope.player2Name = "";
	$scope.player2Wins = 0;
	$scope.ties = 0;
	$scope.gridOptions = [3, 4, 5];
	$scope.grid = 3;
	$scope.gameState = "NEW_GAME";
	$scope.currentPlayer = "";
	$scope.winner = "";
	$scope.board = [
        {
            a1: "",
            a2: "",
            a3: ""
        },
        {
            b1: "",
            b2: "",
            b3: ""
        },
        {
            c1: "",
            c2: "",
            c3: ""
        }
    ]
		$scope.boardModel = new TicTacToeBoard($scope.grid);
});

app.controller('newGameCtrl', function($scope) {
    $scope.startGame = function() {
		$scope.$parent.gameState = "PLAY_GAME";
		if($scope.$parent.player1Name === ""){
            $scope.$parent.player1Name = "Player One"
		}
		if($scope.$parent.player2Name === ""){
            $scope.$parent.player2Name = "Player Two";
		}
		$scope.$parent.currentPlayer = $scope.$parent.player1Name;
    };
});

app.controller('playGameCtrl', function($scope) {
    var moves = 0;

	$scope.endGame = function() {
		$scope.$parent.gameState = "END_GAME";
    };

    var checkForWin = function(){
			var winner = $scope.$parent.boardModel.checkForWin().toLowerCase();
			if (winner === "x") {
				moves = 0;
				$scope.$parent.winner = $scope.$parent.player1Name;
				$scope.$parent.player1Wins++;
				$scope.$parent.gameState = "END_GAME";
			}
			else if (winner === "o") {
				moves = 0;
				$scope.$parent.winner = $scope.$parent.player2Name;
				$scope.$parent.player2Wins++;
				$scope.$parent.gameState = "END_GAME";
			}
			else {
				if(moves === 9){
            
            moves = 0;
            $scope.$parent.winner = "No one... it's a tie!"
						$scope.$parent.ties++;
            $scope.$parent.gameState = "END_GAME";
        }
			}
    }

		var addMarkToModel = function (id, mark) {
			var row = id[0];
			var column = id[1] - 1;
			switch (row) {
				case "a":
				case "A":
					row = 0;
					break;
				case "b":
				case "B":
					row = 1;
					break;
				case "c":
				case "C":
					row = 2;
					break;
			}
			var model = $scope.$parent.boardModel;
			model.markMove(mark, row, column);
		}
    var placeMark = function(id, mark){
      var board = $scope.$parent.board;
      for(var i = 0; i < board.length; i++){
      	var keys = Object.keys(board[i]);
		  	for (var j = 0; j < keys.length; j++){
		       if(id == keys[j]){
		           if(board[i][keys[j]] === ""){
		               board[i][keys[j]] = mark;
									 addMarkToModel(id, mark);
		               return true;
		           }
		           else{
		               return false;
		           }
		         }
					 }
				 }
    }

    $scope.markCell = function(id){
        var mark = "";
        if($scope.$parent.currentPlayer === $scope.$parent.player1Name){
            mark = "X"
            if(placeMark(id, mark)){
                moves ++;
                checkForWin();
                $scope.$parent.currentPlayer = $scope.$parent.player2Name;
            }
            else{
                alert("You cannot go there! Choose another spot.");
            }
        }
        else{
            mark = "O";
            if(placeMark(id, mark)){
                moves++;
                checkForWin();
                $scope.$parent.currentPlayer = $scope.$parent.player1Name;
            }
            else{
                alert("You cannot go there! Choose another spot.");
            }
        }
    };
});

app.controller('endGameCtrl', function($scope) {
    $scope.startGame = function() {
       
		$scope.$parent.currentPlayer = $scope.$parent.player1Name;
		$scope.$parent.board = [
            {
                a1: "",
                a2: "",
                a3: ""
            },
            {
                b1: "",
                b2: "",
                b3: ""
            },
            {
                c1: "",
                c2: "",
                c3: ""
            }
        ];
				$scope.$parent.boardModel.reset();
        $scope.$parent.gameState = "PLAY_GAME";
        
    };
});




function initArrayWithSize(size, value) {
  var array = [];
  for (var i = 0; i < size; i++) {
    array.push(value);
  }
  return array;
}


function TicTacToeBoard(gridSize) {
  this.grid = [];
  this.grid.push(initArrayWithSize(gridSize, ""));
  this.grid.push(initArrayWithSize(gridSize, ""));
  this.grid.push(initArrayWithSize(gridSize, ""));
  this.gridSize = gridSize;
}

TicTacToeBoard.prototype.toString = function () {
  var str = "";
  for (var i = 0; i < this.gridSize; i++) {
    for (var j = 0; j < this.gridSize; j++) {
      str += " " + this.grid[i][j];
    }
		str += "\n"
  }
	return str;
}

TicTacToeBoard.prototype.markMove = function (playerSymbol, row, column) {
  this.grid[row][column] = playerSymbol;
}

TicTacToeBoard.prototype.reset = function () {
    this.grid = [];
    this.grid.push(initArrayWithSize(this.gridSize, ""));
    this.grid.push(initArrayWithSize(this.gridSize, ""));
    this.grid.push(initArrayWithSize(this.gridSize, ""));
}


TicTacToeBoard.prototype.checkForWin = function () {
  var winner = "";

  for (var i = 0; i < this.gridSize && winner === ""; i++) { 
    var player = this.grid[i][0];
    if (player !== "") {
      winner = player;
      for (var j = 0; j < this.gridSize; j++) { 
        if (player !== this.grid[i][j]) {
          winner = "";
          break;
        }
      }
    }
  }

  for (var i = 0; i < this.gridSize && winner === ""; i++) { 
    var player = this.grid[0][i];
    if (player !== "") {
      winner = player; 
      for (var j = 0; j < this.gridSize; j++) {
        if (player !== this.grid[j][i]) {
          winner = ""; 
          break;
        }
      }
    }
  }

  if (winner === "") { 
    var player = this.grid[0][0];
    winner = player; 
    for (var i = 0; i < this.gridSize; i++) {
      if (player !== this.grid[i][i]) {
        winner = ""; 
        break;
      }
    }
  }
  if (winner === "") { 
    var player = this.grid[0][this.gridSize-1];
    winner = player; 
    for (var i = 0; i < this.gridSize; i++) { 
      if (player !== this.grid[i][this.gridSize-1-i]) {
        winner = ""; 
        break;
      }
    }
  }

  return winner;
}
