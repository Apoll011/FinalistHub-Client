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
/**
 * 
 * @export
 * @interface EventRevenueRanking
 */
export interface EventRevenueRanking {
    /**
     * 
     * @type {string}
     * @memberof EventRevenueRanking
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof EventRevenueRanking
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof EventRevenueRanking
     */
    date: string;
    /**
     * 
     * @type {number}
     * @memberof EventRevenueRanking
     */
    ticketRevenue: number;
    /**
     * 
     * @type {number}
     * @memberof EventRevenueRanking
     */
    itemRevenue: number;
    /**
     * 
     * @type {number}
     * @memberof EventRevenueRanking
     */
    totalRevenue: number;
}

/**
 * Check if a given object implements the EventRevenueRanking interface.
 */
export function instanceOfEventRevenueRanking(value: object): value is EventRevenueRanking {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('date' in value) || value['date'] === undefined) return false;
    if (!('ticketRevenue' in value) || value['ticketRevenue'] === undefined) return false;
    if (!('itemRevenue' in value) || value['itemRevenue'] === undefined) return false;
    if (!('totalRevenue' in value) || value['totalRevenue'] === undefined) return false;
    return true;
}

export function EventRevenueRankingFromJSON(json: any): EventRevenueRanking {
    return EventRevenueRankingFromJSONTyped(json, false);
}

export function EventRevenueRankingFromJSONTyped(json: any, ignoreDiscriminator: boolean): EventRevenueRanking {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'name': json['name'],
        'date': json['date'],
        'ticketRevenue': json['ticket_revenue'],
        'itemRevenue': json['item_revenue'],
        'totalRevenue': json['total_revenue'],
    };
}

export function EventRevenueRankingToJSON(json: any): EventRevenueRanking {
    return EventRevenueRankingToJSONTyped(json, false);
}

export function EventRevenueRankingToJSONTyped(value?: EventRevenueRanking | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'id': value['id'],
        'name': value['name'],
        'date': value['date'],
        'ticket_revenue': value['ticketRevenue'],
        'item_revenue': value['itemRevenue'],
        'total_revenue': value['totalRevenue'],
    };
}
