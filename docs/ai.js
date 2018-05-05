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

