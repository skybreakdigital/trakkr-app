import { useEffect, useState } from "react";
import "./TabMenu.scss";
import dayjs from "dayjs";
import { useCommanderState } from "../../context/Commander";

function TabMenu({ menuItems, onClick }: any) {
  const { fetchMissionData, loading }: any = useCommanderState();

  const [selected, setSelected] = useState({});

  const onRefreshClick = () => {
    fetchMissionData();
  };

  const onClickMenu = (item: any) => {
    setSelected(item);

    const updateMenu = menuItems.map((updateItem: any) => {
      return updateItem === item
        ? { ...item, active: true }
        : { ...updateItem, active: false };
    });

    onClick(updateMenu);
  };

  const getButtonClassName = (isActive: boolean) =>
    isActive
      ? "accent flex align-items-center gap-2 active"
      : "flex align-items-center gap-2";

  return (
    <div className="TabMenu w-full">
      <div className="flex justify-content-between align-items-center">
        <div className="flex gap-3">
          {menuItems.map((item: any, index: number) => (
            <button
              key={index}
              className={getButtonClassName(item.active)}
              onClick={() => onClickMenu(item)}
            >
              <div>{item.label}</div>
              {item.data?.count && (
                <div className="badge accent flex justify-content-center align-items-center">
                  {item.data?.count}
                </div>
              )}
            </button>
          ))}
        </div>
        <div>
          <button className="primary" onClick={onRefreshClick}>
            {loading ? (
              <i className="fa-solid fa-spinner spin" />
            ) : (
              <i className="fa-solid fa-refresh" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TabMenu;
