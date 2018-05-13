//中盤までの各マスの盤面評価点数
var evaluateData = [[45, -20, 4, -1, -1, 4, -20, 45], [-11, -40, -1, -3, -3, -1, -40, -11], [4, -1, 2, -1, -1, 2, -1, 4], [-1, -3, -1, 0, 0, -1, -3, -1], [-1, -3, -1, 0, 0, -1, -3, -1], [4, -1, 2, -1, -1, 2, -1, 4], [-40, -16, -1, -3, -3, -1, -40, -11], [45, -20, 4, -1, -1, 4, -20, 45]];
var blackData = [[-80, -10, -30, -30, -30, -30, -10, -80], [-10, 0, 0, 0, 0, 0, 0, -10], [-30, 0, 0, 0, 0, 0, 0, -30], [-30, 0, 0, 0, 0, 0, 0, -30], [-30, 0, 0, 0, 0, 0, 0, -30], [-30, 0, 0, 0, 0, 0, 0, -30], [-10, 0, 0, 0, 0, 0, 0, -10], [-80, -10, -30, -30, -30, -30, -10, -80]];
//端の形のよさによる点数
var lineScore = {"xxx" : 100, ".xx" : 100, "..x" : 100, "x.x" : 100, "x.." : 10, "..." : 0, "xx." : -50, ".x." : -50};

//石の置ける場所リストを取得
function getPossiblePosition(board, color) {
	//石が置ける場所リスト
	var pStonePosition = [];
	//全盤面に対して石が置ける場所を選ぶ
	for (var row = 0; row < board.length; row++) {
		for (var column = 0; column < board[0].length; column++) {
			var cells = flipSearch(board, row, column, color, "search");
			//もし石が置ける場合は場所リストに追加
			if (cells.length > 0) {
				pStonePosition.push([row, column]);
			}
		}
	}
	return pStonePosition;
}

//盤面を評価して点数の合計を返す(白色側から見た点数)
function evalScore_data(board){
	var color = WHITE;
	var score = 0;
	for (var row = 0; row < board.length; row++) {
		for (var column = 0; column < board[0].length; column++) {
			if(board[row][column] == color){
				score += evaluateData[row][column];
			//黒が端を取っている場合にはスコアをマイナス
			}else if(board[row][column] == BLACK){
				score += blackData[row][column];
			}
		}
	}
	return score;
}

//盤面を評価して点数の合計を返す(白色側から見た点数)
function evalScore(board){
	//形のよさにかける係数
	var k = 3;
	//着手可能数によるスコア
	var pos = posScore(board);
	//隅の形によるスコア
	var fig = getFigScore(board, WHITE) - getFigScore(board, BLACK);
	//盤面を評価した点数
	var score = pos + k * fig;
	console.log("evalScore: " + String(score));
	return score;
}

//白の着手可能数から黒の着手可能数を引いて返す
function posScore(board){
	var white = getPossiblePosition(board, WHITE);
	var black = getPossiblePosition(board, BLACK);
	return 100 * (white.length - black.length);
}

//隅の形の良さによるスコアを返す
function getFigScore(board, color){
	//形を考慮しないスコア
	//var score = evalScore_data(board);
	var score = 0;
	//形を示す文字列
	var str;
	//左上
	//左上の横3つ
	str = "";
	for(var i = 0; i <= 2; i++){
		str += board[0][2-i] == color ? "x" : ".";
	}
	score += lineScore[str];
	//左上の斜め3つ
	str = "";
	for(var i = 0; i <= 2; i++){
		str += board[2-i][2-i] == color ? "x" : ".";
	}
	score += lineScore[str];
	//左上の縦3つ
	str = "";
	for(var i = 0; i <= 2; i++){
		str += board[2-i][0] == color ? "x" : ".";
	}
	score += lineScore[str];
	//左下
	//左下の横3つ
	str = "";
	for(var i = 0; i <= 2; i++){
		str += board[7][2-i] == color ? "x" : ".";
	}
	score += lineScore[str];
	//左下の斜め3つ
	str = "";
	for(var i = 0; i <= 2; i++){
		str += board[i+5][2-i] == color ? "x" : ".";
	}
	score += lineScore[str];
	//左下の縦3つ
	str = "";
	for(var i = 0; i <= 2; i++){
		str += board[i+5][0] == color ? "x" : ".";
	}
	score += lineScore[str];
	//右上
	//右上の横3つ
	str = "";
	for(var i = 0; i <= 2; i++){
		str += board[0][i+5] == color ? "x" : ".";
	}
	score += lineScore[str];
	//右上の斜め3つ
	str = "";
	for(var i = 0; i <= 2; i++){
		str += board[2-i][i+5] == color ? "x" : ".";
	}
	score += lineScore[str];
	//右上の縦3つ
	str = "";
	for(var i = 0; i <= 2; i++){
		str += board[2-i][7] == color ? "x" : ".";
	}
	//右下
	//右下の横3つ
	str = "";
	for(var i = 0; i <= 2; i++){
		str += board[7][i+5] == color ? "x" : ".";
	}
	score += lineScore[str];
	//右下の斜め3つ
	str = "";
	for(var i = 0; i <= 2; i++){
		str += board[i+5][i+5] == color ? "x" : ".";
	}
	score += lineScore[str];
	//右下の縦3つ
	str = "";
	for(var i = 0; i <= 2; i++){
		str += board[i+5][7] == color ? "x" : ".";
	}
	score += lineScore[str];
	return score;		
}



