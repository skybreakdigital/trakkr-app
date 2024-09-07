import { useEffect, useState } from "react";
import NavMenu from "./components/NavMenu/NavMenu";
import { Outlet, useNavigate } from "react-router-dom";
import CommanderTab from "./components/CommanderTab/CommanderTab";
import { CommanderProvider, useCommanderState } from "./context/Commander";
import dayjs from "dayjs";

function Layout() {
  const { missionData, activeCommander, chooseActiveCommander, loading }: any = useCommanderState();

  const navigate = useNavigate();

  const [commanderData, setCommanderData]: any = useState({});
  const [commander, setCommander]: any = useState({});

  useEffect(() => {
    if(!missionData) return;
    setCommanderData(missionData);

    if(activeCommander) {
      chooseActiveCommander(missionData[activeCommander?.info?.fid]);
    }
    
  }, [missionData]);

  useEffect(() => {
    if(!activeCommander) return;

    setCommander(activeCommander);
  }, [activeCommander]);

  useEffect(() => {
    navigate('/main/missions');
  }, []);

  if(loading) {
    return <div>loading...</div>
  }

  return (
      <div className="Layout flex">
        <NavMenu />
        <div className='p-3 flex flex-column w-full content'>
          {missionData && (
            <CommanderTab commanderData={commanderData} />
          )}
          
          <h2 className='m-0'>Welcome back, <span className="uppercase">{commander?.info?.name}</span></h2>
          <Outlet />
        </div>
      </div>
  )
}

export default Layout;