import { useEffect, useState } from "react";
import SectionTitle from "../components/SectionTitle/SectionTitle";
import TabMenu from "../components/TabMenu/TabMenu";
import Themes from "../components/Themes/Themes";
import themeData from "../helpers/themes.json";

function SettingPage() {
    const [menuItems, setMenuItems]: any = useState([
        { label: 'Themes', active: true }
    ]);
    const [themes, setThemes]: any = useState({});

    const onMenuClick = (updatedMenu: any) => {
        setMenuItems(updatedMenu);
    }

    const showUI = (label: string) => {
        return menuItems.find((item: any) => item.active).label === label;
    }

    useEffect(() => {
        setThemes(themeData);
    }, []);

    return (
        <div className="SettingPage">
             <SectionTitle title="Settings" />
             <TabMenu menuItems={menuItems} onClick={onMenuClick} />
             {showUI('Themes') && (
                <Themes themeData={themes} />
             )}
        </div>
    )
}

export default SettingPage;