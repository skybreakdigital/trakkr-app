import { Fragment, useState } from "react";
import { formatCredit } from "../../helpers/formatNumber";
import './MassacreMissions.scss';

function MassacreMission({ missions }: any) {
    const [visibleRowIdx, setVisibleRowIdx]: any = useState(null);

    const onRowClick = (index: number) => {
        if(visibleRowIdx !== index) {
            setVisibleRowIdx(index);
        } else {
            setVisibleRowIdx(null);
        }
        
    }

    const calculateDiff = (index: number) => {
        if (index - 1 < 0) {
            return 0;
        }
    
        const maxStackKills = Math.max(...missions.map((mission: any) => mission.neededKills));
        const currentStackKills = missions[index].neededKills;
        const killDifference = maxStackKills - currentStackKills;
    
        return killDifference >= 0 ? `+${killDifference}` : 0;
    }

    return (
        <div className="ActiveMissions w-9">
            <ul className="mission-list">
                <li className="mission-list-header w-full uppercase text-center">
                    <div className="row-item w-4 px-1 text-left">Issued By</div>
                    <div className="row-item w-3 text-center px-1">Target</div>
                    <div className="row-item w-2 text-center px-1">Kills</div>
                    <div className="row-item w-1 text-center px-1">Diff</div>
                    <div className="row-item w-1 text-center px-1">Mission</div>
                    <div className="row-item w-1 text-center px-1">Total Earned</div>
                </li>
                {missions?.map((data: any, index: number) => (
                    <Fragment key={index}>
                        <li className={`mission-list-item w-full ${visibleRowIdx === index ? 'active' : ''}`} onClick={() => onRowClick(index)}>
                            <div className="row-item custom w-4 px-1 py-2">
                                <div>
                                    <span className="font-bold pr-3">{index + 1}</span>{data.issueFaction}
                                </div>
                                <progress value={(data.kills / data.neededKills)} max={1} />
                            </div>
                            <div className="row-item w-3 px-1 py-2">{data.targetFaction}</div>
                            <div className="row-item w-2 px-1 py-2">{`${data.kills} / ${data.neededKills}`} <span className="text-accent">({`${data.neededKills - data.kills} Left`})</span></div>
                            <div className="row-item w-1 px-1 py-2">{calculateDiff(index)}</div>
                            <div className="row-item w-1 px-1 py-2">{formatCredit(data.missionRewardTotal)}</div>
                            <div className="row-item w-1 px-1 py-2 text-accent">{formatCredit(data.missionRewardTotal + data.bountyRewardTotal)}</div>
                        </li>
                        {data.missions.map((mission: any, missionIdx: any) => (
            
                                visibleRowIdx === index && (
                                    <li key={missionIdx} className="row-item-dropdown uppercase">
                                    <div className="row-item custom w-5 px-1 py-2 uppercase">{mission.LocalisedName}</div>
                                    <div className="row-item w-3 px-1 py-2">{mission.DestinationSystem} <i className="fa-solid fa-chevron-right text-xs mx-2" /> {mission.DestinationStation}</div>
                                    <div className="row-item w-2 px-1 py-2">{`${0} / ${mission.KillCount} Kills`}</div>
                                    <div className="row-item w-2 px-1 py-2 text-accent">{formatCredit(mission.Reward)}</div>
                                </li>
                                )
                        ))}
                    </Fragment>
                ))}
                {!missions || (missions && missions.length === 0) && (
                    <li className="mission-list-item w-full opacity-50">
                        <div className='row-item w-full'><i className="fa-solid fa-circle-exclamation mr-2" /> You have no active missions</div>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default MassacreMission;