//AIの最善手の行と列を探索して返す(ネガアルファ法)
function searchAIPosition(board, color, depth, alpha, mode){
	//最善手を格納
	var maxRow = 10;
	var maxColumn = 10;
	//最大スコアを格納
	var maxScore = -10000;
	//色の石が置ける場所リストを取得
	var position = getPossiblePosition(board, color);
	//深さがゼロになるか、指せる手がなくなった場合
	if(depth == 0 || position.length == 0){
		//盤面のスコアを計算して返す。手は適当な値。
		if(mode == "eval"){
			//ネガアルファのため、葉が黒の時は点数の符号を逆転
			maxScore = color == WHITE ? evalScore(board) : -evalScore(board);
			alpha = color == WHITE ? alpha : -alpha;
		//終盤は石の数で評価
		}else if(mode == "full"){
			var stone = countStone(board);
			var diffStone = stone[0] - stone[1];
			//ネガアルファのため、葉が黒の時は点数の符号を逆転
			maxScore = color == WHITE ? diffStone : -diffStone;
		}
		console.log("leaf!! " + String(maxScore));
		return [maxRow, maxColumn, maxScore];
	}
	//場所リストに対して盤面評価点数の最大値を取得
	for(var i = 0; i < position.length; i++){
		//候補手
		var row = Number(position[i][0]);
		var column = Number(position[i][1]);
		//候補手を入力し終わった盤面
		var nextBoard = nextMap(board, row, column, color);
		//盤面が終了状態であった場合
		/*if(isEnd(board)){
			//もし最終状態が勝ちであった場合
			if(getWinner(board) == WHITE){
				//現候補手を最大スコアとして返す
				return [row, column, 1000];
			}
		}*/
		//次の手用に色を反転させる
		var nextColor = color == WHITE ? BLACK : WHITE;
		//次の手の最大スコアを再帰で返す		
		var nextResult = searchAIPosition(nextBoard, nextColor, depth - 1, -maxScore, mode);
		console.log(nextResult);
		//ネガアルファ用に反転
		var nextScore = - nextResult[2];
		console.log("nextScore: " + String(nextScore) + " Row: " + String(row) + " Column: " + String(column));
		//次の手のスコアが現状の最大スコアよりも大きかったら最善手と最大スコアに格納
		if(nextScore > maxScore){
			maxScore = nextScore;
			maxRow = row;
			maxColumn = column;
			console.log("maxS: " + String(maxScore) + " Row: " + String(row) + " Column: " + String(column));
		}
		console.log("alpha: " + String(alpha));
		//最大スコアがアルファを超えたらカット
		if(maxScore >= alpha){
			break;
		}
	}
	return [maxRow, maxColumn, maxScore];
}

//AI最善手を実行する
function AIOthello(mode) {
	var board = getBoard();
	//枚数をカウントして、終盤(空のマスが12枚以下)なら残りを全探索
	var stones = countStone(board);
	if(stones[2] > 12){
		//5手先を読む
		var depth = 5;
		var searchMode = "eval";
	}else{
		//全探索
		var depth = 20;
		var searchMode = "full";
	}
	//ネガアルファ枝刈りの設定
	var alpha = 2000;
	//盤面をコピーする
	var copy = cpBoard(board);
	//AI最善手の場所を取得
	var position = searchAIPosition(copy, WHITE, depth, alpha, searchMode);
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
		var flipCells = flipSearch(board, row, column, WHITE, "input");
		//石をひっくり返す
		flip(board, flipCells, WHITE);
	}
}

//盤面をコピーする
function cpBoard(board){
	var cp = new Array(board.length);
	for (var row = 0; row < board.length; row++) {
		cp[row] = new Array(board[0].length);
		for (var column = 0; column < board[0].length; column++) {
			cp[row][column] = board[row][column];
		}
	}
	return cp;
}

//ひっくり返すことのできる石を探索して返す
function flipSearch(board, row, column, color, mode) {
	//ひっくり返す石の位置を格納する
	var flipCells = [];
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
function flip(board, cells, color) {
	//石をひっくり返す処理
	for (var i = 0; i < cells.length; i++) {
		board[cells[i][0]][cells[i][1]] = color;
	}
	//盤面に設定
	setBoard(board);
}

//盤面上の枚数をカウントして返す
function countStone(board){
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
	return [cWhite, cBlack, cEmpty];
}

//一手進んだ際の盤面を返す
function nextMap(board, row, column, color){
	//ひっくり返す石リストを取得
	var cells = flipSearch(board, row, column, color, "search");
	//盤をコピー
	var nextBoard = cpBoard(board);
	//石をひっくり返す
	for (var i = 0; i < cells.length; i++) {
		nextBoard[cells[i][0]][cells[i][1]] = color;
	}
	return nextBoard;
}

//ゲームが終了したかどうかを返す
function isEnd(board) {
  var count = countStone(board);
  if(count[0] == 0 || count[1] == 0 || count[2] == 0){
  	return 1;
  }
  return 0;
}

//勝者の色を返す
function getWinner(board){
	var count = countStone(board);
	if(isEnd(board)){
		//白色(AI)が勝っていたら
		if(count[0] >= count[1]){
			return 0;
		//黒色(人間)が勝っていたら
		}else{
			return 1;
		}
	}
	//ゲームが終了していなかったら
	return 2;
}

