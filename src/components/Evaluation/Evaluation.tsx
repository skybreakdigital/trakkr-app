import { formatNumber } from '../../helpers/formatNumber';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import './Evaluation.scss';

dayjs.extend(relativeTime);

function Evaluation({ data }: any) {
    return (
        <div className="Evaluation uppercase">
            <div>Share Expiration: <span className="text-accent">{dayjs(data.shareDate).fromNow()}</span></div>
            <div>Stack Investment: <span className="text-accent">{formatNumber(data.investment)}</span></div>
            <div>Stack Profit: <span className="text-accent">{formatNumber(data.totalMissionValue - data.investment)}</span></div>
            <div>Total Share Value: <span className="text-accent">{formatNumber(data.totalMissionValue)}</span></div>
        </div>
    )
}

export default Evaluation;