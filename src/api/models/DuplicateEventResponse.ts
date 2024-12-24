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
 * @interface DuplicateEventResponse
 */
export interface DuplicateEventResponse {
    /**
     * 
     * @type {string}
     * @memberof DuplicateEventResponse
     */
    newEventId: string;
    /**
     * 
     * @type {string}
     * @memberof DuplicateEventResponse
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof DuplicateEventResponse
     */
    date: string;
    /**
     * 
     * @type {Date}
     * @memberof DuplicateEventResponse
     */
    time: Date;
}

/**
 * Check if a given object implements the DuplicateEventResponse interface.
 */
export function instanceOfDuplicateEventResponse(value: object): value is DuplicateEventResponse {
    if (!('newEventId' in value) || value['newEventId'] === undefined) return false;
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('date' in value) || value['date'] === undefined) return false;
    if (!('time' in value) || value['time'] === undefined) return false;
    return true;
}

export function DuplicateEventResponseFromJSON(json: any): DuplicateEventResponse {
    return DuplicateEventResponseFromJSONTyped(json, false);
}

export function DuplicateEventResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): DuplicateEventResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'newEventId': json['new_event_id'],
        'name': json['name'],
        'date': json['date'],
        'time': (new Date(json['time'])),
    };
}

export function DuplicateEventResponseToJSON(json: any): DuplicateEventResponse {
    return DuplicateEventResponseToJSONTyped(json, false);
}

export function DuplicateEventResponseToJSONTyped(value?: DuplicateEventResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'new_event_id': value['newEventId'],
        'name': value['name'],
        'date': value['date'],
        'time': ((value['time']).toISOString()),
    };
}
