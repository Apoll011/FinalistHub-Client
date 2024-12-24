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
import type { EventStatus } from './EventStatus';
import {
    EventStatusFromJSON,
    EventStatusFromJSONTyped,
    EventStatusToJSON,
    EventStatusToJSONTyped,
} from './EventStatus';

/**
 * 
 * @export
 * @interface CapacityAnalysisEvent
 */
export interface CapacityAnalysisEvent {
    /**
     * 
     * @type {string}
     * @memberof CapacityAnalysisEvent
     */
    eventId: string;
    /**
     * 
     * @type {string}
     * @memberof CapacityAnalysisEvent
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof CapacityAnalysisEvent
     */
    date: string;
    /**
     * 
     * @type {number}
     * @memberof CapacityAnalysisEvent
     */
    ticketsSold: number;
    /**
     * 
     * @type {EventStatus}
     * @memberof CapacityAnalysisEvent
     */
    status: EventStatus;
}



/**
 * Check if a given object implements the CapacityAnalysisEvent interface.
 */
export function instanceOfCapacityAnalysisEvent(value: object): value is CapacityAnalysisEvent {
    if (!('eventId' in value) || value['eventId'] === undefined) return false;
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('date' in value) || value['date'] === undefined) return false;
    if (!('ticketsSold' in value) || value['ticketsSold'] === undefined) return false;
    if (!('status' in value) || value['status'] === undefined) return false;
    return true;
}

export function CapacityAnalysisEventFromJSON(json: any): CapacityAnalysisEvent {
    return CapacityAnalysisEventFromJSONTyped(json, false);
}

export function CapacityAnalysisEventFromJSONTyped(json: any, ignoreDiscriminator: boolean): CapacityAnalysisEvent {
    if (json == null) {
        return json;
    }
    return {
        
        'eventId': json['event_id'],
        'name': json['name'],
        'date': json['date'],
        'ticketsSold': json['tickets_sold'],
        'status': EventStatusFromJSON(json['status']),
    };
}

export function CapacityAnalysisEventToJSON(json: any): CapacityAnalysisEvent {
    return CapacityAnalysisEventToJSONTyped(json, false);
}

export function CapacityAnalysisEventToJSONTyped(value?: CapacityAnalysisEvent | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'event_id': value['eventId'],
        'name': value['name'],
        'date': value['date'],
        'tickets_sold': value['ticketsSold'],
        'status': EventStatusToJSON(value['status']),
    };
}

