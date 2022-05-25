import './Tile.css'
import { useGame } from '../../gameContext'

const Tile = ({ id, mine, danger, flag }) => {
  const game = useGame()

  const reveal = () => {
    let queue = []
    let visited = []
    let count = 0
  
    queue.push(id)
    visited.push(id)
  
    let dangerUpdates = {}
  
    if(game.mines[id] === 1) dangerUpdates[id] = 9
    else {
      while(queue.length > 0) {
        const tile = queue.shift()
  
        // Find adjacent tiles
        const adjacent = []
        let danger = 0
  
        // Left
        if(tile % game.size !== 0) {
          const left = tile - 1
          adjacent.push(left)
          if(game.mines[left] === 1) danger++
        }
  
        // Right
        if((tile + 1) % game.size !== 0){
          const right = tile + 1
          adjacent.push(right)
          if(game.mines[right] === 1) danger++
        }
  
        // Top
        if(tile >= game.size) {
          const top = tile - game.size
          adjacent.push(top)
          if(game.mines[top] === 1) danger++
        }
  
        // Bottom
        if(tile < (game.size * game.size) - game.size) {
          const bottom = tile + game.size
          adjacent.push(bottom)
          if(game.mines[bottom] === 1) danger++
        } 
  
        // Top left
        if(tile >= game.size && tile % game.size !== 0) {
          const topLeft = tile - game.size - 1
          adjacent.push(topLeft)
          if(game.mines[topLeft] === 1) danger++
        }
  
        // Top right
        if(tile >= game.size && (tile + 1) % game.size !== 0) {
          const topRight = tile - game.size + 1
          adjacent.push(topRight)
          if(game.mines[topRight] === 1) danger++
        }
        
        // Bottom left
        if(tile < (game.size * game.size) - game.size && tile % game.size !== 0) {
          const bottomLeft = tile + game.size - 1
          adjacent.push(bottomLeft) 
          if(game.mines[bottomLeft] === 1) danger++
        } 
  
        // Bottom right
        if(tile < (game.size * game.size) - game.size && (tile + 1) % game.size !== 0) {
          const bottomRight = tile + game.size + 1
          adjacent.push(bottomRight) 
          if(game.mines[bottomRight] === 1) danger++
        }
  
        // Set danger of current tile
        dangerUpdates[tile] = danger
  
        if(danger === 0) {
          const searchNext = adjacent.filter(tile => !visited.includes(tile) && game.mines[tile] !== 1 && game.flags[tile] !== 1)
          searchNext.forEach(tile => {
            queue.push(tile)
            visited.push(tile)
          })
        }
      }
    }
  
    const newDangers = [...game.dangers]
    
    for (const [key, value] of Object.entries(dangerUpdates)) {
      newDangers[key] = value
      count++
    }
  
    return { newDangers, newRevealedCount: count }
  }
  
  const getMainBorder = () => {
    let style = 'Tile-border '
  
    let inFirstColumn = id % game.size === 0
    let inLastColumn = (id + 1) % game.size === 0
    let inTopRow = id < game.size
    let inBottomRow = id >= (game.size * game.size) - game.size
  
    if(inFirstColumn) {
      style += 'Tile-border-left '
    }
    if(inLastColumn) {
      style += 'Tile-border-right '
    }
    if(inTopRow) {
      style += 'Tile-border-top '
    }
    if(inBottomRow) {
      style += 'Tile-border-bottom '
    }
  
    let revealed = danger >= 0 && danger < 10
  
    if(revealed) {
      let leftUnrevealed = game.dangers[id - 1] === -1 || game.dangers[id - 1] === 10
      let rightUnrevealed = game.dangers[id + 1] === -1 || game.dangers[id + 1] === 10
      let topUnrevealed = game.dangers[id - game.size] === -1 || game.dangers[id - game.size] === 10
      let bottomUnrevealed = game.dangers[id + game.size] === -1 || game.dangers[id + game.size] === 10
  
      if(leftUnrevealed) {
        style += 'Tile-border-left '
      }
      if(rightUnrevealed) {
        style += 'Tile-border-right '
      }
      if(topUnrevealed) {
        style += 'Tile-border-top '
      }
      if(bottomUnrevealed) {
        style += 'Tile-border-bottom '
      }
    }
  
    // Field corners need a border radius
    if(id === 0) style += 'Tile-border-field-top-left '
    else if(id === game.size - 1) style += 'Tile-border-field-top-right '
    else if(id === (game.size * game.size) - 1) style += 'Tile-border-field-bottom-right '
    else if(id === (game.size * game.size) - game.size) style += 'Tile-border-field-bottom-left '
  
    // Adjust border width based on size
    switch(game.size) {
      case 9:
        style += 'Tile-border-easy '
        break
      case 15:
        style += 'Tile-border-medium '
        break
      case 25:
        style += 'Tile-border-hard '
        break
    }
  
    return style
  }
  
  const getCornerBorders = () => {
    // Unrevealed tiles do not have borders at all (this includes flags)
    if(danger === -1 || danger === 10) return
  
    let baseStyle = 'Tile-border-corner '
  
    switch(game.size) {
      case 9:
        baseStyle += 'Tile-border-corner-easy '
        break
      case 15:
        baseStyle += 'Tile-border-corner-medium '
        break
      case 25:
        baseStyle += 'Tile-border-corner-hard '
        break
      default:
        break
    }
  
    let cornerBorders = []
  
    // Check which of these combinations of tiles are revealed
    // If so, they may need a corner border to close their seam
    const leftAndTopRevealed = (game.dangers[id - 1] > -1 && game.dangers[id - 1] < 10) && (game.dangers[id - game.size] > -1 && game.dangers[id - game.size] < 10)
    const rightAndTopRevealed = (game.dangers[id + 1] > -1 && game.dangers[id + 1] < 10) && (game.dangers[id - game.size] > -1 && game.dangers[id - game.size] < 10)
    const rightAndBottomRevealed = (game.dangers[id + 1] > -1 && game.dangers[id + 1] < 10) && (game.dangers[id + game.size] > -1 && game.dangers[id + game.size] < 10)
    const leftAndBottomRevealed = (game.dangers[id - 1] > -1 && game.dangers[id - 1] < 10) && (game.dangers[id + game.size] > -1 && game.dangers[id + game.size] < 10)
  
    const inFirstColumn = id % game.size === 0
    const inLastColumn = (id + 1) % game.size === 0
  
    if(leftAndTopRevealed && !inFirstColumn) {
      // If the top-left neighbor is unrevealed,
      // close the seam between the top and left borders
      const topLeftUnrevealed = game.dangers[id - game.size - 1] === -1 || game.dangers[id - game.size - 1] === 10
  
      if(topLeftUnrevealed) {
        cornerBorders.push(<div key={id + 'tl'} className={baseStyle + 'Tile-border-top-left '}/>)
      }
    }
  
    if(rightAndTopRevealed && !inLastColumn) {
      const topRightUnrevealed = game.dangers[id - game.size + 1] === -1 || game.dangers[id - game.size + 1] === 10
  
      if(topRightUnrevealed) {
        cornerBorders.push(<div key={id + 'tr'} className={baseStyle + 'Tile-border-top-right '} />)
      }
    }
  
    if(rightAndBottomRevealed && !inLastColumn) {
      const bottomRightUnrevealed = game.dangers[id + game.size + 1] === -1 || game.dangers[id + game.size + 1] === 10
  
      if(bottomRightUnrevealed) {
        cornerBorders.push(<div key={id + 'br'} className={baseStyle + 'Tile-border-bottom-right '} />)
      }
    }
  
    if(leftAndBottomRevealed && !inFirstColumn) {
      const bottomLeftUnrevealed = game.dangers[id + game.size - 1] === -1 || game.dangers[id + game.size - 1] === 10
  
      if(bottomLeftUnrevealed) {
        cornerBorders.push(<div key={id + 'bl'} className={baseStyle + 'Tile-border-bottom-left '} />)
      }
    }
  
    return cornerBorders
  }  
  
  const placeFlag = () => {
    // flags and dangers are updated with the position of the new flag
    const newFlags = [...game.flags]
    const newDangers = [...game.dangers]
    const newFlagsReduced = [...game.flagsReduced]
  
    if(newFlags[id] === 0) {
      // Tile is unrevealed, place a flag
      if(game.flagsReduced.length < game.minesReduced.length) {
        newFlags[id] = 1
        newDangers[id] = 10
        newFlagsReduced.push(id)
      }
    } else {
      // Tile has a flag already, remove the flag
      newFlags[id] = 0
      newDangers[id] = -1
      newFlagsReduced.splice(newFlagsReduced.indexOf(id), 1)
    } 
  
    game.setFlags(newFlags)
    game.setDangers(newDangers) 
    game.setFlagsReduced(newFlagsReduced)
  }

  const handleClick = () => {
    if(!game.runTimer) game.setRunTimer(true)

    if(game.gameState === game.PLAYING_STATE && danger === -1) {
      const { newDangers, newRevealedCount } = reveal()
      if(mine) {
        game.setGameState(game.LOST_STATE)
        // game.setRevealedCount(0)
        game.setRunTimer(false)
      } else {
        game.setRevealedCount(game.revealedCount + newRevealedCount)
      }
      // Update dangers here so that a revealed mine or danger is shown
      game.setDangers(newDangers)
    }
  }

  const handleRightClick = (event) => {
    event.preventDefault()
    if(!game.runTimer) game.setRunTimer(true)
    if(game.gameState === game.PLAYING_STATE && (danger === -1 || danger === 10)) {
      if(game.flagsReduced.length <= game.minesReduced.length) {
        placeFlag()
      }
    }
  }

  // Style generating functions

  const getStyle = () => {
    let style = 'Tile-container '

    if(danger >= 0 && danger <= 9) {
      if(id % 2 === 0) style += 'Tile-reveal-light '
      else style += 'Tile-reveal-dark '
    }
   
    // change to difficulty
    switch(game.size) {
      case 9:
        style += 'Tile-easy '
        break
      case 15:
        style += 'Tile-medium '
        break
      case 25:
        style += 'Tile-hard '
        break
      default:
        break
    }
  
    if(game.gameState === game.PLAYING_STATE) style += 'Tile-enabled '
  
    // if(flag) style += 'Tile-flag '
  
    if(danger === 9) style += 'Tile-mine '
  
    if(danger >= 0 && danger < 10) {
      if(id % 2 === 0) style += 'Tile-revealed-light '
      else style += 'Tile-revealed-dark '
    }
  
    if(id % 2 === 0) style += 'Tile-light '
    else style += 'Tile-dark '
  
    return style
  }

  const getDangerStyle = () => {
    let style = ''

    // if(danger > -1) style += 'Tile-danger-reveal '
  
    switch(game.size) {
      case 9:
        style += 'Tile-danger-easy '
        break
      case 15:
        style += 'Tile-danger-medium '
        break
      case 25:
        style += 'Tile-danger-hard '
        break
      default:
        break
    }
  
    switch(danger) {
      case 1:
        style += 'Tile-danger-one '
        break
      case 2:
        style += 'Tile-danger-two '
        break
      case 3:
        style += 'Tile-danger-three '
        break
      case 4:
        style += 'Tile-danger-four '
        break
      case 5:
        style += 'Tile-danger-five '
        break
      case 6:
        style += 'Tile-danger-six '
        break
      case 7:
        style += 'Tile-danger-seven '
        break
      case 8:
        style += 'Tile-danger-eight '
        break
      default:
        break
    }
  
    return style
  }

  return (
    <div 
      className={getStyle()}
      onClick={handleClick}
      onContextMenu={handleRightClick}
    >
      <div className={getMainBorder()}>
        {getCornerBorders()} 
      </div>
      {
        flag ? 
        <div className='Tile-flag' />
        :
        <div className={getDangerStyle()}>{danger > 0 && danger < 9 ? danger : null}</div>
      }
    </div>
  )
}

export default Tile
