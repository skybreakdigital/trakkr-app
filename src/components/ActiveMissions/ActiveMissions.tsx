import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { formatNumber } from '../../helpers/formatNumber';
import './ActiveMission.scss';
import { useEffect, useState } from 'react';

dayjs.extend(duration);

function ActiveMissions({ missions }: any) {
  const [time, setTime]: any = useState("");

  const under24hour = (expiration: string) => {
    const now = new Date();
    const exp = new Date(expiration);

    const diffInMs = exp.getTime() - now.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    return diffInHours <= 24;
  };

  const setTimeLeft = (expiration: string) => {
    const now = dayjs();
    const exp = dayjs(expiration);

    const diff = exp.diff(now);

    if(diff > 0) {
      const duration = dayjs.duration(diff);
      const hours = Math.floor(duration.asHours());
      const minutes = duration.minutes().toString().padStart(2, '0');
      const seconds = duration.seconds().toString().padStart(2, '0');

      return `${hours}:${minutes}:${seconds}`;
    }
  }

  useEffect(() => {    
    const updateTimeLeft = () => {
      const newTimeLeft = missions.map((mission: any) => setTimeLeft(mission.Expiry));
      setTime(newTimeLeft);
    };

    const intervalId = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [time]);

  return (
    <div className="ActiveMissions w-8">
      <ul className="mission-list">
        <li className="mission-list-header w-full uppercase text-center">
          <div className="row-item w-4 px-1 text-left">Mission</div>
          <div className="row-item w-3 text-center px-1">Destination</div>
          <div className="row-item w-2 text-center px-1">Commodity</div>
          <div className="row-item w-3 text-center px-1">Expiration</div>
          <div className="row-item w-2 text-center px-1">Payout</div>
        </li>
        {missions.map((data: any, index: number) => (
          <li key={data.MissionID} className="mission-list-item w-full">
            <div className="row-item custom w-4 px-1 py-2">
              <div>
                <span className="font-bold pr-3">{index + 1}</span>{data.LocalisedName}
              </div>
              <progress value={data.Progress} max={1} />
            </div>
            <div className="row-item w-3 text-center px-1 py-2">{data.DestinationSystem} <i className="fa-solid fa-chevron-right text-xs mx-2" /> {data.DestinationStation}</div>
            <div className="row-item w-2 text-center px-1 py-2">{data.Commodity_Localised} ({data.Count})</div>
            <div className="row-item w-3 text-center px-1 py-2">{dayjs(data.Expiry).format('ddd, MMM D, YYYY')} <span className={`${under24hour(data.Expiry) ? 'expires w-8' : 'w-8'}`}>{time[index]}</span></div>
            <div className="row-item w-2 text-center px-1 py-2 text-accent">{formatNumber(data.Reward)}</div>
          </li>
        ))}
        {!missions || (missions && missions.length === 0) && (
          <li className="mission-list-item w-full opacity-50">
            <div className='row-item w-full'><i className="fa-solid fa-circle-exclamation mr-2" /> You have no active missions</div>
          </li>
        )}
      </ul>
    </div>
  )

}

export default ActiveMissions;