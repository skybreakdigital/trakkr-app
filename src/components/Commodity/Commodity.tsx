import { useEffect, useState } from "react";
import { useCommanderState } from "../../context/Commander";

function Commodity({ commodityData }: any) {
  const { activeCommander }: any = useCommanderState();

  const [cargo, setCargo]: any = useState(0);

  const calculateRuns = (commodityCount: number) => {
    return Math.ceil(commodityCount / cargo);
  };

  useEffect(() => {
    if (!activeCommander) return;

    setCargo(activeCommander.info.cargo);
  }, [activeCommander]);

  return (
    <div className="Commodity">
      <ul className="mission-list m-0">
        {commodityData?.map((data: any, index: number) => (
          <li key={index} className="mission-list-item flex">
            <div className="row-item w-full flex flex-column flex-wrap gap-1 justify-content-between p-2 mr-0">
              <div
                className={
                  data.count === data.delivered
                    ? "green flex align-items-center"
                    : "flex align-items-center"
                }
              >
                <div>{data.commodity}</div>
                {data.count - data.delivered !== 0 &&
                  data.count - data.delivered <= cargo && (
                    <div className="badge ml-3 px-2 text-xs flex justify-content-center align-items-center">
                      <i className="fa-solid fa-triangle-exclamation" />
                      <div>Buy {data.count - data.delivered}</div>
                    </div>
                  )}
              </div>
              <div className="text-sm flex justify-content-between">
                <div>
                  <span className="opacity-50">{data.delivered}</span> /{" "}
                  {data.count} -
                  <span>
                    {" "}
                    {Math.ceil((data.delivered / data.count) * 100)}% Completed
                  </span>
                </div>

                {data.count - data.delivered !== 0 &&
                  calculateRuns(data.count) !== 0 && (
                    <div className="ml-3">
                      {calculateRuns(data.count - data.delivered)}{" "}
                      {calculateRuns(data.count) === 1 ? "Haul" : "Hauls"} left
                    </div>
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
