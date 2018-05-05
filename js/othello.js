//初期の盤面
var initialData = [[2, 2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 0, 1, 2, 2, 2], [2, 2, 2, 1, 0, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2, 2]];
//石の種別
var WHITE = 0;
var BLACK = 1;
var EMPTY = 2;
//盤面生成と枚数表示(送信ボタンが押される度に実行)
var board = getBoard();
createBoard(board);
window.onload = function(){
	countStone();
}

//盤面状態をjsonをパースして取得する
function getBoard() {
	var json = localStorage.getItem('board');
	var board;
	if (json == null) {
		setBoard(initialData);
		board = initialData;
	} else {
		board = JSON.parse(json);
	}
	return board;
}

//盤面状態をlocalStorageに保存する
function setBoard(board) {
	var json = JSON.stringify(board);
	localStorage.setItem('board', json);
}

//盤面状態をリセットする
function resetBoard() {
	localStorage.removeItem('board');
	board = getBoard();
	createBoard(board);
	countStone();
}

//盤面の書き込み
function createBoard(data) {
	var div = document.getElementById("table");

	var board = "";
	board += "<table id=\"board\">";
	for (var i = -1; i < data.length; i++) {
		board += "<tr>";
		for (var j = -1; j < data[0].length; j++) {
			//盤面に行列の指定番号を付ける
			if (i == -1 && j > -1) {
				board += "<th>" + "12345678"[j] + "</th>";
			} else if (i > -1 && j == -1) {
				board += "<th>" + "abcdefgh"[i] + "</th>";
			} else if (i == -1 && j == -1) {
				board += "<th></th>"
			} else {
				board += "<td>";
				//dataの値によって○, ●, "" を振り分ける
				var tempStr = "";
				switch(data[i][j]) {
					case 0:
						tempStr = "○";
						break;
					case 1:
						tempStr = "●";
						break;
					case 2:
						tempStr = "□";
						break;
					default:
						break;
				}
				board += tempStr;
				board += "</td>";
			}
		}
		board += "</tr>";
	}
	board += "</table>";

	div.innerHTML = board;
}

//人間の手を実行する
function manOthello() {
	var row = Number(document.form1.row.value);
	var column = Number(document.form1.column.value);
	var color = Number(document.form1.color.value);
	if (row == 10 || column == 10 || color == 10) {
		alert("行・列・石の色を全て選択してください。");
	} else {
		//ひっくり返す石リストを取得
		var flipCells = flipSearch(row, column, color, "input");
		//石をひっくり返す
		flip(flipCells, color);
	}
}

//盤面上の枚数をカウントして表示
function countStone(){
	var borad = getBoard();
	var cWhite = 0;
	var cBlack = 0;
	var cEmpty = 0;
	for(var i = 0; i < board.length; i++){
		for(var j = 0; j < board[0].length; j++){
			if(board[i][j] == WHITE){
				cWhite++;
			}else if(board[i][j] == BLACK){
				cBlack++;
			}else if(board[i][j] == EMPTY){
				cEmpty++;
			}
		}
	}
	var txt = "黒 : " + String(cBlack) + "枚 　白 : " + String(cWhite) + "枚";
	//もし空のマスがなくなるか片方の石がなくなってゲーム終了なら
	if(cEmpty == 0 || cWhite == 0 || cBlack == 0){
		txt = "ゲーム終了です！最終結果......" + txt;
	}
	document.getElementById("countStone").innerText = txt;
}