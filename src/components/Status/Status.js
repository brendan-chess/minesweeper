import { useGame } from '../../gameContext'
import './Status.css'

const Status = () => {
  const game = useGame()

  // return game.gameState !== game.READY_STATE && (
  //   <div className='Status-container'>
  //     <div className='Status-flag-icon' />
  //   </div>
  // )
}

export default Status
