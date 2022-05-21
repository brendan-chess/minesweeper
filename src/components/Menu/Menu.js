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
  const { gameState, setGameState } = useGame()
  const [fadeOut, setFadeOut] = useState(false)
  // const [difficulty, setDifficulty] = useState(0)
  const game = useGame()
  const [openUnderline, setOpenUnderline] = useState(false)

  const updateDifficulty = () => {
    switch(game.difficulty) {
      case 0:
        game.setDifficulty(1)
        game.setSize(15) // Medium size
        break
      case 1:
        game.setDifficulty(2)
        game.setSize(25) // Hard size
        break
      case 2:
        game.setDifficulty(0)
        game.setSize(9) // Easy size
        break
      default:
        game.setDifficulty(0)
        game.setSize(9)
    }
  }

  const renderMenu = () => {
    switch(gameState) {
      case 'ready':
        return (
          <div 
            className={'Menu-play ' + (fadeOut ? 'Menu-fade-out ' : '')}
            onAnimationEnd={() => {
              if(fadeOut) setGameState('playing')
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
      case 'lost':
        return (
          <div className='Menu-lost'>
            <div className='Menu-lost-title'>You lost</div> 
            <div className='Menu-play-title' onClick={() => setGameState('playing')}>Play again</div>
          </div>
        )
      case 'won':
        return (
          <div className='Menu-won'>
            <div className='Menu-won-title'>You won</div> 
            <div className='Menu-play-title' onClick={() => setGameState('playing')}>Play again</div>
          </div>
        )
      default: return null
    }
  }

  return <div className='Menu-container'>{renderMenu()}</div>
}

export default Menu
