import { useEffect, useState } from "react";
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
import commodityData from '../helpers/commodities.json';
import dayjs from "dayjs";

function MissionPage() {
    const { activeCommander, fetchedAt, fetchMissionData }: any = useCommanderState();

    const [time, setTime]: any = useState(dayjs().format('HH:mm:ss'));
    const [menuItems, setMenuItems]: any = useState([
        { label: 'Active', active: true, data: { count: '0'  } },
        { label: 'Fulfilled', active: false, data: { count: '0' } },
        { label: 'Config', active: false }
    ]);
    const [acceptedMissions, setAcceptedMissions]: any = useState<any[]>([]);
    const [completedMissions, setCompletedMissions]: any = useState<any[]>([]);
    const [commodities, setCommodities]: any = useState({});
    const [totalInvestment, setTotalInvestment]: any = useState(0);
    const [totalProfit, setTotalProfit]: any = useState(0);
    const [commodityConfig, setCommodityConfig]: any = useState(commodityData)

    const onMenuClick = (updatedMenu: any) => {
        setMenuItems(updatedMenu);
    }

    const showUI = (label: string) => {
        if(!menuItems) return;
        return menuItems.find((item: any) => item.active).label === label;
    }

    const checkHasMissions = () => {
        return (acceptedMissions.length + completedMissions.length) > 0;
    }

    const calculateTonnage = () => {
        const accepetedCount = acceptedMissions.reduce((total: number, mission: any) => total + (mission.Count || 0), 0);
        const completedCount = completedMissions.reduce((total: number, mission: any) => total + (mission.Count || 0), 0);

        return accepetedCount + completedCount;
    }

    const calculateCommodities = (commodityConfig: any) => {
        const commoditiesMap: any = {};
        let investment: number = 0;

        // Helper function to accumulate commodities
        const accumulateCommodities = (missions: any[]) => {
            missions.forEach((mission) => {
                if (mission.Commodity_Localised && mission.Count) {
                    if (!commoditiesMap[mission.Commodity_Localised]) {
                        commoditiesMap[mission.Commodity_Localised] = {
                            delivered: 0,
                            count: 0,
                            value: 0,
                        };
                    }

                    const itemsDelivered = mission.ItemsDelivered || 0;

                    commoditiesMap[mission.Commodity_Localised].delivered += itemsDelivered;
                    commoditiesMap[mission.Commodity_Localised].count += mission.Count;
                    commoditiesMap[mission.Commodity_Localised].value += mission.Count * (commodityConfig[mission.Commodity_Localised.toLowerCase()] || 0);
                }
            });
        };

        // Process accepted and completed missions
        accumulateCommodities([...acceptedMissions, ...completedMissions]);

        const sortedCommodities = Object.entries(commoditiesMap)
            .map(([commodity, data]: any) => {
                investment += data.value;
                return {
                    commodity,
                    delivered: data.delivered,
                    count: data.count,
                    value: data.value,
                };
            })
            .sort((a, b) => b.count - a.count);

        return { sortedCommodities, investment };
    }

    const calculateMissionValue = () => {
        const acceptedValue = acceptedMissions.reduce((total: number, mission: any) => total + (mission.Reward || 0), 0);
        const completedValue = completedMissions.reduce((total: number, mission: any) => total + (mission.Reward || 0), 0);

        return acceptedValue + completedValue;
    }

    const calculateShareDate = () => {
        const allMissions = [
            ...acceptedMissions,
            ...completedMissions
        ];

        return allMissions.reduce((earliest, mission) => {
            const missionExpiryDate = new Date(mission.Expiry);
            if (!earliest || missionExpiryDate < earliest) {
                return missionExpiryDate;
            }
            return earliest;
        }, null);
    }

    useEffect(() => {
        fetchMissionData();
    }, []);

    useEffect(() => {
        if (!activeCommander) return;

        setAcceptedMissions(activeCommander.active);
        setCompletedMissions(activeCommander.completed);

    }, [activeCommander]);

    useEffect(() => {
        if (!acceptedMissions && !completedMissions) return;

        setMenuItems((prevItems: any) =>
            prevItems.map((item: any) => {
              if (item.label === 'Active') {
                return {
                  ...item,
                  data: { ...item.data, count: acceptedMissions.length || '0' },
                };
              }
              if (item.label === 'Fulfilled') {
                return {
                  ...item,
                  data: { ...item.data, count: completedMissions.length || '0' },
                };
              }
              return item; // Return unchanged item for 'Config' or other menu items
            })
          );

        const { sortedCommodities, investment } = calculateCommodities(commodityConfig);
        setCommodities(sortedCommodities);
        setTotalInvestment(investment);
    }, [acceptedMissions, completedMissions]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(dayjs().format('HH:mm:ss'));
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="MissionPage">
            <SectionTitle title="Wing Mining Missions" />
            <TabMenu
                menuItems={menuItems}
                onClick={onMenuClick}
            />
            <div className="flex gap-4">
                {showUI('Active') ? (
                    <ActiveMissions missions={acceptedMissions} />
                ) : showUI('Fulfilled') ? (
                    <CompleteMissions missions={completedMissions} />
                ) : (
                    <Config />
                )}
                <div className="w-4 flex flex-column">
                    <Stats
                        statData={[
                            { label: 'Total Missions', value: acceptedMissions.length + completedMissions.length },
                            { label: 'Fulfilled', value: completedMissions.length },
                            { label: 'Total Tonnage', value: calculateTonnage() }
                        ]}
                    />

                    <SectionTitle title="Ship Specs" />
                    <ShipSpecs />

                    <SectionTitle title="Commodities" />
                    {checkHasMissions() ? (
                        <Commodity commodityData={commodities} />
                    ) : (
                        <Empty message="No Mission Data. Commodities could not be completed.." />
                    )}


                    <SectionTitle title="Evaluation" />
                    {checkHasMissions() ? (
                        <Evaluation data={{
                            totalMissionValue: calculateMissionValue(),
                            investment: totalInvestment,
                            shareDate: calculateShareDate()
                        }} />
                    ) : (
                        <Empty message="No Mission Data. Evaluation could not be completed.." />
                    )}
                </div>
            </div>
            <span className="text-xs uppercase absolute bottom-0 right-0 m-2">Time: <span className="opacity-50 mr-2">{time}</span> Last update: <span className="opacity-50">{dayjs(fetchedAt).fromNow()}</span></span>
        </div>
    )
}

export default MissionPage;