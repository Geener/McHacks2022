
import {useState, useEffect} from 'react'


const Hangman = ({guesses}) => {
    const drawings = ['Drawing for 1 guess remaining', 'Drawing for 2 guesses remaining', 'Drawing for 3 guesses remaining', 'Drawing for 4 guesses remaining', 'Drawing for 5 guesses remaining', 'Drawing for 6 guesses remaining', 'Drawing for 7 guesses remaining'];
    const [man, setMan] = useState();
    
    useEffect(() => {
        setMan(drawings[guesses-1])
    }, [])
    
    return (
      <>
       {man}
      </>
    );
  }
  
  export default Hangman;