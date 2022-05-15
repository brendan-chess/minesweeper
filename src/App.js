import './App.css'
import { GameProvider } from './gameContext'
import Field from './components/Field/Field'
import Menu from './components/Menu/Menu'

const App = () => {
  return (
    <GameProvider>
      <div className='App-container'>
        <h1>Minesweeper</h1>
        <Field />
        <Menu />
      </div>
    </GameProvider>
  )
}

export default App
