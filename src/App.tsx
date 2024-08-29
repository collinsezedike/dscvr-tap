import { useEffect, useState } from 'react'
import { BoltIcon, TrophyIcon } from '@heroicons/react/24/solid'
import './App.css'
import TimerButton from './timerbutton.tsx'

function App() {
  const[taps,setTaps] = useState(0)
  const[timeLeft,setTimeLeft] = useState(10)
  const[isPlaying,setIsPlaying] = useState(false)
  const[streak,setStreak] = useState(0)
  const[highScore,setHighScore] = useState(0)

  useEffect(()=>{
    const storedData = JSON.parse(localStorage.getItem('tappingGameData') ?? '{}')
    if(storedData){
      setStreak(storedData.streak)
      setHighScore(storedData.highScore)
      
      const lastPlayDate = new Date(storedData.lastPlayDate)
      const today = new Date()

      if(today.toDateString() !== lastPlayDate.toDateString()){
        if(today.getDate() - lastPlayDate.getDate() > 1){
          setStreak(0)
        }
      }
    }
  },[isPlaying])

  useEffect(()=>{
    let timer : number
    if(isPlaying && timeLeft > 0){
      timer = setTimeout(()=>setTimeLeft(timeLeft - 1),1000)
    }else if(timeLeft === 0){
      endGame()
    }
    return ()=> clearTimeout(timer)
  },[isPlaying,timeLeft])

  const startGame = ()=>{
    setIsPlaying(true)
    setTaps(0)
    setTimeLeft(10)
  }

  const handleTap = ()=>{
    if(isPlaying){
      setTaps(taps + 1)
    }
  }

  const endGame = ()=>{
    setIsPlaying(false)
    setStreak(streak+1)
    if(taps > highScore){
      setHighScore(taps)
    }

    const gameData = {
      streak,
      highScore:Math.max(highScore,taps),
      lastPlayData: new Date().toISOString()
    }

    localStorage.setItem('tappingGameData',JSON.stringify(gameData))
  }

  return (
    <div className='container'>
    <section id='scores'>
      <div>
        <BoltIcon className='icon'/>
      <p>{streak}</p>
      </div>
      <div>
        <p>{highScore}</p>
        <TrophyIcon className='icon'/>
      </div>
    </section>
    <section id='main-container'>
      {
        (!isPlaying) ? ( <button onClick={startGame}>Start Game</button> ) : (
          <>
            <p style={{fontSize:16,marginBottom:16}}>Time Left : {timeLeft} secs</p>
                <TimerButton  handleTap={handleTap}/>
            <p style={{fontSize:16}}> Taps : {taps}</p>
          </>
        )
      }
      {
        (!isPlaying && taps > 0) && (
          <div style={{marginTop:16}}>
            <p> Game Over! You tapped {taps} times</p>
          </div>
        )
      }
    </section>
    </div>
  )
}

export default App