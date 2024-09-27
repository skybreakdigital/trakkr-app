import { useEffect, useRef, useState } from "react";
import { useCommanderState } from "../../context/Commander";
import "./Config.scss";

function Config() {
  const { setCommodityConfig }: any = useCommanderState();

  const nameInputRef = useRef<HTMLInputElement>(null);

  const [config, setConfig]: any = useState({});
  const [initialConfig, setInitialConfig]: any = useState({});

  const onNameChange = (e: any, oldKey: string) => {
    const newKey = e.target.value.toLowerCase();

    if (!newKey.trim()) return;

    const updatedConfig = { ...config };

    if (updatedConfig[newKey]) {
      alert("A commodity with this name already exists.");
      return;
    }

    updatedConfig[newKey] = updatedConfig[oldKey];
    delete updatedConfig[oldKey];

    setConfig(updatedConfig);

    setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }, 0);
  };

  const onPriceChange = (e: any) => {
    const { value, name } = e.target;

    setConfig({
      ...config,
      [name]: value ? parseInt(value) : ""
    });
  };

  const onAddCommodityClick = () => {
    setConfig({
      ...config,
      ["new_commodity"]: 0
    });
  };

  const onSaveCommodity = async () => {
    setCommodityConfig(config);

    const commodityConfig = await getCommodityConfig();

    if (commodityConfig) {
      setInitialConfig(commodityConfig);
    }
  };

  const removeCommodity = (key: string) => {
    const updatedConfig = { ...config };
    delete updatedConfig[key];
    setConfig(updatedConfig);
    setCommodityConfig(updatedConfig);
  };

  const valueHasChanged = (key: string) => {
    return config[key] !== initialConfig[key];
  };

  const getCommodityConfig = async () => {
    const state = await window.electron.getState();

    const { commodityConfig } = state;

    return commodityConfig;
  };

  useEffect(() => {
    const fetchCommodityConfig = async () => {
      const commodityConfig = await getCommodityConfig();

      if (commodityConfig) {
        setConfig(commodityConfig);
        setInitialConfig(commodityConfig);
      }
    };

    fetchCommodityConfig();
  }, []);

  return (
    <div className="Config w-9">
      <div className="flex justify-content-between align-items-center p-3">
        <div className="text-md font-bold uppercase">Commodity Config</div>
        <div className="flex gap-2">
          <button className="primary" onClick={onAddCommodityClick}>
            <i className="fa-solid fa-plus" /> Add Commodity
          </button>
        </div>
      </div>
      <div className="w-6 section">
        {Object.keys(config).map((key) => (
          <div key={key} className="my-3 flex align-items-center gap-2">
            <input
              ref={nameInputRef}
              className="w-5 uppercase"
              name="name"
              value={key}
              onChange={(e) => onNameChange(e, key)}
            ></input>
            <input
              className="w-4"
              name={key}
              value={config[key]}
              onChange={onPriceChange}
            ></input>
            <div className="flex gap-2 w-3">
              <button className="primary" onClick={() => removeCommodity(key)}>
                <i className="fa-solid fa-times" />
              </button>
              {valueHasChanged(key) && (
                <button className="primary" onClick={onSaveCommodity}>
                  <i className="fa-solid fa-check text-accent" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Config;
