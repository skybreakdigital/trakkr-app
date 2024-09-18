import { useState } from "react";
import SectionTitle from "../components/SectionTitle/SectionTitle";
import TabMenu from "../components/TabMenu/TabMenu";

function CombatPage() {
  const [menuItems, setMenuItems]: any = useState([
    { label: "Massacre", active: true },
    { label: "Assassination", active: false },
    { label: "Config", active: false }
  ]);

  const onMenuClick = () => {};

  return (
    <div className="CombatPage relative">
      <SectionTitle title="Combat Missions" />
      <TabMenu menuItems={menuItems} onClick={onMenuClick} />
      <div className="flex gap-4">
        {/* {showUI("Active") ? (
          <ActiveMissions missions={acceptedMissions} />
        ) : showUI("Fulfilled") ? (
          <CompleteMissions missions={completedMissions} />
        ) : (
          <Config />
        )} */}
        <div className="w-3 flex flex-column"></div>
      </div>
    </div>
  );
}

export default CombatPage;
