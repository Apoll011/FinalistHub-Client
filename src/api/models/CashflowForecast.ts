/* tslint:disable */
/* eslint-disable */
/**
 * Events Management API
 * This API provides comprehensive management of events, including detailed analytics, revenue tracking, rescheduling, cancellations, and insights into capacity and sales performance.
 *
 * The version of the OpenAPI document: 1.4.6
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { DailyForecast } from './DailyForecast';
import {
    DailyForecastFromJSON,
    DailyForecastFromJSONTyped,
    DailyForecastToJSON,
    DailyForecastToJSONTyped,
} from './DailyForecast';

/**
 * 
 * @export
 * @interface CashflowForecast
 */
export interface CashflowForecast {
    /**
     * 
     * @type {number}
     * @memberof CashflowForecast
     */
    startingBalance: number;
    /**
     * 
     * @type {number}
     * @memberof CashflowForecast
     */
    forecastPeriodDays: number;
    /**
     * 
     * @type {Array<DailyForecast>}
     * @memberof CashflowForecast
     */
    dailyForecasts: Array<DailyForecast>;
}

/**
 * Check if a given object implements the CashflowForecast interface.
 */
export function instanceOfCashflowForecast(value: object): value is CashflowForecast {
    if (!('startingBalance' in value) || value['startingBalance'] === undefined) return false;
    if (!('forecastPeriodDays' in value) || value['forecastPeriodDays'] === undefined) return false;
    if (!('dailyForecasts' in value) || value['dailyForecasts'] === undefined) return false;
    return true;
}

export function CashflowForecastFromJSON(json: any): CashflowForecast {
    return CashflowForecastFromJSONTyped(json, false);
}

export function CashflowForecastFromJSONTyped(json: any, ignoreDiscriminator: boolean): CashflowForecast {
    if (json == null) {
        return json;
    }
    return {
        
        'startingBalance': json['starting_balance'],
        'forecastPeriodDays': json['forecast_period_days'],
        'dailyForecasts': ((json['daily_forecasts'] as Array<any>).map(DailyForecastFromJSON)),
    };
}

export function CashflowForecastToJSON(json: any): CashflowForecast {
    return CashflowForecastToJSONTyped(json, false);
}

export function CashflowForecastToJSONTyped(value?: CashflowForecast | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'starting_balance': value['startingBalance'],
        'forecast_period_days': value['forecastPeriodDays'],
        'daily_forecasts': ((value['dailyForecasts'] as Array<any>).map(DailyForecastToJSON)),
    };
}

