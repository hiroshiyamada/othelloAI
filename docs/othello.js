//初期の盤面
var initialData = [[2, 2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 0, 1, 2, 2, 2], [2, 2, 2, 1, 0, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2, 2]];
//石の種別
var WHITE = 0;
var BLACK = 1;
var EMPTY = 2;
//盤面生成(送信ボタンが押される度に実行)
var board = getBoard();
createBoard(board);

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

//ひっくり返すことのできる石を探索して返す
function flipSearch(row, column, color, mode) {
	//ひっくり返す石の位置を格納する
	var flipCells = [];
	//盤面の状態
	var board = getBoard();
	//既に石が置いてある場合
	if (board[row][column] != EMPTY) {
		//実際に手を入力する場合はアラートを出す
		if (mode == "input") {
			alert("石が置ける場所を選択してください。");
		}
		return 0;
	}
	//上下左右斜めの8方向を順番に調べてひっくり返す
	for (var drow = -1; drow <= 1; drow++) {
		for (var dcolumn = -1; dcolumn <= 1; dcolumn++) {
			//自分の現在地は何もしない
			if (drow == 0 && dcolumn == 0) {
				continue;
			}
			//壁の端まで上下左右斜めを延長して調べていく
			for (var i = 1; i < initialData.length; i++) {
				var nrow = row + i * drow;
				var ncolumn = column + i * dcolumn;
				//壁の端に到達してしまった場合は処理中止して次へ
				if (nrow < 0 || nrow >= initialData.length || ncolumn < 0 || ncolumn >= initialData.length) {
					break;
				}
				//移動した位置の石を取得
				var cell = board[nrow][ncolumn];
				//2つ以上延長した際の石がプレイヤーと同じ色の石だった場合
				if (cell == color && i >= 2) {
					//自分と間にある石をひっくり返すべき石として格納
					for ( j = 0; j < i; j++) {
						flipCells.push([row + j * drow, column + j * dcolumn]);
					}
				}
				//プレイヤーと同じ石か何も置いていない部分に到達してしまった場合は処理中止して次へ
				if (cell == color || cell == 2) {
					break;
				}
			}
		}
	}
	//ひっくり返すべき石が見つからなかった場合
	if (flipCells.length == 0) {
		if (mode == "input") {
			alert("石が置ける場所を選択してください。");
		}
		return 0;
	}
	return flipCells;
}

//石をひっくり返す関数
function flip(cells, color) {
	//石をひっくり返す処理
	for (var i = 0; i < cells.length; i++) {
		board[cells[i][0]][cells[i][1]] = color;
	}
	//盤面に設定
	setBoard(board);
}
