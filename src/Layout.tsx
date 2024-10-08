import { useEffect, useState } from "react";
import NavMenu from "./components/NavMenu/NavMenu";
import { Outlet, useNavigate } from "react-router-dom";
import CommanderTab from "./components/CommanderTab/CommanderTab";
import { CommanderProvider, useCommanderState } from "./context/Commander";
import dayjs from "dayjs";

function Layout() {
  const { missionData, activeCommander, setCommander: chooseActiveCommander, loading }: any = useCommanderState();

  const navigate = useNavigate();

  const [commanderData, setCommanderData]: any = useState({});
  const [commander, setCommander]: any = useState({});

  const sortCommanders = (commanderData: any) => {
    const sortedEntries = Object.entries(commanderData)
      .sort(([keyA], [keyB]) => {
        const numA = parseInt(keyA.slice(1), 10);
        const numB = parseInt(keyB.slice(1), 10);

        // Sort numerically
        return numA - numB;
      });

    return sortedEntries.reduce((obj: any, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
  }

  useEffect(() => {
    if (!missionData) return;

    const sortedCommanderData = sortCommanders(missionData);
    setCommanderData(sortedCommanderData);
  }, [missionData]);

  useEffect(() => {
    if (!activeCommander) return;

    setCommander(activeCommander);
  }, [activeCommander]);

  useEffect(() => {
    navigate('/main/missions');
  }, []);

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