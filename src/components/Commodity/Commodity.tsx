import { useEffect, useState } from "react";
import { useCommanderState } from "../../context/Commander";

function Commodity({ commodityData }: any) {
    const { activeCommander }: any = useCommanderState();

    const [cargo, setCargo]: any = useState(0);

    const calculateRuns = (commodityCount: number) => {
        return Math.ceil(commodityCount / cargo);
    }

    useEffect(() => {
        if(!activeCommander) return;

        setCargo(activeCommander.info.cargo);
    }, [activeCommander]);

    return (
        <div className="Commodity">
            <ul className="mission-list m-0">
                {commodityData.map((data: any, index: number) => (
                    <li key={index} className="mission-list-item flex">
                        <div className="row-item w-full flex flex-wrap gap-2 justify-content-between align-items-center">
                            <div className={data.count === data.delivered ? 'green' : ''}>{data.commodity}
                            {(data.count - data.delivered) !== 0 && (data.count - data.delivered) <= cargo && (
                                    <span className="badge ml-3 px-3 text-xs"><i className="fa-solid fa-triangle-exclamation" /> Buy {data.count - data.delivered}</span>
                                )}
                            </div>
                            <div className="text-sm">
                                <span className="opacity-50">{data.delivered}</span> / {data.count} -
                                <span> {Math.ceil(((data.delivered / data.count) * 100))}% Completed</span>
                                {(data.count - data.delivered) !== 0 && calculateRuns(data.count) !== 0 && (
                                    <span className="ml-3">{calculateRuns(data.count - data.delivered)} {calculateRuns(data.count) === 1 ? 'Haul' : 'Hauls'} left</span>
                                )}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Commodity;