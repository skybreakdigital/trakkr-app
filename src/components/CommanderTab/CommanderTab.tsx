import { useEffect, useState } from "react";
import './CommanderTab.scss';
import { useCommanderState } from "../../context/Commander";

function CommanderTab({ commanderData }: any) {
    const { activeCommander, chooseActiveCommander }: any = useCommanderState();
    const [commander, setCommander]: any = useState(null);

    useEffect(() => {
        if (!activeCommander) return;
        setCommander(activeCommander);
    }, [activeCommander]);

    useEffect(() => {
        if (!commander && Object.keys(commanderData).length > 0) {
            chooseActiveCommander(Object.keys(commanderData)[0]);
        }
    }, [commander, commanderData, chooseActiveCommander]);

    return (
        <div className="CommanderTab flex justify-content-start align-items-center gap-2 px-2 mb-3">
            <div className="uppercase text-xs opacity-50">
                Choose Your Commander <i className="fa-solid fa-chevron-right pl-2" />
            </div>
            {Object.keys(commanderData).map((key, index) => (
                <div
                    key={index}
                    className={`tab-item uppercase flex align-items-center ${key === commander?.info?.fid ? 'active' : ''}`}
                    onClick={() => chooseActiveCommander(key)}
                >
                    {key === commander?.info?.fid && (
                        <i className="fa-solid fa-user text-xs mt-1 mr-2" />
                    )}
                    <div>
                        {commanderData[key].info?.name}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CommanderTab;