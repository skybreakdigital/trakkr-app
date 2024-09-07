export function formatNumber(num: number): string {
    if (isNaN(num)) {
        return '';
    }

    return `${num.toLocaleString('en-US')} CR`;
}