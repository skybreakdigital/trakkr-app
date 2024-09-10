import { useEffect, useState } from "react";
import { useCommanderState } from "../../context/Commander";
import "./Config.scss";

function Config() {
  const { setCommodityConfig }: any = useCommanderState();

  const [config, setConfig]: any = useState({});

  const onChange = (e: any) => {
    const { value, name } = e.target;

    setConfig({
      ...config,
      [name]: parseInt(value)
    });
  };

  const onAddCommodityClick = () => {
    setConfig({
      ...config
    });
  };

  const onSaveClick = async () => {
    setCommodityConfig(config);
  };

  useEffect(() => {
    const getCommodityConfig = async () => {
      const state = await window.electron.getState();

      const { commodityConfig } = state;

      if (commodityConfig) {
        setConfig(commodityConfig);
      }
    };

    getCommodityConfig();
  }, []);

  return (
    <div className="Config w-8">
      <div className="flex justify-content-between align-items-center p-3">
        <div className="text-md font-bold uppercase">Commodity Config</div>
        <div className="flex gap-2">
          <button className="primary">
            <i className="fa-solid fa-plus" /> Add Commodity
          </button>
          <button className="accent" onClick={onSaveClick}>
            Save
          </button>
        </div>
      </div>
      <div className="px-3">
        Available commodities are managed by{" "}
        <span className="font-bold">Trakkr</span>. Not all commodities will be
        available.
      </div>
      <div className="w-6 section">
        {Object.keys(config).map((key) => (
          <div key={key} className="my-3 flex align-items-center gap-2 w-6">
            <label className="text-md uppercase w-6">{key}</label>
            <div className="flex align-items-center gap-1 w-6">
              <input name={key} value={config[key]} onChange={onChange}></input>
              <div className="flex gap-2">
                <button className="primary">
                  <i className="fa-solid fa-times" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Config;
