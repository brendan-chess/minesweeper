import './Tile.css'
import { useGame } from '../../gameContext'
import { useState } from 'react'

const reveal = (id, size, mines, dangers, flags) => {
  let queue = []
  let visited = []
  let count = 0

  queue.push(id)
  visited.push(id)

  let dangerUpdates = {}

  if(mines[id] === 1) dangerUpdates[id] = 9
  else {
    while(queue.length > 0) {
      const tile = queue.shift()

      // Find adjacent tiles
      const adjacent = []
      let danger = 0

      // Left
      if(tile % size !== 0) {
        const left = tile - 1
        adjacent.push(left)
        if(mines[left] === 1) danger++
      }

      // Right
      if((tile + 1) % size !== 0){
        const right = tile + 1
        adjacent.push(right)
        if(mines[right] === 1) danger++
      }

      // Top
      if(tile >= size) {
        const top = tile - size
        adjacent.push(top)
        if(mines[top] === 1) danger++
      }

      // Bottom
      if(tile < (size * size) - size) {
        const bottom = tile + size
        adjacent.push(bottom)
        if(mines[bottom] === 1) danger++
      } 

      // Top left
      if(tile >= size && tile % size !== 0) {
        const topLeft = tile - size - 1
        adjacent.push(topLeft)
        if(mines[topLeft] === 1) danger++
      }

      // Top right
      if(tile >= size && (tile + 1) % size !== 0) {
        const topRight = tile - size + 1
        adjacent.push(topRight)
        if(mines[topRight] === 1) danger++
      }
      
      // Bottom left
      if(tile < (size * size) - size && tile % size !== 0) {
        const bottomLeft = tile + size - 1
        adjacent.push(bottomLeft) 
        if(mines[bottomLeft] === 1) danger++
      } 

      // Bottom right
      if(tile < (size * size) - size && (tile + 1) % size !== 0) {
        const bottomRight = tile + size + 1
        adjacent.push(bottomRight) 
        if(mines[bottomRight] === 1) danger++
      }

      // Set danger of current tile
      dangerUpdates[tile] = danger

      if(danger === 0) {
        const searchNext = adjacent.filter(tile => !visited.includes(tile) && mines[tile] !== 1 && flags[tile] !== 1)
        searchNext.forEach(tile => {
          queue.push(tile)
          visited.push(tile)
        })
      }
    }
  }

  const newDangers = [...dangers]
  
  for (const [key, value] of Object.entries(dangerUpdates)) {
    newDangers[key] = value
    count++
  }

  return { newDangers, newRevealedCount: count }
}

