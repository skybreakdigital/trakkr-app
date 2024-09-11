import { createContext, useContext, useEffect, useState } from "react";
import themeData from "../helpers/themes.json";

const CommanderContext = createContext({});

export const useCommanderState = () => useContext(CommanderContext);

export const CommanderProvider = ({ children }: any) => {
  const [missionData, setMissionData]: any = useState({});
  const [activeCommander, setActiveCommander]: any = useState(null);
  const [fetchedAt, setFetchedAt]: any = useState(null);
  const [state, setState]: any = useState({});
  const [loading, setLoading] = useState(true);

  const setCommander = (fid: string) => {
    window.electron.setState({ activeCommander: missionData[fid] });
    setActiveCommander(missionData[fid]);
  };

  const fetchState = async () => {
    try {
      const state = await window.electron.getState();

      if (!state) return;

      setState(state);

      if (state.activeCommander) {
        setActiveCommander(state.activeCommander);
      }
    } catch (e) {}
  };

  const fetchMissionData = async () => {
    try {
      const data: any = await window.electron.getMissionDetails();
      console.log("fetched mission data: ", data);
      setMissionData(data);
      setFetchedAt(new Date());
    } catch (error) {
      console.error("Error fetching mission data:", error);
    } finally {
      setLoading(false); // Data fetch is complete
    }
  };

  const setTheme = async (color: any) => {
    const theme = Object.keys(themeData).find(
      (key) => themeData[key as keyof typeof themeData] === color
    );

    await window.electron.setState({ theme });

    document.documentElement.style.setProperty("--accent", color);
  };

  const setCommodityConfig = async (config: any) => {
    await window.electron.setState({
      commodityConfig: config
    });
    fetchState();
  };

  const getTheme = async () => {
    const state = await window.electron.getState();

    const { theme } = state;

    if (theme) {
      setTheme(themeData[theme as keyof typeof themeData]);
    }
  };

  useEffect(() => {
    getTheme();
    fetchState();
    fetchMissionData();

    // Updates in real-time when the game write to the journal file
    window.electron.on("journal-file-updated", () => {
      fetchMissionData();
    });

    return () => {
      window.electron.removeListener("journal-file-updated", fetchMissionData);
    };
  }, []);

  useEffect(() => {
    if (!missionData) return;

    const updateStateWithMissionData = async () => {
      const data = await window.electron.getState();

      const { activeCommander: commander } = data;

      const cmdrFIDs = Object.keys(missionData);

      if (cmdrFIDs.length > 0) {
        if (commander) {
          const { fid: activeFID } = commander.info;

          if (activeFID && cmdrFIDs.includes(activeFID)) {
            setCommander(activeFID);
          }
        } else {
          setCommander(cmdrFIDs[0]);
        }
      }
    };

    updateStateWithMissionData();
  }, [missionData]);

  const value = {
    missionData,
    activeCommander,
    fetchedAt,
    loading,
    state,
    fetchMissionData,
    setCommander,
    setTheme,
    setCommodityConfig
  };

  return (
    <CommanderContext.Provider value={value}>
      {children}
    </CommanderContext.Provider>
  );
};
