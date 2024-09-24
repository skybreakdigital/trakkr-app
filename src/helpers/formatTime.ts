import dayjs from "dayjs";

export const formatUnder24hour = (expiration: string) => {
    const now = new Date();
    const exp = new Date(expiration);

    const diffInMs = exp.getTime() - now.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    return diffInHours <= 24 || diffInHours < 0 || isNaN(diffInHours);
}

export const setRemainingTime = (expiration: string) => {
    const now = dayjs();
    const exp = dayjs(expiration);

    const diff = exp.diff(now);

    if (diff > 0) {
        const duration = dayjs.duration(diff);
        const hours = Math.floor(duration.asHours());
        const minutes = duration.minutes().toString().padStart(2, '0');
        const seconds = duration.seconds().toString().padStart(2, '0');
    
        // Return the time remaining in HH:MM:SS format
        return `${hours}:${minutes}:${seconds}`;
      } else {
        // If time has passed, return 'Expired'
        return 'Expired';
      }
  }