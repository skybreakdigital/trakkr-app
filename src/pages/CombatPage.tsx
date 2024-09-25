import { useEffect, useState } from "react";
import SectionTitle from "../components/SectionTitle/SectionTitle";
import TabMenu from "../components/TabMenu/TabMenu";
import { useCommanderState } from "../context/Commander";
import MassacreMission from "../components/MassacreMissions/MassacreMissions";
import Stats from "../components/Stats/Stats";
import Empty from "../components/Empty/Empty";
import Evaluation from "../components/Evaluation/Evaluation";
import { formatCredit } from "../helpers/formatNumber";

function CombatPage() {
  const { fetchMissionData, activeCommander }: any = useCommanderState();

  const [massacreMissions, setMassacreMissions]: any[] = useState([]);
  const [targetFaction, setTargetFaction]: any = useState("");
  const [menuItems, setMenuItems]: any = useState([
    { label: "Massacre", active: true },
    { label: "Assassination", active: false },
    { label: "Config", active: false }
  ]);

  const onMenuClick = () => {};

  const showUI = (label: string) => {
    if (!menuItems) return;
    return menuItems.find((item: any) => item.active).label === label;
  };

  const calculateTotalMissions = () => {
    return massacreMissions.reduce(
      (total: number, mission: any) => total + mission.missions.length,
      0
    );
  };

  const calculateActiveMissions = () => {
    const activeMissions = [];

    let prevKills = 0;
    let missionKills;

    massacreMissions.forEach((data: any) => {
      data.missions.forEach((mission: any) => {
        if (data.kills > 0) {
          const availableKills = data.kills - prevKills;

          missionKills = Math.min(availableKills, mission.KillCount);

          if (missionKills !== mission.KillCount) {
            activeMissions.push(mission);
          }

          prevKills += missionKills;
        }
      });
    });

    return activeMissions.length;
  };

  const calculateKillCount = () => {
    if (!massacreMissions || massacreMissions.length === 0) return;

    const sortedMissions = massacreMissions.sort(
      (a: any, b: any) => b.neededKills - a.neededKills
    );

    return sortedMissions[0].neededKills;
  };

  const calculateTotalKills = () => {
    return massacreMissions.reduce(
      (total: number, mission: any) => total + mission.neededKills,
      0
    );
  };

  const calculateAvgPerKill = () => {
    const totalCredits = calculateStackValue();
    const killCount = calculateKillCount();

    if (killCount === 0) return formatCredit(0);

    const avgCreditsPerKill = Math.floor(totalCredits / killCount);

    return formatCredit(avgCreditsPerKill);
  };

  const calculateAvgPerMission = () => {
    const totalCredits = calculateStackValue();

    const totalMissions = massacreMissions.reduce(
      (total: number, mission: any) => total + mission.missions.length,
      0
    );

    const avgCreditsPerMission = Math.floor(totalCredits / totalMissions);

    return formatCredit(avgCreditsPerMission);
  };

  const calculateRemainingKills = () => {
    if (!massacreMissions || massacreMissions.length === 0) return;

    const sortedMissions = massacreMissions.sort(
      (a: any, b: any) => b.neededKills - a.neededKills
    );

    const neededKills = sortedMissions[0].neededKills;
    const totalKills = sortedMissions[0].kills;

    return neededKills - totalKills;
  };

  const calculateStackValue = () => {
    return massacreMissions.reduce(
      (total: number, mission: any) => total + mission.missionRewardTotal,
      0
    );
  };

  const calculateShareValue = () => {
    let wingMissions: any = [];

    massacreMissions.forEach((data: any) => {
      data.missions.forEach((mission: any) => {
        if (mission.Wing) {
          wingMissions.push(mission);
        }
      });
    });

    return wingMissions.reduce(
      (total: number, mission: any) => total + mission.Reward,
      0
    );
  };

  useEffect(() => {
    fetchMissionData();
  }, []);

  useEffect(() => {
    if (!activeCommander) return;

    setMassacreMissions(activeCommander.active?.massacre);

    if (activeCommander.active.massacre?.length > 0) {
      setTargetFaction(activeCommander.active?.massacre[0].targetFaction);
    }
  }, [activeCommander]);

  return (
    <div className="CombatPage relative">
      <SectionTitle title="Combat Missions" />
      <TabMenu menuItems={menuItems} onClick={onMenuClick} />
      <div className="flex gap-4">
        {showUI("Massacre") ? (
          <MassacreMission missions={massacreMissions} />
        ) : (
          <div></div>
        )}

        {massacreMissions && massacreMissions.length > 0 ? (
          <div className="w-3 flex flex-column">
            <Stats
              statData={[
                {
                  label: "Target Faction",
                  value: targetFaction,
                  classes: "w-12"
                },
                {
                  label: "Total Missions",
                  value: calculateTotalMissions()
                },
                {
                  label: "Active Missions",
                  value: calculateActiveMissions()
                },
                {
                  label: "Kill Count",
                  value: calculateKillCount()
                },
                {
                  label: "Total Kills",
                  value: calculateTotalKills()
                },
                {
                  label: "Kill Ratio",
                  value: calculateTotalKills() / calculateKillCount()
                },
                {
                  label: "Remaining Kills",
                  value: calculateRemainingKills()
                }
              ]}
            />

            <SectionTitle title="Evaluation" />
            {massacreMissions.length ? (
              <Evaluation
                data={{
                  averagePerKill: calculateAvgPerKill(),
                  averagePerMission: calculateAvgPerMission(),
                  stackValue: formatCredit(calculateStackValue()),
                  totalShareValue: formatCredit(calculateShareValue())
                }}
              />
            ) : (
              <Empty message="No Mission Data. Evaluation could not be completed.." />
            )}
            {/* <div className="my-3 flex justify-content-end align-items-center">
            <button
              className="accent"
              onClick={() => setBuilderVisible(true)}
              disabled={completedMissions.length < 10}
            >
              Share Stack
            </button>
          </div> */}
          </div>
        ) : (
          <div className="w-3 mt-3 flex flex-column">
            <Empty message="No Mission Data. Statistics are not available.." />
          </div>
        )}
      </div>
    </div>
  );
}

export default CombatPage;
