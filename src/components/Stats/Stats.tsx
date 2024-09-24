import { formatNumber } from '../../helpers/formatNumber';
import './Stats.scss';

function Stats({ statData }: any) {
    return (
        <div className={`Stats flex ${Object.keys(statData).length > 3 ? 'flex-wrap gap-2' : 'gap-2'} mt-3 uppercase`}>
            {statData.map((data: any, index: number) => (
                <div key={index} className={`flex flex-column ${Object.keys(statData).length > 3 ? 'flex-grow-1 w-3' : 'w-full'} py-2 stat-item text-center ${data.classes}`}>
                    <div className="text-xl font-bold text-accent">{!isNaN(data.value) ? formatNumber(data.value) : data.value}{data.label === 'Total Tonnage' ? 'T' : ''}</div>
                    <div className="text-sm">{data.label}</div>
                </div>
            ))}
        </div>
    )
}

export default Stats;