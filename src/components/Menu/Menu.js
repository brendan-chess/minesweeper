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

const getDifficultyColor = (difficulty) => {
  // switch(difficulty) {
  //   case 0:
  //     return 'Menu-difficulty-easy'
  //   case 1:
  //     return 'Menu-difficulty-medium'
  //   case 2:
  //     return 'Menu-difficulty-hard'
  // }
}

const Menu = () => {
  const [fadeOut, setFadeOut] = useState(false)
  // const [difficulty, setDifficulty] = useState(0)
  const game = useGame()
  const [openUnderline, setOpenUnderline] = useState(false)

  const updateDifficulty = () => {
    // Transition: Easy -> Medium -> Hard -> Easy...
    switch(game.difficulty) {
      case game.EASY_DIFFICULTY:
        game.setDifficulty(game.MEDIUM_DIFFICULTY)
        game.setSize(game.MEDIUM_SIZE)
        break
      case game.MEDIUM_DIFFICULTY:
        game.setDifficulty(game.HARD_DIFFICULTY)
        game.setSize(game.HARD_SIZE)
        break
      case game.HARD_DIFFICULTY:
        game.setDifficulty(game.EASY_DIFFICULTY)
        game.setSize(game.EASY_SIZE)
        break
      default:
        game.setDifficulty(game.EASY_DIFFICULTY)
        game.setSize(game.EASY_SIZE)
    }
  }

  const renderMenu = () => {
    switch(game.gameState) {
      case game.READY_STATE:
        return (
          <div 
            className={'Menu-play ' + (fadeOut ? 'Menu-fade-out ' : '')}
            onAnimationEnd={() => {
              if(fadeOut) game.setGameState(game.PLAYING_STATE)
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
                className={'Menu-difficulty-selection ' + getDifficultyColor(game.difficulty)}
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
            <div className='Menu-instructions-text '>Left-click to dig a tile. Right-click to place a flag. To win, cover all mines with flags and dig all remaining tiles.</div>
          </div>
        )
      case game.LOST_STATE:
        return (
          <div className='Menu-lost'>
            <div className='Menu-lost-title'>You lost</div> 
            <div 
              className='Menu-button '
              onClick={() => game.setGameState(game.PLAYING_STATE)}
            >
              Play Again ➜
            </div>
          </div>
        )
      case game.WON_STATE:
        return (
          <div className='Menu-won'>
            <div className='Menu-won-title'>You won</div> 
            <div 
              className='Menu-play-title' onClick={() => game.setGameState(game.PLAYING_STATE)}>Play again</div>
          </div>
        )
      default: return null
    }
  }

  return <div className='Menu-container'>{renderMenu()}</div>
}

export default Menu
