import { createContext, useContext, useEffect, useState } from "react";
import commodityData from '../helpers/commodities.json';

const CommanderContext = createContext({});

export const useCommanderState = () => useContext(CommanderContext);

export const CommanderProvider = ({ children }: any) => {
    const [missionData, setMissionData]: any = useState({});
    const [commodityConfig, setCommodityConfig]: any = useState(null)
    const [activeCommander, setActiveCommander]: any = useState(null);
    const [fetchedAt, setFetchedAt]: any = useState(null);
    const [loading, setLoading] = useState(true);

    const chooseActiveCommander = (fid: string) => {
        setActiveCommander(missionData[fid])
    }

    const fetchMissionData = async () => {
        try {
            const data = await window.electron.getMissionDetails();
            setMissionData(data);
            setCommodityConfig(commodityData)
            setFetchedAt(new Date());
        } catch (error) {
            console.error("Error fetching mission data:", error);
        } finally {
            setLoading(false); // Data fetch is complete
        }
    }

    const updateCommodityConfig = (data: any) => {
        setCommodityConfig(data);
    }

    useEffect(() => {
        fetchMissionData();

        // Updates in real-time when the game write to the journal file
        window.electron.on('journal-file-updated', () => {
            fetchMissionData();
        });

        return () => {
            window.electron.removeListener('journal-file-updated', fetchMissionData);
        };
    }, []);

    const value = {
        missionData,
        // missionConfig,
        commodityConfig,
        activeCommander,
        fetchedAt,
        loading,
        chooseActiveCommander,
        updateCommodityConfig
    };

    return (
        <CommanderContext.Provider value={value}>
            {children}
        </CommanderContext.Provider>
    );
};
