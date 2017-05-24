function Puzzle(state){
  this.state = state //2次元配列
}

//状態遷移のパターンを生成
//最大4つの２次元配列を返す
//直前の状態に戻らない
//正解したら終了したい
Puzzle.prototype.generate = function(){
  let states = [] //Puzzleの配列
  let zeroPos

  //0を走査
  for(let i = 0; i < 3; i++){
    const index = this.state[i].indexOf('0')
    if(index != -1){
      zeroPos = [i, index]
    }
  }

  //上下左右の数字と交換した状態を生成、配列にぶっこむ
  //左→右→上→下の順
  //親の状態(this.state)とカブらないようにする

  //concatで値渡し
  let leftState = this.state.concat()
  let rightState = this.state.concat()
  let topState = this.state.concat()
  let bottomState = this.state.concat()

  //0の場所に左隣の数を入れる→0を左に入れる
  try {
    console.log(zeroPos[1])
    leftState[zeroPos[0]][zeroPos[1]] = leftState[zeroPos[0]][zeroPos[1] - 1]
    leftState[zeroPos[0]][zeroPos[1] - 1] = '0'
  } catch(e) {
    leftState = undefined
  }

  // try {
  //   rightState[zeroPos[0]][zeroPos[1]] = rightState[zeroPos[0]][zeroPos[1] + 1]
  //   rightState[zeroPos[0]][zeroPos[1] + 1] = '0'
  // } catch(e) {
  //   rightState = undefined
  // }
  //
  // try {
  //   topState[zeroPos[0]][zeroPos[1]] = topState[zeroPos[0] + 1][zeroPos[1]]
  //   topState[zeroPos[0] + 1][zeroPos[1]] = '0'
  // } catch(e) {
  //   topState = undefined
  // }
  //
  // try {
  //   bottomState[zeroPos[0]][zeroPos[1]] = bottomState[zeroPos[0] - 1][zeroPos[1]]
  //   bottomState[zeroPos[0] - 1][zeroPos[1]] = '0'
  // } catch(e) {
  //   bottomState = undefined
  // }

  console.log(leftState)

  if(leftState) states.push(new Puzzle(leftState))
  if(rightState) states.push(new Puzzle(rightState))
  // if(topState) states.push(new Puzzle(topState))
  // if(bottomState) states.push(new Puzzle(bottomState))

  return states
}

$(function(){
  const initialState =  [ [ "2", "5", "3" ],
                          [ "1", "0", "6" ],
                          [ "4", "7", "8" ] ]
  let statesRow = [] //Puzzleの2次元配列
  statesRow[0] = []
  statesRow[0][0] = new Puzzle(initialState) //1段目

  /*
  * [row
  *  [Puzzle, Puzzle, ...]
  *  [Puzzle, Puzzle, ...]
  * ]
  *
  */

  let currentRow = 0

  const generatePattern = function(){
    let row = [] //あるタイミングの状態の集合 0回目、1回目、2回目、、、n
    for(let i = 0; i < statesRow[currentRow].length; i++){ //1stateごとに次に取り得る状態を列挙して、statesにpush
      const pattern = statesRow[currentRow][i].generate()
      console.log(pattern)
      for(let j = 0; j < pattern.length; j++){
        row.push(pattern[j])
      }
    }
    statesRow.push(row) //段が増えていく
    draw(row)
    currentRow++

    if(currentRow < 2){
      setTimeout(generatePattern, 1000)
    }
  }

  //HTMLに描画
  //画面に対して中央揃え
  //親毎に縦線を引く
  //背景色でもいい
  //1段ごとに描画
  const draw = function(row){
    /*
    * body
    *  div(row)
    *    div(col), div(col), ...
    *  div(row)
    *    div(col), div(col), ...
    *  div(row)
    *    div(col), div(col), ...
    */

    let rowDiv = '<div class="row clearfix">'
    for(let i = 0; i < row.length; i++){
      const state = row[i]
      let colDiv = '<div class="col">'
      for(let j = 0; j < 3; j++){
        let stateRowDiv = '<div>'
        for(let k = 0; k < 3; k++){
          stateRowDiv += row[i].state[j][k]
          stateRowDiv += ' '
        }
        stateRowDiv += '</div>'
        colDiv += stateRowDiv
      }
      colDiv += '</div>'
      rowDiv += colDiv
    }
    rowDiv += '</div>'
    $('body').append(rowDiv)
  }


  generatePattern()
})
