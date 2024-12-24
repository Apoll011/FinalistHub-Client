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
import type { Period } from './Period';
import {
    PeriodFromJSON,
    PeriodFromJSONTyped,
    PeriodToJSON,
    PeriodToJSONTyped,
} from './Period';

/**
 * 
 * @export
 * @interface ProfitReportResponse
 */
export interface ProfitReportResponse {
    /**
     * 
     * @type {Period}
     * @memberof ProfitReportResponse
     */
    period: Period;
    /**
     * 
     * @type {number}
     * @memberof ProfitReportResponse
     */
    totalRevenue: number;
    /**
     * 
     * @type {number}
     * @memberof ProfitReportResponse
     */
    totalExpenses: number;
    /**
     * 
     * @type {number}
     * @memberof ProfitReportResponse
     */
    netProfit: number;
    /**
     * 
     * @type {number}
     * @memberof ProfitReportResponse
     */
    profitMargin: number;
}

/**
 * Check if a given object implements the ProfitReportResponse interface.
 */
export function instanceOfProfitReportResponse(value: object): value is ProfitReportResponse {
    if (!('period' in value) || value['period'] === undefined) return false;
    if (!('totalRevenue' in value) || value['totalRevenue'] === undefined) return false;
    if (!('totalExpenses' in value) || value['totalExpenses'] === undefined) return false;
    if (!('netProfit' in value) || value['netProfit'] === undefined) return false;
    if (!('profitMargin' in value) || value['profitMargin'] === undefined) return false;
    return true;
}

export function ProfitReportResponseFromJSON(json: any): ProfitReportResponse {
    return ProfitReportResponseFromJSONTyped(json, false);
}

export function ProfitReportResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): ProfitReportResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'period': PeriodFromJSON(json['period']),
        'totalRevenue': json['total_revenue'],
        'totalExpenses': json['total_expenses'],
        'netProfit': json['net_profit'],
        'profitMargin': json['profit_margin'],
    };
}

export function ProfitReportResponseToJSON(json: any): ProfitReportResponse {
    return ProfitReportResponseToJSONTyped(json, false);
}

export function ProfitReportResponseToJSONTyped(value?: ProfitReportResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'period': PeriodToJSON(value['period']),
        'total_revenue': value['totalRevenue'],
        'total_expenses': value['totalExpenses'],
        'net_profit': value['netProfit'],
        'profit_margin': value['profitMargin'],
    };
}
