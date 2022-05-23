import './App.css'
import { GameProvider } from './gameContext'
import Field from './components/Field/Field'
import Status from './components/Status/Status'
import Menu from './components/Menu/Menu'

const App = () => {
  return (
    <GameProvider>
      <div className='App-container'>
        <Field />
        <Status />
        <Menu />
      </div>
    </GameProvider>
  )
}

export default App
