export const TIMES = {
    ONE_MILLISECOND: 1,
    ONE_SECOND: 1000,
    ONE_MINUTE: 60 * 1000,
    ONE_HOUR: 60 * 60 * 1000,
    ONE_DAY: 24 * 60 * 60 * 1000,
    ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
    
    milliseconds: (value: number) => value,
    seconds: (value: number) => value * 1000,
    minutes: (value: number) => value * 60 * 1000,
    hours: (value: number) => value * 60 * 60 * 1000,
    days: (value: number) => value * 24 * 60 * 60 * 1000,
    weeks: (value: number) => value * 7 * 24 * 60 * 60 * 1000,
};