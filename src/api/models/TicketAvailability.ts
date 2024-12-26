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
 * @interface TicketAvailability
 */
export interface TicketAvailability {
    /**
     * 
     * @type {string}
     * @memberof TicketAvailability
     */
    ticketId: string;
    /**
     * 
     * @type {string}
     * @memberof TicketAvailability
     */
    ticketType: string;
    /**
     * 
     * @type {number}
     * @memberof TicketAvailability
     */
    price: number;
    /**
     * 
     * @type {boolean}
     * @memberof TicketAvailability
     */
    available: boolean;
    /**
     * 
     * @type {number}
     * @memberof TicketAvailability
     */
    totalSold: number;
}

/**
 * Check if a given object implements the TicketAvailability interface.
 */
export function instanceOfTicketAvailability(value: object): value is TicketAvailability {
    if (!('ticketId' in value) || value['ticketId'] === undefined) return false;
    if (!('ticketType' in value) || value['ticketType'] === undefined) return false;
    if (!('price' in value) || value['price'] === undefined) return false;
    if (!('available' in value) || value['available'] === undefined) return false;
    if (!('totalSold' in value) || value['totalSold'] === undefined) return false;
    return true;
}

export function TicketAvailabilityFromJSON(json: any): TicketAvailability {
    return TicketAvailabilityFromJSONTyped(json, false);
}

export function TicketAvailabilityFromJSONTyped(json: any, ignoreDiscriminator: boolean): TicketAvailability {
    if (json == null) {
        return json;
    }
    return {
        
        'ticketId': json['ticket_id'],
        'ticketType': json['ticket_type'],
        'price': json['price'],
        'available': json['available'],
        'totalSold': json['total_sold'],
    };
}

export function TicketAvailabilityToJSON(json: any): TicketAvailability {
    return TicketAvailabilityToJSONTyped(json, false);
}

export function TicketAvailabilityToJSONTyped(value?: TicketAvailability | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'ticket_id': value['ticketId'],
        'ticket_type': value['ticketType'],
        'price': value['price'],
        'available': value['available'],
        'total_sold': value['totalSold'],
    };
}

