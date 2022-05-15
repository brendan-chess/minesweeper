import './Tile.css'
import { useGame } from '../../gameContext'

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

const placeFlag = (id, flags, dangers) => {
  const newFlags = [...flags]
  const newDangers = [...dangers]

  if(newFlags[id] === 0) {
    newFlags[id] = 1
    newDangers[id] = 10
  } else {
    newFlags[id] = 0
    newDangers[id] = -1
  } 

  return { newFlags, newDangers }
}

const getStyle = (id, danger, gameState, flag, dangers, size) => {
  // todo: avoid passing dangers to this function (it is a big array, this function runs every render)

  let style = 'Tile-container '

  if(gameState === 'playing') style += 'Tile-enabled '

  if(flag) style += 'Tile-flag '

  if(danger === 9) style += 'Tile-mine '

  if(danger >= 0 && danger < 10) {
    if(id % 2 === 0) style += 'Tile-revealed-light '
    else style += 'Tile-revealed-dark '
  }

  if(id % 2 === 0) style += 'Tile-light '
  else style += 'Tile-dark '

  // outlines
  // if(danger >= 0) {
  //   if(id % size === 0 || dangers[id - 1] === -1) {
  //     style += 'Tile-left-outline '
  //   }
  //   if((id + 1) % size === 0 || dangers[id + 1] === -1) {
  //     style += 'Tile-right-outline '
  //   }
  //   if(id < size || dangers[id - size] === -1) {
  //     style += 'Tile-top-outline '
  //   }
  //   if(id >= (size * size) - size || dangers[id + size] === -1) {
  //     style += 'Tile-bottom-outline '
  //   }
  // }


  return style
}

const Tile = ({ id, mine, danger, flag }) => {
  const { size, mines, dangers, setDangers, gameState, setGameState, flags, setFlags, revealedCount, setRevealedCount } = useGame()
  
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
      const { newFlags, newDangers } = placeFlag(id, flags, dangers)
      setFlags(newFlags)
      setDangers(newDangers)
    }
  }

  return (
    <div 
      className={getStyle(id, danger, gameState, flag, dangers, size)}
      onClick={handleClick}
      onContextMenu={handleRightClick}
    >
      {danger > 0 && danger < 9 ? danger : null}
    </div>
  )
}

export default Tile
