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
 * @interface TicketSaleCreate
 */
export interface TicketSaleCreate {
    /**
     * 
     * @type {string}
     * @memberof TicketSaleCreate
     */
    ticketId: string;
    /**
     * 
     * @type {number}
     * @memberof TicketSaleCreate
     */
    quantity: number;
}

/**
 * Check if a given object implements the TicketSaleCreate interface.
 */
export function instanceOfTicketSaleCreate(value: object): value is TicketSaleCreate {
    if (!('ticketId' in value) || value['ticketId'] === undefined) return false;
    if (!('quantity' in value) || value['quantity'] === undefined) return false;
    return true;
}

export function TicketSaleCreateFromJSON(json: any): TicketSaleCreate {
    return TicketSaleCreateFromJSONTyped(json, false);
}

export function TicketSaleCreateFromJSONTyped(json: any, ignoreDiscriminator: boolean): TicketSaleCreate {
    if (json == null) {
        return json;
    }
    return {
        
        'ticketId': json['ticket_id'],
        'quantity': json['quantity'],
    };
}

export function TicketSaleCreateToJSON(json: any): TicketSaleCreate {
    return TicketSaleCreateToJSONTyped(json, false);
}

export function TicketSaleCreateToJSONTyped(value?: TicketSaleCreate | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'ticket_id': value['ticketId'],
        'quantity': value['quantity'],
    };
}

