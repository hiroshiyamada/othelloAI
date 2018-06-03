//初期の盤面
var initialData = [[2, 2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 0, 1, 2, 2, 2], [2, 2, 2, 1, 0, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2, 2]];
//石の種別
var WHITE = 0;
var BLACK = 1;
var EMPTY = 2;
//盤面生成と枚数表示(送信ボタンが押される度に実行)
var board = getBoard();
createBoard(board);
window.onload = function() {
	insertStoneCount(board);
}
//クリック属性の追加
$(document).on('click', '#table td', function() {
	var turnColor = getTurn();
	//人間の手番(黒)なら手を実行
	if (turnColor == 'black') {
		//行を取得
		var $tag_tr = $(this).parent()[0];
		var row = $tag_tr.rowIndex;
		//列を取得
		var $tag_td = $(this)[0];
		var column = $tag_td.cellIndex;
		var man = manOthello(row, column, BLACK);
		//人間が手を実行し終えたら手番をAIに渡す
		if (man == 1) {
			setPass('0');
			setTurn('white');
			//盤面を更新
			updateBoard();
			document.getElementById("turnText").innerText = 'AI思考中';
		}
		//現在の手番を取得
		var currentColor = getTurn();
		//AIの手番に変わっていたらAI最善手を実行
		if (currentColor == 'white') {
			//AIの一連の処理を実行
			wait(0.5).done(function() {
				//AIの手を実行
				AIOthello('execute');
				setTurn('black');
				//盤面を更新
				updateBoard();
				document.getElementById("turnText").innerText = '人間の手番です';
			});
		}
		console.log("%s行, %s列", row, column);
	} else {
		alert('AIが思考中です。少しお待ち下さい。');
	}
});

// jQueryでSleepする方法
function wait(sec) {
	// jQueryのDeferredを作成します。
	var objDef = new $.Deferred;
	setTimeout(function() {
		// sec秒後に、resolve()を実行して、Promiseを完了します。
		objDef.resolve(sec);
	}, sec * 1000);
	return objDef.promise();
};

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

//手番を取得する
function getTurn() {
	var turn = localStorage.getItem('turnColor');
	if (turn == null) {
		setTurn('black');
		turn = 'black';
	}
	return turn;
}

//パスの状態を取得する
function getPass() {
	var pass = localStorage.getItem('passNum');
	if (pass == null) {
		setPass('0');
		pass = '0';
	}
	return pass;
}

//盤面状態をlocalStorageに保存する
function setBoard(board) {
	var json = JSON.stringify(board);
	localStorage.setItem('board', json);
}

//手番をlocalStorageに保存する
function setTurn(turn) {
	localStorage.setItem('turnColor', turn);
}

//パスの状態をlocalStorageに保存する
function setPass(pass) {
	localStorage.setItem('passNum', pass);
}

//盤面状態をリセットする
function resetBoard() {
	localStorage.removeItem('board');
	localStorage.removeItem('turnColor');
	localStorage.removeItem('passNum');
	board = getBoard();
	createBoard(board);
	insertStoneCount(board);
}

//盤面を更新
function updateBoard() {
	var board = getBoard();
	createBoard(board);
	insertStoneCount(board);
}

//人間の手番をパスする
function passBlack() {
	//盤面を取得
	var board = getBoard();
	var pList = getPossiblePosition(board, BLACK);
	//置ける場所がない場合はパス状態を更新
	if (pList.length == 0) {
		alert("パスしてAIに手番を渡します。");
		changePass();
		//AIの手を実行
		AIOthello('execute');
		setTurn('black');
		//盤面を更新
		updateBoard();
		document.getElementById("turnText").innerText = '人間の手番です';
	} else {
		//手が指せる場合はパスの状態を0に戻す
		alert("人間が指せる手があります。手を指してください。");
	}
}

//盤面の書き込み
function createBoard(data) {
	var div = document.getElementById("table");

	var board = "";
	board += "<table id=\"board\">";
	for (var i = 0; i < data.length; i++) {
		board += "<tr>";
		for (var j = 0; j < data[0].length; j++) {
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
			//}
		}
		board += "</tr>";
	}
	board += "</table>";

	div.innerHTML = board;
}

//人間の手を実行する
function manOthello(row, column, color) {
	var board = getBoard();
	//終了状態だったら何もしない
	if (isEnd(board)) {
		return 0;
	}
	//var row = Number(document.form1.row.value);
	//var column = Number(document.form1.column.value);
	//var color = Number(document.form1.color.value);
	if (row == 10 || column == 10 || color == 10) {
		alert("行・列・石の色を全て選択してください。");
		return 0;
	} else {
		//ひっくり返す石リストを取得
		var flipCells = flipSearch(board, row, column, color, "input");
		//石が置けない場所を選択している場合は0を返す
		if (flipCells == 0) {
			return 0;
		} else {
			//石をひっくり返す
			flip(board, flipCells, color);
		}
	}
	return 1;
}

//枚数を盤面横に挿入する
function insertStoneCount(board) {
	var count = countStone(board);
	var txt = "黒 : " + String(count[1]) + "枚 　白 : " + String(count[0]) + "枚";
	//もし空のマスがなくなるか片方の石がなくなってゲーム終了なら
	if (isEnd(board)) {
		txt = "ゲーム終了です！最終結果......" + txt;
		wait(0.5).done(function() {
			alert(txt);
		});
	}
	document.getElementById("countStone").innerText = txt;
}