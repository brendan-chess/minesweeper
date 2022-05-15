import './Menu.css'
import { useGame } from '../../gameContext'

const renderMenu = (gameState, setGameState) => {
  switch(gameState) {
    case 'ready':
      return (
        <div className='Menu-play'>
          <div className='Menu-play-title' onClick={() => setGameState('playing')}>Play</div>
          <div className='Menu-play-subtitle'>🚧 Work in progress! 🚧</div>
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

const Menu = () => {
  const { gameState, setGameState } = useGame()

  return <div className='Menu-container'>{renderMenu(gameState, setGameState)}</div>
}

export default Menu
