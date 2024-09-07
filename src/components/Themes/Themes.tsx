import { useState } from 'react';
import './Themes.scss';

function Themes({ themeData }: any) {
    const [selectedTheme, setSelectedTheme]: any = useState('');

    const onThemeClick = (color: string) => {
        setSelectedTheme(color);
        document.documentElement.style.setProperty('--accent', color);
    }

    return (
        <div className="Themes w-full h-full flex flex-column justify-content-start gap-2 my-4">
            {Object.keys(themeData).map((key: any, index: number) => (
                <div key={index} className={`${themeData[key] === selectedTheme ? 'active' : ''} theme-item flex align-items-center gap-2 w-3`} onClick={() => onThemeClick(themeData[key])}>
                    <div className="color" style={{ background: themeData[key]}} />
                    <div className="uppercase">{key}</div>
                </div>
            ))}
        </div>
    )
}

export default Themes;