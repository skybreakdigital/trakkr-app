import { Fragment, useEffect, useState } from "react";
import { formatCredit } from "../../helpers/formatNumber";
import './MassacreMissions.scss';
import dayjs from "dayjs";
import { formatUnder24hour, setRemainingTime } from "../../helpers/formatTime";

function MassacreMission({ missions }: any) {
    const [visibleRowIdx, setVisibleRowIdx]: any = useState(null);
    const [time, setTime]: any = useState("");

    let prevMissionKills = 0;

    const onRowClick = (index: number) => {
        if (visibleRowIdx !== index) {
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

    const onDestinationClick = (destination: string) => {
        navigator.clipboard
            .writeText(destination)
            .then(() => {
                alert(`You have copied ${destination}. Paste in galaxy map to set navigation.`);
            })
            .catch((error) => {
                console.error("Failed to copy: ", error);
            });
    }

    const setMissionKillLabel = (totalKills: number, missionKillCount: number, neededKills: number, index: number) => {
        let missionKills = 0;

        if (totalKills > 0) {
            const availableKills = totalKills - prevMissionKills;

            missionKills = Math.min(availableKills, missionKillCount);

            prevMissionKills += missionKills;
        }

        return `${missionKills} / ${missionKillCount} Kills`;
    };

    useEffect(() => {    
        const updateTimeLeft = () => {
          const newTimeLeft = missions.map((data: any) => {
            return data.missions.map((mission: any) => setRemainingTime(mission.Expiry))
          });
          setTime(newTimeLeft);
        };
    
        const intervalId = setInterval(updateTimeLeft, 1000);
    
        return () => clearInterval(intervalId); // Cleanup on unmount
      }, [time]);

    return (
        <div className="ActiveMissions w-9">
            <ul className="mission-list">
                <li className="mission-list-header w-full uppercase">
                    <div className="row-item w-4 px-1 text-left">Issued By</div>
                    <div className="row-item w-3 px-1">Target</div>
                    <div className="row-item w-2 px-1">Kills</div>
                    <div className="row-item w-1 text-center px-1">Diff</div>
                    <div className="row-item w-2 text-center px-1">Mission Earnings</div>
                    <div className="row-item w-2 text-center px-1">Total Earnings</div>
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
                            <div className="row-item w-1 px-1 py-2 text-center">{calculateDiff(index)}</div>
                            <div className="row-item w-2 px-1 py-2 text-center">{formatCredit(data.missionRewardTotal)}</div>
                            <div className="row-item w-2 px-1 py-2 text-center text-accent">{formatCredit(data.missionRewardTotal + data.bountyRewardTotal)}</div>
                        </li>
                        {data.missions.map((mission: any, missionIdx: any) => (
                            visibleRowIdx === index && (
                                <li key={missionIdx} className="row-item-dropdown uppercase">
                                    <div className="row-item custom w-4 px-1 py-2 uppercase"><span className="opacity-50">{mission.LocalisedName}</span></div>
                                    <div className="row-item w-3 px-1 py-2"><span className="text-accent cursor-pointer" onClick={() => onDestinationClick(mission.DestinationSystem)}>{mission.DestinationSystem}</span> <i className="fa-solid fa-chevron-right text-xs mx-2" /> {mission.DestinationStation}</div>
                                    <div className="row-item w-1 px-1 py-2 text-center">{setMissionKillLabel(data.kills, mission.KillCount, data.neededKills, index)}</div>
                                    <div className="row-item w-3 px-1 py-2 text-center">{dayjs(data.Expiry).format('ddd, MMM D, YYYY')} <span className={`${formatUnder24hour(mission.Expiry) ? 'expires w-8' : 'w-8'}`}>{time[index][missionIdx]}</span></div>
                                    <div className="row-item w-1 px-1 py-2 text-accent text-center">{formatCredit(mission.Reward)}</div>
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