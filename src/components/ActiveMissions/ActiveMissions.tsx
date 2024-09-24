import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { formatCredit, formatNumber } from '../../helpers/formatNumber';
import './ActiveMission.scss';
import { useEffect, useState } from 'react';
import { formatUnder24hour, setRemainingTime } from '../../helpers/formatTime';

dayjs.extend(duration);

function ActiveMissions({ missions }: any) {
  const [time, setTime]: any = useState("");

  useEffect(() => {    
    const updateTimeLeft = () => {
      const newTimeLeft = missions.map((mission: any) => setRemainingTime(mission.Expiry));
      setTime(newTimeLeft);
    };

    const intervalId = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [time]);

  return (
    <div className="ActiveMissions w-9">
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
            <div className="row-item w-2 text-center px-1 py-2">{data.Commodity_Localised} ({formatNumber(data.Count)})</div>
            <div className="row-item w-3 text-center px-1 py-2">{dayjs(data.Expiry).format('ddd, MMM D, YYYY')} <span className={`${formatUnder24hour(data.Expiry) ? 'expires w-8' : 'w-8'}`}>{time[index]}</span></div>
            <div className="row-item w-2 text-center px-1 py-2 text-accent">{formatCredit(data.Reward)}</div>
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