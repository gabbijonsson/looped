
import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: Date;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="bg-amber-50 p-4 rounded-lg shadow-md border border-amber-100">
      <h2 className="text-xl font-bold text-center text-amber-900 mb-3">Cabin Trip Countdown</h2>
      <div className="grid grid-cols-4 gap-2">
        <div className="countdown-item">
          <span className="text-2xl sm:text-3xl font-bold text-amber-800">{timeLeft.days}</span>
          <span className="text-xs sm:text-sm text-amber-600">Days</span>
        </div>
        <div className="countdown-item">
          <span className="text-2xl sm:text-3xl font-bold text-amber-800">{timeLeft.hours}</span>
          <span className="text-xs sm:text-sm text-amber-600">Hours</span>
        </div>
        <div className="countdown-item">
          <span className="text-2xl sm:text-3xl font-bold text-amber-800">{timeLeft.minutes}</span>
          <span className="text-xs sm:text-sm text-amber-600">Minutes</span>
        </div>
        <div className="countdown-item">
          <span className="text-2xl sm:text-3xl font-bold text-amber-800">{timeLeft.seconds}</span>
          <span className="text-xs sm:text-sm text-amber-600">Seconds</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
