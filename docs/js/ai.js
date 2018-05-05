//中盤までの各マスの盤面評価点数
var evaluateData = [[45, -11, 4, -1, -1, 4, -11, 45], [-11, -16, -1, -3, -3, -1, -16, -11], [4, -1, 2, -1, -1, 2, -1, 4], [-1, -3, -1, 0, 0, -1, -3, -1], [-1, -3, -1, 0, 0, -1, -3, -1], [4, -1, 2, -1, -1, 2, -1, 4], [-11, -16, -1, -3, -3, -1, -16, -11], [45, -11, 4, -1, -1, 4, -11, 45]];

//石の置ける場所リストを取得
function getPossiblePosition(color) {
	//石が置ける場所リスト
	var pStonePosition = [];
	//現在の盤面を取得
	var board = getBoard();
	//全盤面に対して石が置ける場所を選ぶ
	for (var row = 0; row < board.length; row++) {
		for (var column = 0; column < board[0].length; column++) {
			var cells = flipSearch(row, column, color, "search");
			//もし石が置ける場合は場所リストに追加
			if (cells.length > 0) {
				pStonePosition.push([row, column]);
			}
		}
	}
	return pStonePosition;
}

//AIの最善手の行と列を探索して返す
function searchAIPosition(){
	//白色の石が置ける場所リストを取得
	var position = getPossiblePosition(WHITE);
	//最大スコアを格納
	var maxScore = -1000;
	var maxRow = 10;
	var maxColumn = 10;
	//場所リストに対して盤面評価点数の最大値を取得
	for(var i = 0; i < position.length; i++){
		var row = Number(position[i][0]);
		var column = Number(position[i][1]);
		if(maxScore < evaluateData[row][column]){
			maxScore = evaluateData[row][column];
			maxRow = row;
			maxColumn = column;
		}
	}
	return [maxRow, maxColumn, maxScore];
}

//AI最善手を実行する
function AIOthello(mode) {
	//AI最善手の場所を取得
	var position = searchAIPosition();
	//手がない場合はalert表示して終了
	if(position[0] == 10){
		alert("AIが指せる手がありません。");
		return 0;
	}
	//AI最善手の行, 列, スコア
	var row = position[0];
	var column = position[1];
	var score = position[2];
	//表示モードの場合は最善手を表示
	if(mode == "view"){
		//表示するAI最善手のテキスト
		var txt = "AI最善手: " + "abcdefgh"[row] + "-" + "12345678"[column] + " AIスコア: " + String(score);
		document.getElementById("AIStone").innerText = txt;
	}
	//実行モードの場合は石をひっくり返す
	else if(mode == "execute"){
		//ひっくり返す石リストを取得
		var flipCells = flipSearch(row, column, WHITE, "input");
		//石をひっくり返す
		flip(flipCells, WHITE);
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

