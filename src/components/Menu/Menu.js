import './Menu.css'
import { useGame } from '../../gameContext'
import { useState } from 'react';

const renderDifficulty = (difficulty) => {
  switch(difficulty) {
    case 0:
      return 'Easy'
    case 1:
      return 'Medium'
    case 2:
      return 'Hard'
    default:
      return ''
  }
}

const Menu = () => {
  const [fadeOut, setFadeOut] = useState(false)
  // const [difficulty, setDifficulty] = useState(0)
  const game = useGame()
  const [openUnderline, setOpenUnderline] = useState(false)

  const getFlagsCorrect = () => {
    let flagsCorrect = 0

    // might be able to do this more efficiently
    game.flagsReduced.forEach(flag => {
      if(game.minesReduced.includes(flag)) flagsCorrect++
    })

    return Math.round((flagsCorrect / game.minesReduced.length) * 100)
  }

  const getSpaceCleared = () => {
    const unrevealedTileCount = game.dangers.reduce((previousValue, currentValue) => {
      if(currentValue === -1) return previousValue + 1
      return previousValue
    }, 0)

    const clearedTileCount = (game.size * game.size) - unrevealedTileCount

    return Math.round((clearedTileCount / (game.size * game.size)) * 100)
  }

  const updateDifficulty = () => {
    // Transition: Easy -> Medium -> Hard -> Easy...
    switch(game.difficulty) {
      case game.EASY_DIFFICULTY:
        game.setDifficulty(game.MEDIUM_DIFFICULTY)
        break
      case game.MEDIUM_DIFFICULTY:
        game.setDifficulty(game.HARD_DIFFICULTY)
        break
      case game.HARD_DIFFICULTY:
        game.setDifficulty(game.EASY_DIFFICULTY)
        break
      default:
        game.setDifficulty(game.EASY_DIFFICULTY)
    }
  }

  const onPlay = () => {
    switch(game.difficulty) {
      case game.EASY_DIFFICULTY:
        game.setSize(game.EASY_SIZE)
        break
      case game.MEDIUM_DIFFICULTY:
        game.setSize(game.MEDIUM_SIZE)
        break
      case game.HARD_DIFFICULTY:
        game.setSize(game.HARD_SIZE)
        break
      default:
        game.setSize(game.EASY_SIZE)
    }
    game.setGameState(game.PLAYING_STATE)
  }

  const renderMenu = () => {
    switch(game.gameState) {
      case game.READY_STATE:
        return (
          <div 
            className={'Menu-play ' + (fadeOut ? 'Menu-fade-out ' : '')}
            onAnimationEnd={() => {
              if(fadeOut) {
                game.setGameState(game.PLAYING_STATE)
                onPlay()
              }
            }}
          >
            <div className='Menu-play-title '>Minesweeper</div>
            <div 
              className='Menu-button '
              onClick={() => setFadeOut(true)}
            >
              Start ➜
            </div>
            <div className='Menu-difficulty'>
              <div 
                className={'Menu-difficulty-selection'}
                onMouseEnter={() => setOpenUnderline(true)}
                onMouseLeave={() => setOpenUnderline(false)}
                onClick={updateDifficulty}
              >
                {renderDifficulty(game.difficulty)}
              </div>
              <div 
                className={'Menu-difficulty-underline ' + (openUnderline ? 'Menu-difficulty-open-underline' : '')}
              />
            </div>
            <div className='Menu-instructions-title '>Instructions</div>
            {/* <div className='Menu-instructions-text '>Left-click to dig a tile. A tile may have a number, which describes how many mines are present within its neighboring tiles. Right-click to place a flag. To win, cover all mines with flags and dig all remaining tiles.</div> */}
            <p className='Menu-instructions-text '>- Left-click to dig a tile</p>
            <p className='Menu-instructions-text '>- A tile may have a number, which describes how many mines are present among its 8 neighboring tiles</p>
            <p className='Menu-instructions-text '>- Right-click to place a flag</p>
            <p className='Menu-instructions-text '>- To win, cover all mines with flags and dig all remaining tiles</p>
          </div>
        )
      case game.LOST_STATE:
      case game.WON_STATE:
        const won = game.gameState === game.WON_STATE
        return (
          <div className='Menu-replay'>            
            <div className='Menu-replay-title'>{won ? 'You won' : 'You lost'}</div> 
            <div className='Menu-flags-correct'>
              <div className='Menu-flags-correct-icon' />
              <div className='Menu-flags-correct-text'>{getFlagsCorrect()}% correct</div>
            </div>
            <div className='Menu-space-cleared'>
              <div className='Menu-space-cleared-icon' />
              <div className='Menu-space-cleared-text'>{getSpaceCleared()}% cleared</div>
            </div>
            <div 
              className='Menu-button-small'
              onClick={onPlay}
            >
              Play Again ➜
            </div>
            {/* <div className='Menu-difficulty Menu-replay-difficulty'>
              <div 
                className={'Menu-difficulty-selection Menu-replay-difficulty-selection'}
                onMouseEnter={() => setOpenUnderline(true)}
                onMouseLeave={() => setOpenUnderline(false)}
                onClick={updateDifficulty}
              >
                {renderDifficulty(game.difficulty)}
              </div>
              <div 
                className={'Menu-difficulty-underline ' + (openUnderline ? 'Menu-difficulty-open-underline' : '')}
              />
            </div> */}
          </div>
        )
      default: return null
    }
  }

  return <div className='Menu-container'>{renderMenu()}</div>
}

export default Menu
