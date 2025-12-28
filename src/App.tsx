import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState, useTransition } from 'react';

const GUESS_COUNT = 6;
const WORD_LENGTH = 5;


function App() {

  const [correctWord, setCorrectWord] = useState("")
  const [loading, setLoading] = useState(true)
  const [guesses, setGuesses] = useState<string[]>(Array.from({ length: GUESS_COUNT }).map(() => ("")))
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false)
  const [revealingIndex, setRevealingIndex] = useState<number | null>(null)
  const [isRevealing, setIsRevealing] = useState(false)
  const [revealingTileIndex, setRevealingTileIndex] = useState(0)
  const defaultStatusText = ""
  const [status, setStatus] = useState(defaultStatusText)
  const containerRef = useRef<HTMLDivElement | null>(null)


  const handleCurrentWord = (event: KeyboardEvent<HTMLDivElement>) => {

    if (isGameOver) return

    let current = guesses[currentGuessIndex]
    if (event.key.length === 1 && event.key.match(/^[a-zA-Z]$/)) {

      if (current.length >= WORD_LENGTH) return

      current = current + event.key.toLowerCase()

      setGuesses(g => {
        const next = [...g]
        next[currentGuessIndex] = current
        return next
      })

    } else if (event.key === 'Backspace') {

      if (current.length <= 0) return

      current = current.substring(0, current.length - 1)

      setGuesses(g => {
        const next = [...g]
        next[currentGuessIndex] = current
        return next
      })


    } else if (event.key === 'Enter') {
      if (event.repeat) return
      handleEnter(current)
    }
  }

  const handleEnter = (current: string) => {
    if (current.length !== WORD_LENGTH || isGameOver || isRevealing) return;
    setRevealingIndex(currentGuessIndex)
    setIsRevealing(true)
    setRevealingTileIndex(1)


    const interval = setInterval(() => {
      setRevealingTileIndex(prev => {

        const nextTileIndex = prev + 1
        if (nextTileIndex > WORD_LENGTH) {

          if (current.toLowerCase() === correctWord) {
            setIsGameOver(true)
            setStatus("You won, the word was \"" + current.toUpperCase() + "\"")

          } else {
            if (currentGuessIndex >= GUESS_COUNT - 1) {
              setIsGameOver(true)
              setStatus("You lost, the word was \"" + correctWord.toUpperCase() + "\"")
            }
          }
          setCurrentGuessIndex(prev => prev + 1)
          setIsRevealing(false)
          setRevealingIndex(null)
          clearInterval(interval)
        }

        return nextTileIndex
      })
    }, 400);
  }

  const restartGame = () => {
    setLoading(true)
    getRandomWord()
    setCurrentGuessIndex(0)
    setStatus("")
    setGuesses(Array.from({ length: GUESS_COUNT }).map(() => ("")))
    setIsGameOver(false)
    setRevealingIndex(null)
    setIsRevealing(false)
    setRevealingTileIndex(0)
    setLoading(false)
  }

  const getRandomWord = async () => {
    await fetch("/words.txt")
      .then(res => res.text())
      .then(text => {
        const words = text
          .split("\n")
          .map(w => w.trim())

        const randomWord = words[Math.floor(Math.random() * words.length)]
        console.log({randomWord})
        setCorrectWord(randomWord.toLowerCase())
        setLoading(false)
      })
  }

  useEffect(() => {
    setLoading(true)
    getRandomWord()
    containerRef.current?.focus()
  }, [])


  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleCurrentWord}
      className="container">

      <div className="game">
        <div className="header">Type on keyboard</div>


        <div className="board">
          {guesses.map((item, i) => (
            <Line
              guess={item}
              correctWord={correctWord}
              isCurrentGuess={i === currentGuessIndex}
              isRevealing={i === revealingIndex}
              revealingTileIndex={revealingTileIndex}
              loading={loading}
            />
          ))}
        </div>
        <div style={{
          flexShrink: 0
        }} className="status">{!!status ? status : `${GUESS_COUNT - currentGuessIndex} guesses left`}</div>
        {isGameOver && (
          <button
            onClick={restartGame}
            className="restart-btn">
            Restart
          </button>
        )}
      </div>

    </div>
  )
}

type LineProps = {
  guess: string,
  correctWord: string,
  isCurrentGuess: boolean,
  isRevealing: boolean,
  revealingTileIndex: number,
  loading: boolean
}

const Line = ({ guess, correctWord, isCurrentGuess, isRevealing, revealingTileIndex, loading }: LineProps) => {
  return (
    <div className="line">
      {Array.from({ length: WORD_LENGTH }).map((_, i) => {
        const isTrueLetter = guess[i] === correctWord[i]
        const isCloseLetter = correctWord.includes(guess[i])
        const isTileRevealed = isCurrentGuess ? isRevealing && i < revealingTileIndex : true
        return (
          <div
            key={i}
            className={`tile
    ${isTileRevealed && "flip"}
    ${!loading && isTileRevealed && isTrueLetter && "correctTile"}
    ${!loading && isTileRevealed && !isTrueLetter && isCloseLetter && "closeTile"}
  `}
          >
            {guess[i]}
          </div>

        )
      })}
    </div >
  )
}



export default App
