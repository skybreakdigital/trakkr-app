import { useEffect, useState } from "react";
import SectionTitle from "../components/SectionTitle/SectionTitle";
import TabMenu from "../components/TabMenu/TabMenu";
import { useCommanderState } from "../context/Commander";
import MassacreMission from "../components/MassacreMissions/MassacreMissions";

function CombatPage() {
  const { fetchMissionData, activeCommander }: any = useCommanderState();

  const [massacreMissions, setMassacreMissions]: any[] = useState([]);
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

  useEffect(() => {
    fetchMissionData();
  }, []);

  useEffect(() => {
    if (!activeCommander) return;

    setMassacreMissions(activeCommander.active?.massacre);
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
        <div className="w-3 flex flex-column"></div>
      </div>
    </div>
  );
}

export default CombatPage;
