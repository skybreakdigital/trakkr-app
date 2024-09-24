import { formatCredit, formatNumber } from '../../helpers/formatNumber';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import './Evaluation.scss';

dayjs.extend(relativeTime);

function Evaluation({ data }: any) {
    const formatKey = (key: string) => {
        const formatted = key.replace(/([A-Z])/g, ' $1').trim();
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }

    return (
        <div className="Evaluation uppercase">
            {Object.keys(data).map((key: any) => (
                <div key={key}>{formatKey(key)}: <span className="text-accent">{data[key]}</span></div>
            ))}
           
            {/* <div>Stack Investment: <span className="text-accent">{formatCredit(data.investment)}</span></div>
            <div>Stack Profit: <span className="text-accent">{formatCredit(data.totalMissionValue - data.investment)}</span></div>
            <div>Total Share Value: <span className="text-accent">{formatCredit(data.totalMissionValue)}</span></div> */}
        </div>
    )
}

export default Evaluation;