'use strict'

$(function(){
  function Puzzle(state){
    this.state = []
    this.parentState = []
    deepCopy2d(this.state, state)
    deepCopy2d(this.parentState, state)
    this.boundary = false
    this.end = false
  }

  Puzzle.prototype.done = function(){
    this.end = true
  }

  //状態遷移のパターンを生成
  Puzzle.prototype.generate = function(){
    if(this.end) return
    let puzzles = []
    let zeroPos

    //0を走査
    for(let i = 0; i < 3; i++){
      const index = this.state[i].indexOf('0')
      if(index != -1){
        zeroPos = [i, index]
      }
    }

    //左と交換
    if(zeroPos[1] > 0) {
      let left = new Puzzle(this.state)
      left.state[zeroPos[0]][zeroPos[1]] = left.state[zeroPos[0]][zeroPos[1] - 1]
      left.state[zeroPos[0]][zeroPos[1] - 1] = '0'
      if(!deepCompare2d(left.state, this.parentState)){
        if(deepCompare2d(left.state, endState)){
          left.done()
        }
        puzzles.push(left)
      }
    }

    //右と交換
    if(zeroPos[1] < 2) {
      let right = new Puzzle(this.state)
      right.state[zeroPos[0]][zeroPos[1]] = right.state[zeroPos[0]][zeroPos[1] + 1]
      right.state[zeroPos[0]][zeroPos[1] + 1] = '0'
      if(!deepCompare2d(right.state, this.parentState)){
        if(deepCompare2d(right.state, endState)){
          right.done()
        }
        puzzles.push(right)
      }
    }

    //上と交換
    if(zeroPos[0] > 0) {
      let top = new Puzzle(this.state)
      top.state[zeroPos[0]][zeroPos[1]] = top.state[zeroPos[0] - 1][zeroPos[1]]
      top.state[zeroPos[0] - 1][zeroPos[1]] = '0'
      if(!deepCompare2d(top.state, this.parentState)){
        if(deepCompare2d(top.state, endState)){
          top.done()
        }
        puzzles.push(top)
      }
    }

    //下と交換
    if(zeroPos[0] < 2) {
      let bottom = new Puzzle(this.state)
      bottom.state[zeroPos[0]][zeroPos[1]] = bottom.state[zeroPos[0] + 1][zeroPos[1]]
      bottom.state[zeroPos[0] + 1][zeroPos[1]] = '0'
      if(!deepCompare2d(bottom.state, this.parentState)){
        if(deepCompare2d(bottom.state, endState)){
          bottom.done()
        }
        puzzles.push(bottom)
      }
    }

    puzzles[puzzles.length - 1].boundary = true
    return puzzles
  }

  const deepCopy2d = function(dst, src){
    for(let i = 0; i < 3; i++){
      dst[i] = src[i].slice()
    }
  }

  const deepCompare2d = function(src1, src2){
    for(let i = 0; i < 3; i++){
      if(src1.toString() != src2.toString()){
        return false
      }
    }
    return true //同じだったらture
  }

  const generatePattern = function(){
    let row = []
    for(let i = 0; i < statesRow[currentRow].length; i++){
      const patterns = statesRow[currentRow][i].generate()
      if(!patterns) continue
      for(let j = 0; j < patterns.length; j++){
        row.push(patterns[j])
      }
    }
    statesRow.push(row)
    draw(row)
    currentRow++

    if(currentRow < 13){
      setTimeout(generatePattern, 1000)
    }
  }

  const draw = function(row){
    let rowDiv = '<div class="row clearfix">'
    for(let i = 0; i < row.length; i++){
      const state = row[i]
      let colDiv = '<div class="col"'
      if(row[i].boundary){
        colDiv += ' boundary="true"'
      }
      if(row[i].end){
        colDiv += ' end="true"'
      }
      colDiv += '>'
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

  const initialState =  [ [ "2", "5", "3" ],
                          [ "1", "0", "6" ],
                          [ "4", "7", "8" ] ]
  const endState =      [ [ "1", "2", "3" ],
                          [ "4", "5", "6" ],
                          [ "7", "8", "0" ] ]
  let statesRow = []
  statesRow[0] = []
  statesRow[0][0] = new Puzzle(initialState)

  let currentRow = 0

  generatePattern()
})
