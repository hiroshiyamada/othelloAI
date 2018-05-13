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
	insertStoneCount(board);
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
	insertStoneCount(board);
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
	var board = getBoard();
	var row = Number(document.form1.row.value);
	var column = Number(document.form1.column.value);
	var color = Number(document.form1.color.value);
	if (row == 10 || column == 10 || color == 10) {
		alert("行・列・石の色を全て選択してください。");
	} else {
		//ひっくり返す石リストを取得
		var flipCells = flipSearch(board, row, column, color, "input");
		//石をひっくり返す
		flip(board, flipCells, color);
	}
}

//枚数を盤面横に挿入する
function insertStoneCount(board){
	var count = countStone(board);
	var txt = "黒 : " + String(count[1]) + "枚 　白 : " + String(count[0]) + "枚";
	//もし空のマスがなくなるか片方の石がなくなってゲーム終了なら
	if(isEnd(board)){
		txt = "ゲーム終了です！最終結果......" + txt;
	}
	document.getElementById("countStone").innerText = txt;
}