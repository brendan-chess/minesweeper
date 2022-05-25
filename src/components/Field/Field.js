import { useEffect, useState } from 'react'
import './Field.css'
import Tile from '../Tile/Tile'
import { useGame } from '../../gameContext'

const initializeDangers = (size) => {
  return new Array(size * size).fill(-1)
}

const initializeFlags = (size) => {
  return new Array(size * size).fill(0)
}

const Field = () => {
  const game = useGame()

  const initializeMines = () => {
    let count = 0
  
    // change to difficulty
    switch(game.size) {
      case 9:
        count = 10
        break
      case 15:
        count = 40
        break
      case 25:
        count = 60
        break
    }
  
    let indices = []
  
    let i = 0
    while(i < count) {
      let randomIndex = Math.floor(Math.random() * game.size * game.size)
      if(!indices.includes(randomIndex)) {
        indices.push(randomIndex)
        i++
      }
    }
  
    let mines = new Array(game.size * game.size).fill(0)
  
    for(let j = 0; j < count; j++) {
      let index = indices[j]
      mines[index] = 1
    }
  
    return { mines, minesReduced: indices }
  }

  useEffect(() => {
    if(game.gameState === game.PLAYING_STATE) {
      const { mines, minesReduced } = initializeMines()
      game.setMines(mines)
      game.setMinesReduced(minesReduced)
      game.setDangers(initializeDangers(game.size))
      game.setFlags(initializeFlags(game.size))
      game.setFlagsReduced([])
      game.setRevealedCount(0)
    }
  }, [game.setMines, game.setDangers, game.size, game.setFlags, game.gameState, game.setMinesReduced])

  const drawTiles = () => {
    let tiles = []
  
    for(let row = 0; row < game.size; row++) {
      let currentRow = []
  
      for(let column = 0; column < game.size; column++) {
        let index = (row * game.size) + column
        currentRow.push(<Tile key={index} id={index} mine={game.mines[index]} danger={game.dangers[index]} flag={game.flags[index]} />)
      }
  
      tiles.push(<div key={row} className='Field-row'>{currentRow}</div>)
    }
  
    return tiles
  }

  const checkIfWon = () => {
    if(game.minesReduced.length > 0) {
      let won = true
      // conditions for winning:
      // number of tiles - number of mines = number revealed (all tiles revealed or flagged)
      // flags = minesReduced
  

      if(!game.dangers.includes(-1)) {
        // todo: change to check equality of minesReduced and flagsReduced
        // without that, covering the board in flags wins
        game.minesReduced.every(index => {
          const correctFlag = game.flags[index] === 1
          if(!correctFlag) won = false
          return correctFlag
        })
      } else won = false
  
      if(won) {
        game.setGameState(game.WON_STATE)
        game.setRunTimer(false)
      } 
    }
  }
  
  useEffect(checkIfWon, [game.dangers, game.flags, game.minesReduced, game.revealedCount, game.setGameState, game.size])

  return game.mines && (
    <div className='Field-container Field-fade-in'>
      <div className={game.gameState === game.PLAYING_STATE ? null : 'Field-overlay'}>
        {drawTiles()}
      </div>
    </div>
  )
}

export default Field