import { useEffect, useState } from 'react';
import './TabMenu.scss';

function TabMenu({ menuItems, onClick }: any) {
    const [ selected, setSelected] = useState({});

    const onClickMenu = (item: any) => {
        setSelected(item);

        const updateMenu = menuItems.map((updateItem: any) => {
            return updateItem === item
             ? { ...item, active: true }
             : { ...updateItem, active: false };
        })

        onClick(updateMenu);
    }

    const getButtonClassName = (isActive: boolean) => (
        isActive ? 'accent flex align-items-center gap-2 active' : 'flex align-items-center gap-2'
    );

   if(!menuItems) return;

    return (
        <div className="TabMenu flex gap-2">
            {menuItems.map((item: any, index: number) => (
                <button key={index} className={getButtonClassName(item.active)} onClick={() => onClickMenu(item)}>
                    <div>{item.label}</div>
                    {item.data?.count && (
                        <div className="badge accent flex justify-content-center align-items-center">{item.data?.count}</div>
                    )}
                </button>
            ))}
        </div>
    );
}

export default TabMenu;