const getMainBorder = (id, size, danger, dangers) => {
  let style = 'Tile-border '

  let inFirstColumn = id % size === 0
  let inLastColumn = (id + 1) % size === 0
  let inTopRow = id < size
  let inBottomRow = id >= (size * size) - size

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
    let leftUnrevealed = dangers[id - 1] === -1 || dangers[id - 1] === 10
    let rightUnrevealed = dangers[id + 1] === -1 || dangers[id + 1] === 10
    let topUnrevealed = dangers[id - size] === -1 || dangers[id - size] === 10
    let bottomUnrevealed = dangers[id + size] === -1 || dangers[id + size] === 10

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
  else if(id === size - 1) style += 'Tile-border-field-top-right '
  else if(id === (size * size) - 1) style += 'Tile-border-field-bottom-right '
  else if(id === (size * size) - size) style += 'Tile-border-field-bottom-left '

  // Adjust border width based on size
  switch(size) {
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

const getCornerBorders = (id, size, danger, dangers) => {
  // Unrevealed tiles do not have borders at all (this includes flags)
  if(danger === -1 || danger === 10) return

  let baseStyle = 'Tile-border-corner '

  switch(size) {
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
  const leftAndTopRevealed = (dangers[id - 1] > -1 && dangers[id - 1] < 10) && (dangers[id - size] > -1 && dangers[id - size] < 10)
  const rightAndTopRevealed = (dangers[id + 1] > -1 && dangers[id + 1] < 10) && (dangers[id - size] > -1 && dangers[id - size] < 10)
  const rightAndBottomRevealed = (dangers[id + 1] > -1 && dangers[id + 1] < 10) && (dangers[id + size] > -1 && dangers[id + size] < 10)
  const leftAndBottomRevealed = (dangers[id - 1] > -1 && dangers[id - 1] < 10) && (dangers[id + size] > -1 && dangers[id + size] < 10)

  const inFirstColumn = id % size === 0
  const inLastColumn = (id + 1) % size === 0

  if(leftAndTopRevealed && !inFirstColumn) {
    // If the top-left neighbor is unrevealed,
    // close the seam between the top and left borders
    const topLeftUnrevealed = dangers[id - size - 1] === -1 || dangers[id - size - 1] === 10

    if(topLeftUnrevealed) {
      cornerBorders.push(<div className={baseStyle + 'Tile-border-top-left '}/>)
    }
  }

  if(rightAndTopRevealed && !inLastColumn) {
    const topRightUnrevealed = dangers[id - size + 1] === -1 || dangers[id - size + 1] === 10

    if(topRightUnrevealed) {
      cornerBorders.push(<div className={baseStyle + 'Tile-border-top-right '} />)
    }
  }

  if(rightAndBottomRevealed && !inLastColumn) {
    const bottomRightUnrevealed = dangers[id + size + 1] === -1 || dangers[id + size + 1] === 10

    if(bottomRightUnrevealed) {
      cornerBorders.push(<div className={baseStyle + 'Tile-border-bottom-right '} />)
    }
  }

  if(leftAndBottomRevealed && !inFirstColumn) {
    const bottomLeftUnrevealed = dangers[id + size - 1] === -1 || dangers[id + size - 1] === 10

    if(bottomLeftUnrevealed) {
      cornerBorders.push(<div className={baseStyle + 'Tile-border-bottom-left '} />)
    }
  }

  return cornerBorders
}

const getDangerStyle = (danger, size) => {
  let style = ''

  switch(size) {
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

const Tile = ({ id, mine, danger, flag }) => {
  const { size, mines, dangers, setDangers, gameState, setGameState, flags, setFlags, revealedCount, setRevealedCount } = useGame()
  const [dropFlag, setDropFlag] = useState(false)
  const [liftFlag, setLiftFlag] = useState(false)
  
  const placeFlag = () => {
    // flags and dangers are updated with the position of the new flag
    const newFlags = [...flags]
    const newDangers = [...dangers]
  
    if(newFlags[id] === 0) {
      // Tile is unrevealed, place a flag
      newFlags[id] = 1
      newDangers[id] = 10
      // Animation
      setDropFlag(true)
    } else {
      // Tile has a flag already, remove the flag
      newFlags[id] = 0
      newDangers[id] = -1
      // Animation
      setLiftFlag(true)
    } 
  
    return { newFlags, newDangers }
  }

  const handleClick = () => {
    if(gameState === 'playing') {
      const { newDangers, newRevealedCount } = reveal(id, size, mines, dangers, flags)
      if(mine) {
        setGameState('lost')
        setRevealedCount(0)
      } else {
        setRevealedCount(revealedCount + newRevealedCount)
      }
      setDangers(newDangers)
    }
  }

  const handleRightClick = (event) => {
    event.preventDefault()
    if(gameState === 'playing') {
      const { newFlags, newDangers } = placeFlag()
      setFlags(newFlags)
      setDangers(newDangers)
    }
  }

  // Style generating functions

  const getStyle = () => {
    let style = 'Tile-container '
   
    // change to difficulty
    switch(size) {
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
  
    if(gameState === 'playing') style += 'Tile-enabled '
  
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

  return (
    <div 
      className={getStyle()}
      onClick={handleClick}
      onContextMenu={handleRightClick}
    >
      <div className={getMainBorder(id, size, danger, dangers)}>
        {getCornerBorders(id, size, danger, dangers)} 
      </div>
      {
        flag ? 
        <div className='Tile-flag' />
        :
        <div className={getDangerStyle(danger, size)}>{danger > 0 && danger < 9 ? danger : null}</div>
      }
    </div>
  )
}

export default Tile
