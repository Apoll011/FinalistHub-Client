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
import type { TicketSales } from './TicketSales';
import {
    TicketSalesFromJSON,
    TicketSalesFromJSONTyped,
    TicketSalesToJSON,
    TicketSalesToJSONTyped,
} from './TicketSales';
import type { ItemSales } from './ItemSales';
import {
    ItemSalesFromJSON,
    ItemSalesFromJSONTyped,
    ItemSalesToJSON,
    ItemSalesToJSONTyped,
} from './ItemSales';

/**
 * 
 * @export
 * @interface EventClosingResponse
 */
export interface EventClosingResponse {
    /**
     * 
     * @type {string}
     * @memberof EventClosingResponse
     */
    eventId: string;
    /**
     * 
     * @type {string}
     * @memberof EventClosingResponse
     */
    eventName: string;
    /**
     * 
     * @type {string}
     * @memberof EventClosingResponse
     */
    status: string;
    /**
     * 
     * @type {Date}
     * @memberof EventClosingResponse
     */
    closedAt: Date;
    /**
     * 
     * @type {object}
     * @memberof EventClosingResponse
     */
    financialSummary: object;
    /**
     * 
     * @type {TicketSales}
     * @memberof EventClosingResponse
     */
    ticketSales: TicketSales;
    /**
     * 
     * @type {ItemSales}
     * @memberof EventClosingResponse
     */
    itemSales: ItemSales;
}

/**
 * Check if a given object implements the EventClosingResponse interface.
 */
export function instanceOfEventClosingResponse(value: object): value is EventClosingResponse {
    if (!('eventId' in value) || value['eventId'] === undefined) return false;
    if (!('eventName' in value) || value['eventName'] === undefined) return false;
    if (!('status' in value) || value['status'] === undefined) return false;
    if (!('closedAt' in value) || value['closedAt'] === undefined) return false;
    if (!('financialSummary' in value) || value['financialSummary'] === undefined) return false;
    if (!('ticketSales' in value) || value['ticketSales'] === undefined) return false;
    if (!('itemSales' in value) || value['itemSales'] === undefined) return false;
    return true;
}

export function EventClosingResponseFromJSON(json: any): EventClosingResponse {
    return EventClosingResponseFromJSONTyped(json, false);
}

export function EventClosingResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): EventClosingResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'eventId': json['event_id'],
        'eventName': json['event_name'],
        'status': json['status'],
        'closedAt': (new Date(json['closed_at'])),
        'financialSummary': json['financial_summary'],
        'ticketSales': TicketSalesFromJSON(json['ticket_sales']),
        'itemSales': ItemSalesFromJSON(json['item_sales']),
    };
}

export function EventClosingResponseToJSON(json: any): EventClosingResponse {
    return EventClosingResponseToJSONTyped(json, false);
}

export function EventClosingResponseToJSONTyped(value?: EventClosingResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'event_id': value['eventId'],
        'event_name': value['eventName'],
        'status': value['status'],
        'closed_at': ((value['closedAt']).toISOString()),
        'financial_summary': value['financialSummary'],
        'ticket_sales': TicketSalesToJSON(value['ticketSales']),
        'item_sales': ItemSalesToJSON(value['itemSales']),
    };
}

