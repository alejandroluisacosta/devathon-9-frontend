import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';
import './flipclock.scss';

export function FlipClock({ to, onComplete }) {
  return (
    <FlipClockCountdown
        to={to}
      renderMap={[false, false, false, true]}
      showSeparators={false}
      labels={['', '', '', '']} 
      className="flip-clock"
      hideOnComplete={false}
      onComplete={onComplete}
    />
  );
}
export default FlipClock;