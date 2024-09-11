import { useEffect, useState } from "react";
import "./Themes.scss";
import { useCommanderState } from "../../context/Commander";

function Themes({ themeData }: any) {
  const { setTheme }: any = useCommanderState();

  const [selectedTheme, setSelectedTheme]: any = useState("");

  const onThemeClick = (color: string) => {
    setSelectedTheme(color);
  };

  useEffect(() => {
    const getSelectedTheme = async () => {
      const state = await window.electron.getState();

      const { theme } = state;

      if (theme) {
        setSelectedTheme(themeData[theme]);
      }
    };

    getSelectedTheme();
  }, []);

  useEffect(() => {
    if (!selectedTheme) return;

    setTheme(selectedTheme);
  }, [selectedTheme]);

  return (
    <div className="Themes w-full h-full flex flex-column justify-content-start gap-2 my-4">
      {Object.keys(themeData).map((key: any, index: number) => (
        <div
          key={index}
          className={`${
            themeData[key] === selectedTheme ? "active" : ""
          } theme-item flex align-items-center gap-2 w-3`}
          onClick={() => onThemeClick(themeData[key])}
        >
          <div className="color" style={{ background: themeData[key] }} />
          <div className="uppercase">{key}</div>
        </div>
      ))}
    </div>
  );
}

export default Themes;
