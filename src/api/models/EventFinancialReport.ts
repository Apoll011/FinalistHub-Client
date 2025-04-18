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
/**
 * 
 * @export
 * @interface EventFinancialReport
 */
export interface EventFinancialReport {
    /**
     * 
     * @type {number}
     * @memberof EventFinancialReport
     */
    ticketRevenue: number;
    /**
     * 
     * @type {number}
     * @memberof EventFinancialReport
     */
    itemRevenue: number;
    /**
     * 
     * @type {number}
     * @memberof EventFinancialReport
     */
    totalRevenue: number;
}

/**
 * Check if a given object implements the EventFinancialReport interface.
 */
export function instanceOfEventFinancialReport(value: object): value is EventFinancialReport {
    if (!('ticketRevenue' in value) || value['ticketRevenue'] === undefined) return false;
    if (!('itemRevenue' in value) || value['itemRevenue'] === undefined) return false;
    if (!('totalRevenue' in value) || value['totalRevenue'] === undefined) return false;
    return true;
}

export function EventFinancialReportFromJSON(json: any): EventFinancialReport {
    return EventFinancialReportFromJSONTyped(json, false);
}

export function EventFinancialReportFromJSONTyped(json: any, ignoreDiscriminator: boolean): EventFinancialReport {
    if (json == null) {
        return json;
    }
    return {
        
        'ticketRevenue': json['ticket_revenue'],
        'itemRevenue': json['item_revenue'],
        'totalRevenue': json['total_revenue'],
    };
}

export function EventFinancialReportToJSON(json: any): EventFinancialReport {
    return EventFinancialReportToJSONTyped(json, false);
}

export function EventFinancialReportToJSONTyped(value?: EventFinancialReport | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'ticket_revenue': value['ticketRevenue'],
        'item_revenue': value['itemRevenue'],
        'total_revenue': value['totalRevenue'],
    };
}

