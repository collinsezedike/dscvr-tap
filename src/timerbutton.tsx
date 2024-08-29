import { useState, useEffect } from "react";
import "./TimerButton.css"; // Import the CSS file

interface TimerButtonProps {
  handleTap: () => void; // Define the type for handleTap prop
}

function TimerButton({handleTap}:TimerButtonProps){
  const [timeLeft, setTimeLeft] = useState(10); // Initial time in seconds
  const totalTime = 10; // Total time for the timer

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  // Calculate the degrees for the conic-gradient
  const degrees = (timeLeft / totalTime) * 360;

  return (
    <div className="button">
      <div
        className="progress"
        style={{
          background: `conic-gradient(red ${degrees}deg, transparent 0deg)`,
        }}
      ></div>
      <button className="time" onClick={handleTap}>Tap</button>
    </div>
  );
};

export default TimerButton;