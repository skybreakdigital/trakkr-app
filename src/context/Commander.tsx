import { createContext, useContext, useEffect, useState } from "react";
import themeData from "../helpers/themes.json";

const CommanderContext = createContext({});

export const useCommanderState = () => useContext(CommanderContext);

export const CommanderProvider = ({ children }: any) => {
  const [missionData, setMissionData]: any = useState(null);
  const [activeCommander, setActiveCommander]: any = useState(null);
  const [fetchedAt, setFetchedAt]: any = useState(null);
  const [state, setState]: any = useState({});
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const data: any = await window.electron.getMissionDetails();
      setMissionData(data);
      setFetchedAt(new Date());
    } catch (error) {
      console.error("Error fetching mission data:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
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
    getTheme();
    fetchState();
    fetchMissionData();

    // Updates in real-time when the game write to the journal file
    window.electron.on("journal-file-updated", () => {
      setLoading(true);

      setTimeout(() => {
        fetchMissionData();
      }, 1000);
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

      const commanderData = sortCommanders(missionData);
      const cmdrFIDs = Object.keys(commanderData)
        .sort(([keyA], [keyB]) => {
          const numA = parseInt(keyA.slice(1), 10);
          const numB = parseInt(keyB.slice(1), 10);

          // Sort numerically
          return numA - numB;
        });

      if (cmdrFIDs.length > 0) {
        if (commander.info) {
          const { fid: activeFID } = commander?.info;

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
