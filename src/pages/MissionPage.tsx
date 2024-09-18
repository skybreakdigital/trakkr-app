import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import ActiveMissions from "../components/ActiveMissions/ActiveMissions";
import CompleteMissions from "../components/CompleteMissions/CompleteMissions";
import TabMenu from "../components/TabMenu/TabMenu";
import Stats from "../components/Stats/Stats";
import SectionTitle from "../components/SectionTitle/SectionTitle";
import Commodity from "../components/Commodity/Commodity";
import Evaluation from "../components/Evaluation/Evaluation";
import ShipSpecs from "../components/ShipSpecs/ShipSpecs";
import { useCommanderState } from "../context/Commander";
import Empty from "../components/Empty/Empty";
import Config from "../components/Config/Config";
import dayjs from "dayjs";
import MessageBuilder from "../components/MessageBuilder/MessageBuilder";
import { Dropdown } from "primereact/dropdown";

function MissionPage() {
  const { activeCommander, fetchMissionData, state }: any =
    useCommanderState();

  const [menuItems, setMenuItems]: any = useState([
    { label: "Active", active: true, data: { count: "0" } },
    { label: "Fulfilled", active: false, data: { count: "0" } },
    { label: "Config", active: false }
  ]);
  const [acceptedMissions, setAcceptedMissions]: any = useState<any[]>([]);
  const [completedMissions, setCompletedMissions]: any = useState<any[]>([]);
  const [commodities, setCommodities]: any = useState({});
  const [commodityConfig, setCommodityConfig]: any = useState({});
  const [totalInvestment, setTotalInvestment]: any = useState(0);
  const [builderVisible, setBuilderVisible]: any = useState(false);
  const [commodityOption, setCommodityOption]: any = useState("All");

  const onMenuClick = (updatedMenu: any) => {
    setMenuItems(updatedMenu);
  };

  const showUI = (label: string) => {
    if (!menuItems) return;
    return menuItems.find((item: any) => item.active).label === label;
  };

  const checkHasMissions = () => {
    return acceptedMissions?.length + completedMissions?.length > 0;
  };

  const calculateTonnage = () => {
    const accepetedCount = acceptedMissions?.reduce(
      (total: number, mission: any) => total + (mission.Count || 0),
      0
    );
    const completedCount = completedMissions?.reduce(
      (total: number, mission: any) => total + (mission.Count || 0),
      0
    );

    return accepetedCount + completedCount;
  };

  const calculateCommodities = (
    acceptedMissions: any[],
    completedMissions: any[],
    commodityConfig: any
  ) => {
    const commoditiesMap: Record<
      string,
      Record<string, { delivered: number; count: number; value: number }>
    > = {};
    let totalInvestment = 0;

    // Helper function to accumulate commodities by station
    const accumulateCommodities = (missions: any[]) => {
      missions.forEach((mission) => {
        const {
          Commodity_Localised,
          Count,
          ItemsDelivered = 0,
          DestinationStation
        } = mission;

        if (Commodity_Localised && Count && DestinationStation) {
          const commodityName = Commodity_Localised.toLowerCase();

          // Ensure the station exists in the commoditiesMap
          if (!commoditiesMap[DestinationStation]) {
            commoditiesMap[DestinationStation] = {};
          }

          // Ensure the commodity exists for the station
          if (!commoditiesMap[DestinationStation][commodityName]) {
            commoditiesMap[DestinationStation][commodityName] = {
              delivered: 0,
              count: 0,
              value: 0
            };
          }

          // Update the data for the specific station
          commoditiesMap[DestinationStation][commodityName].delivered +=
            ItemsDelivered;
          commoditiesMap[DestinationStation][commodityName].count += Count;
          commoditiesMap[DestinationStation][commodityName].value +=
            Count * (commodityConfig[commodityName] || 0);
        }
      });
    };

    // Process accepted and completed missions for each station
    accumulateCommodities([...acceptedMissions, ...completedMissions]);

    // Now accumulate for the "All" section based on station data
    Object.entries(commoditiesMap).forEach(([station, commodities]) => {
      if (station !== "All") {
        Object.entries(commodities).forEach(([commodity, data]) => {
          if (!commoditiesMap["All"]) {
            commoditiesMap["All"] = {};
          }
          if (!commoditiesMap["All"][commodity]) {
            commoditiesMap["All"][commodity] = {
              delivered: 0,
              count: 0,
              value: 0
            };
          }

          commoditiesMap["All"][commodity].delivered += data.delivered;
          commoditiesMap["All"][commodity].count += data.count;
          commoditiesMap["All"][commodity].value += data.value;
        });
      }
    });

    // Sort and calculate total investment
    const sortedCommoditiesByStation = Object.entries(commoditiesMap).reduce(
      (acc, [station, commodities]) => {
        const sortedCommodities = Object.entries(commodities)
          .map(([commodity, data]) => ({
            commodity,
            delivered: data.delivered,
            count: data.count,
            value: data.value
          }))
          .sort((a, b) => b.count - a.count);

        acc[station] = sortedCommodities;
     
        totalInvestment = sortedCommodities.reduce(
          (sum, item) => sum + item.value,
          0
        );
        
        return acc;
      },
      {} as Record<string, any[]>
    );

    return { sortedCommoditiesByStation, totalInvestment };
  };

  const calculateMissionValue = () => {
    const acceptedValue = acceptedMissions.reduce(
      (total: number, mission: any) => total + (mission.Reward || 0),
      0
    );
    const completedValue = completedMissions.reduce(
      (total: number, mission: any) => total + (mission.Reward || 0),
      0
    );

    return acceptedValue + completedValue;
  };

  const calculateCompletedMissionValue = () => {
    return completedMissions.reduce(
      (total: number, mission: any) => total + (mission.Reward || 0),
      0
    );
  };

  const calculateShareDate = () => {
    const allMissions = [...acceptedMissions, ...completedMissions];

    return allMissions.reduce((earliest, mission) => {
      const missionExpiryDate = new Date(mission.Expiry);
      if (!earliest || missionExpiryDate < earliest) {
        return missionExpiryDate;
      }
      return earliest;
    }, null);
  };

  const onCommodityOptionChange = (e: any) => {
    const { value } = e.target;

    setCommodityOption(value);
  };

  const handleStackType = () => {
    const stationCount: { [key: string]: number } = {};

    completedMissions.forEach((mission: any) => {
      const station = mission.DestinationStation;
      if (station in stationCount) {
        stationCount[station] += 1;
      } else {
        stationCount[station] = 1;
      }
    });

    return stationCount;
  };

  useEffect(() => {
    fetchMissionData();
  }, []);

  useEffect(() => {
    if (!state || (state && !state.commodityConfig)) return;

    setCommodityConfig(state.commodityConfig);
  }, [state]);

  useEffect(() => {
    if (!activeCommander) return;

    setAcceptedMissions(activeCommander.active.wmm);
    setCompletedMissions(activeCommander.completed.wmm);
  }, [activeCommander]);

  useEffect(() => {
    if (!acceptedMissions && !completedMissions) return;

    setMenuItems((prevItems: any) =>
      prevItems.map((item: any) => {
        if (item.label === "Active") {
          return {
            ...item,
            data: { ...item.data, count: acceptedMissions.length || "0" }
          };
        }
        if (item.label === "Fulfilled") {
          return {
            ...item,
            data: { ...item.data, count: completedMissions.length || "0" }
          };
        }
        return item; // Return unchanged item for 'Config' or other menu items
      })
    );

    const { sortedCommoditiesByStation, totalInvestment } =
      calculateCommodities(
        acceptedMissions,
        completedMissions,
        commodityConfig
      );
    setCommodities(sortedCommoditiesByStation);
    setTotalInvestment(totalInvestment);
  }, [acceptedMissions, completedMissions]);

  return (
    <div className="MissionPage relative">
      <SectionTitle title="Wing Missions" />
      <TabMenu menuItems={menuItems} onClick={onMenuClick} />
      <div className="flex gap-4">
        {showUI("Active") ? (
          <ActiveMissions missions={acceptedMissions} />
        ) : showUI("Fulfilled") ? (
          <CompleteMissions missions={completedMissions} />
        ) : (
          <Config />
        )}
        <div className="w-3 flex flex-column">
          <Stats
            statData={[
              {
                label: "Total Missions",
                value: acceptedMissions?.length + completedMissions?.length
              },
              { label: "Fulfilled", value: completedMissions?.length },
              { label: "Total Tonnage", value: calculateTonnage() }
            ]}
          />

          <div className="my-3">
            <SectionTitle title="Ship Specs" />
            <ShipSpecs />
          </div>

          <div className="my-3">
            <div className="flex justify-content-between align-items-center">
              <SectionTitle title="Commodities" />
              <div className="w-6">
                {commodities && (
                  <Dropdown
                    value={commodityOption}
                    options={Object.keys(commodities)
                      .sort((a, b) =>
                        a === "All" ? -1 : b === "All" ? 1 : a.localeCompare(b)
                      )
                      .map((key) => key)}
                    onChange={onCommodityOptionChange}
                    className="w-full uppercase"
                  />
                )}
              </div>
            </div>

            {checkHasMissions() ? (
              <Commodity commodityData={commodities[commodityOption]} />
            ) : (
              <Empty message="No Mission Data. Commodities could not be completed.." />
            )}
          </div>

          <SectionTitle title="Evaluation" />
          {checkHasMissions() ? (
            <Evaluation
              data={{
                totalMissionValue: calculateMissionValue(),
                investment: totalInvestment,
                shareDate: calculateShareDate()
              }}
            />
          ) : (
            <Empty message="No Mission Data. Evaluation could not be completed.." />
          )}
          <div className="my-3 flex justify-content-end align-items-center">
            <button
              className="accent"
              onClick={() => setBuilderVisible(true)}
              disabled={completedMissions.length < 10}
            >
              Share Stack
            </button>
          </div>
        </div>
      </div>
      <Dialog
        header="Share Stack"
        style={{ width: "50%" }}
        visible={builderVisible}
        onHide={() => {
          if (!builderVisible) return;
          setBuilderVisible(false);
        }}
      >
        <MessageBuilder
          stackData={{
            size: completedMissions.length,
            value: calculateCompletedMissionValue(),
            type: handleStackType()
          }}
        />
      </Dialog>
    </div>
  );
}

export default MissionPage;
