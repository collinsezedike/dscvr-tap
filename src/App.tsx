import { useEffect, useState } from 'react'
import { BoltIcon, TrophyIcon } from '@heroicons/react/24/solid'
import './App.css'
import TimerButton from './timerbutton.tsx'

function App() {
  const[taps,setTaps] = useState(0)
  const[timeLeft,setTimeLeft] = useState(10)
  const[isPlaying,setIsPlaying] = useState(false)
  const[streak,setStreak] = useState(0)
  const[totalCoins,setTotalCoins] = useState(0)

  useEffect(()=>{
    const storedData = JSON.parse(localStorage.getItem('tappingGameData') ?? '{}')
    if(storedData){
      setStreak(storedData.streak || 0)
      setTotalCoins(storedData.totalCoins || 0)
      
      const lastPlayDate = new Date(storedData.lastPlayDate)
      const today = new Date()

      // Calculate the difference in days
      const diffInTime = today.getTime() - lastPlayDate.getTime()
      const diffInDays = diffInTime / (1000 * 3600 * 24)

      if(diffInDays >= 1 && diffInDays < 2) {
        // If it's the next day
        setStreak(prevStreak => prevStreak+1)
      } else if(diffInDays >= 2) {
        // If more than one day has passed, reset the streak
        setStreak(0)
      }
    }
  },[])

  useEffect(()=>{
    let timer : number
    if(isPlaying && timeLeft > 0){
      timer = setTimeout(()=>setTimeLeft(timeLeft - 1),1000)
    }
    return ()=>clearTimeout(timer)
  },[isPlaying,timeLeft])

  useEffect(()=>{
    if(timeLeft === 0){
      endGame()
    }
  },[timeLeft])

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
    setTotalCoins(totalCoins+taps)

    const gameData = {
      streak,
      totalCoins,
      lastPlayData: new Date()
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
        <p>{totalCoins}</p>
        <TrophyIcon className='icon'/>
      </div>
    </section>
    <h3 className='title'>DSCVR Tap Squad</h3>
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