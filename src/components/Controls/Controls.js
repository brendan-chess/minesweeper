import './Controls.css'
import { useGame } from '../../gameContext'

const Controls = () => {
  const game = useGame() 

  const onClickFlag = () => {
    if(game.activeControl === game.ACTIVE_DIG) {
      game.setActiveControl(game.ACTIVE_FLAG)
    }
  }

  const onClickDig = () => {
    if(game.activeControl === game.ACTIVE_FLAG) {
      game.setActiveControl(game.ACTIVE_DIG)
    }
  }

  return game.gameState !== game.READY_STATE && (
    <div className='Controls-container Field-fade-in'>
      <div 
        className={'Controls-box Controls-flag ' + (game.activeControl === game.ACTIVE_FLAG ? 'Controls-active ' : '')} 
        onClick={onClickFlag}
      />
      <div 
        className={'Controls-box Controls-dig ' + (game.activeControl === game.ACTIVE_DIG ? 'Controls-active ' : '')}
        onClick={onClickDig} 
      />
    </div>
  )
}

export default Controls
