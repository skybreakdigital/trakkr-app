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

    const setCommander = (fid: string) => {
        window.electron.setState({ activeCommander: missionData[fid]});
        setActiveCommander(missionData[fid])
    }

    const fetchState = async () => {
        try {
            const state = await window.electron.getState();

            if(!state) return;

            if(state.activeCommander) {
                setActiveCommander(state.activeCommander);
            }
        } catch(e) {

        }
    }

    const fetchMissionData = async () => {
        try {
            const data: any = await window.electron.getMissionDetails();
            console.log('fetched mission data: ', data);
            setMissionData(data);
            setCommodityConfig(commodityData);
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
        fetchState();
        fetchMissionData();

        // Updates in real-time when the game write to the journal file
        window.electron.on('journal-file-updated', () => {
            fetchMissionData();
        });

        return () => {
            window.electron.removeListener('journal-file-updated', fetchMissionData);
        };
    }, []);

    useEffect(() => {
        if(!missionData) return;

        const updateStateWithMissionData = async () => {
            const { activeCommander: commander } = await window.electron.getState();

            const cmdrFIDs = Object.keys(missionData);

            if(cmdrFIDs.length > 0) {
                if(commander) {
                    const { fid: activeFID } = commander.info;
                    
                    if(activeFID && cmdrFIDs.includes(activeFID)) {
                        setCommander(activeFID);
                    }
                } else {
                    setCommander(cmdrFIDs[0]);
                }
            }
        }

        updateStateWithMissionData();
    }, [missionData]);

    const value = {
        missionData,
        commodityConfig,
        activeCommander,
        fetchedAt,
        loading,
        fetchMissionData,
        setCommander,
        updateCommodityConfig
    };

    return (
        <CommanderContext.Provider value={value}>
            {children}
        </CommanderContext.Provider>
    );
};
