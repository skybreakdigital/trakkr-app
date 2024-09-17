import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../../public/icon.png';
import './NavMenu.scss';
import { useEffect, useState } from 'react';

function NavMenu() {
    const navData = [
        {
            label: 'Missions',
            icon: 'fa-solid fa-boxes-stacked',
            hash: '#/main#/missions',
            url: '/main/missions',
            disabled: false
        },
        {
            label: 'Shares',
            icon: 'fa-solid fa-crosshairs',
            hash: '#/main#/shares',
            url: '/main/shares',
            disabled: true
        },
        {
            label: 'Settings',
            icon: 'fa-solid fa-cog',
            hash: '#/main#/settings',
            url: '/main/settings',
            disabled: false
        }
    ];
    const [entryHash, setEntryHash] = useState('#/main#/missions')
    const [firstLoadActive, setFirstLoadActive] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();

    const onNavButtonClick = (path: string) => {
        // window.location.hash = path;
        navigate(path);
        setFirstLoadActive(false);
    };

    const isActive = (url: string) => {
        return location.pathname === url;
    };

    return <div className="NavMenu flex flex-column justify-content-center align-items-center gap-3">
            <div className="brand">
                <img src={logo} />
            </div>
        {navData.map((data: any, index: number) => (
            <div
                key={index}
                className={`nav-item flex justify-content-center align-items-center ${(firstLoadActive && entryHash === data.hash) || isActive(data.url) ? "active" : ""} ${data.disabled ? "disabled" : ""}`}
                onClick={() => onNavButtonClick(data.url)}
            >
                <i className={data.icon} />
            </div>
        ))}
    </div>
}

export default NavMenu;