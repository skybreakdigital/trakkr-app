import { useEffect, useState } from "react";
import "./CommanderTab.scss";
import { useCommanderState } from "../../context/Commander";
import dayjs from "dayjs";

function CommanderTab({ commanderData }: any) {
  const { activeCommander, setCommander: chooseActiveCommander }: any =
    useCommanderState();
  const [commander, setCommander]: any = useState(null);
  const [time, setTime]: any = useState(dayjs().format("HH:mm:ss"));

  useEffect(() => {
    if (!activeCommander) return;
    setCommander(activeCommander);
  }, [activeCommander]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(dayjs().format("HH:mm:ss"));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="CommanderTab flex justify-content-between align-items-center mb-3">
      <div className="flex justify-content-start align-items-center gap-2 px-2">
        <div className="uppercase text-xs opacity-50">
          Choose Your Commander <i className="fa-solid fa-chevron-right pl-2" />
        </div>
        {Object.keys(commanderData).map((key, index) => (
          <div
            key={index}
            className={`tab-item uppercase flex align-items-center ${
              key === commander?.info?.fid ? "active" : ""
            }`}
            onClick={() => chooseActiveCommander(key)}
          >
            {key === commander?.info?.fid && (
              <i className="fa-solid fa-user text-xs mt-1 mr-2" />
            )}
            <div>{commanderData[key].info?.name}</div>
          </div>
        ))}
      </div>

      <div className="text-sm uppercase m-2 w-3 flex justify-content-end align-items-center gap-2">
        <div className="lowercase font-bold text-accent">
          v{process.env.APP_VERSION}
        </div>
        <div>|</div>
        <div>
          Current Time: <span className="opacity-50 ml-2 w-2">{time}</span>
        </div>
      </div>
    </div>
  );
}

export default CommanderTab;
