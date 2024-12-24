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
 * @interface ReopenEventResponse
 */
export interface ReopenEventResponse {
    /**
     * 
     * @type {string}
     * @memberof ReopenEventResponse
     */
    id: string;
    /**
     * 
     * @type {EventStatus}
     * @memberof ReopenEventResponse
     */
    status: EventStatus;
}



/**
 * Check if a given object implements the ReopenEventResponse interface.
 */
export function instanceOfReopenEventResponse(value: object): value is ReopenEventResponse {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('status' in value) || value['status'] === undefined) return false;
    return true;
}

export function ReopenEventResponseFromJSON(json: any): ReopenEventResponse {
    return ReopenEventResponseFromJSONTyped(json, false);
}

export function ReopenEventResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): ReopenEventResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'status': EventStatusFromJSON(json['status']),
    };
}

export function ReopenEventResponseToJSON(json: any): ReopenEventResponse {
    return ReopenEventResponseToJSONTyped(json, false);
}

export function ReopenEventResponseToJSONTyped(value?: ReopenEventResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'id': value['id'],
        'status': EventStatusToJSON(value['status']),
    };
}
