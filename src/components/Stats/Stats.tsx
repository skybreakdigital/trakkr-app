import { formatNumber } from '../../helpers/formatNumber';
import './Stats.scss';

function Stats({ statData }: any) {
    return (
        <div className="Stats flex gap-3 mt-3 uppercase">
            {statData.map((data: any, index: number) => (
                <div key={index} className="flex flex-column w-full stat-item p-3 text-center">
                    <div className="text-xl font-bold text-accent">{formatNumber(data.value)}{data.label === 'Total Tonnage' ? 'T' : ''}</div>
                    <div className="text-sm">{data.label}</div>
                </div>
            ))}
        </div>
    )
}

export default Stats;