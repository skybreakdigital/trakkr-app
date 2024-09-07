import { formatNumber } from '../../helpers/formatNumber';
import './CompleteMissions.scss';

function CompleteMissions({ missions }: any) {
  return (
    <div className="ActiveMissions w-8">
      <ul className="mission-list">
        {missions.map((data: any, index: number) => (
          <li key={data.MissionID} className="mission-list-item w-full">
            <div className="row-item custom w-5">
              <div>
                <span className="font-bold pr-3"><i className="fa-solid fa-check" /></span> {data.LocalisedName}
              </div>
            </div>
            <div className="row-item w-2 text-center">{data.DestinationStation}</div>
            <div className="row-item w-3 text-center">{data.Commodity_Localised} ({data.Count})</div>
            <div className="row-item w-2 text-center text-accent">{formatNumber(data.Reward)}</div>
          </li>
        ))}
        {!missions || (missions && missions.length === 0) && (
          <li className="mission-list-item w-full opacity-50">
            <div className='row-item w-full'><i className="fa-solid fa-circle-exclamation mr-2" /> You have no completed missions</div>
          </li>
        )}
      </ul>
    </div>
  )

}

export default CompleteMissions;