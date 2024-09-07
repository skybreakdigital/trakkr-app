import { useEffect, useState } from "react";
import { useCommanderState } from "../../context/Commander";
import SectionTitle from "../SectionTitle/SectionTitle";
import commodityData from '../../helpers/commodities.json';
import './Config.scss';

function Config() {
    const { commodityConfig, updateCommodityConfig }: any = useCommanderState();

    const [config, setConfig]: any = useState({});

    const onChange = (e: any) => {
        const {
            value,
            name
        } = e.target;

        setConfig({
            ...commodityConfig,
            [name]: parseInt(value)
        });
    }

    const onSaveClick = async () => {
        updateCommodityConfig(commodityConfig);
    }

    useEffect(() => {
        if(!commodityConfig) return;

        setConfig(commodityConfig);
    }, [commodityConfig]);

    return (
        <div className="Config w-8">
            <SectionTitle title="Commodity Config" />
            <div className="w-6 section">
                {Object.keys(config).map(key => (
                    <div key={key} className="my-3 flex flex-column w-4">
                        <label className="text-md uppercase">{key}</label>
                        <div className="flex align-items-center gap-1">
                            <input name={key} value={config[key]} onChange={onChange} disabled={true}></input>
                            <div>CR</div>
                        </div>
                    </div>
                ))}
                {/* <button className="accent" onClick={onSaveClick}>Save</button> */}
            </div>
        </div>
    )
}

export default Config;