/* tslint:disable */
/* eslint-disable */
/**
 * Events Management API
 * This API provides comprehensive management of events, including detailed analytics, revenue tracking, rescheduling, cancellations, and insights into capacity and sales performance.
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { DailyBreakdown } from './DailyBreakdown';
import {
    DailyBreakdownFromJSON,
    DailyBreakdownFromJSONTyped,
    DailyBreakdownToJSON,
    DailyBreakdownToJSONTyped,
} from './DailyBreakdown';

/**
 * 
 * @export
 * @interface DailyRevenueResponse
 */
export interface DailyRevenueResponse {
    /**
     * 
     * @type {Array<DailyBreakdown>}
     * @memberof DailyRevenueResponse
     */
    dailyBreakdown: Array<DailyBreakdown>;
}

/**
 * Check if a given object implements the DailyRevenueResponse interface.
 */
export function instanceOfDailyRevenueResponse(value: object): value is DailyRevenueResponse {
    if (!('dailyBreakdown' in value) || value['dailyBreakdown'] === undefined) return false;
    return true;
}

export function DailyRevenueResponseFromJSON(json: any): DailyRevenueResponse {
    return DailyRevenueResponseFromJSONTyped(json, false);
}

export function DailyRevenueResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): DailyRevenueResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'dailyBreakdown': ((json['daily_breakdown'] as Array<any>).map(DailyBreakdownFromJSON)),
    };
}

export function DailyRevenueResponseToJSON(json: any): DailyRevenueResponse {
    return DailyRevenueResponseToJSONTyped(json, false);
}

export function DailyRevenueResponseToJSONTyped(value?: DailyRevenueResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'daily_breakdown': ((value['dailyBreakdown'] as Array<any>).map(DailyBreakdownToJSON)),
    };
}

