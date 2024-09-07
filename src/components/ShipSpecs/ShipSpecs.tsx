import { useEffect, useState } from "react";
import './ShipSpecs.scss';
import { useCommanderState } from "../../context/Commander";

function ShipSpecs() {
    const { activeCommander }: any = useCommanderState();

    const [commander, setCommander]: any = useState({});

    useEffect(() => {
        if(!activeCommander) return;

        setCommander(activeCommander);
    }, [activeCommander]);

    return (
        <div className="ShipSpecs flex gap-2">
            <div className="item w-6">Ship: <span className="opacity-50">{commander?.info?.ship}</span></div>
            <div className="item w-6">Cargo: <span className="opacity-50"> {commander?.info?.cargo}</span></div>
        </div>
    )
}

export default ShipSpecs;