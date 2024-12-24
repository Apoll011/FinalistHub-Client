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
 * @interface ObservationResponse
 */
export interface ObservationResponse {
    /**
     * 
     * @type {string}
     * @memberof ObservationResponse
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof ObservationResponse
     */
    eventId: string;
    /**
     * 
     * @type {string}
     * @memberof ObservationResponse
     */
    content: string;
    /**
     * 
     * @type {Date}
     * @memberof ObservationResponse
     */
    createdAt: Date;
}

/**
 * Check if a given object implements the ObservationResponse interface.
 */
export function instanceOfObservationResponse(value: object): value is ObservationResponse {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('eventId' in value) || value['eventId'] === undefined) return false;
    if (!('content' in value) || value['content'] === undefined) return false;
    if (!('createdAt' in value) || value['createdAt'] === undefined) return false;
    return true;
}

export function ObservationResponseFromJSON(json: any): ObservationResponse {
    return ObservationResponseFromJSONTyped(json, false);
}

export function ObservationResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): ObservationResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'eventId': json['eventId'],
        'content': json['content'],
        'createdAt': (new Date(json['createdAt'])),
    };
}

export function ObservationResponseToJSON(json: any): ObservationResponse {
    return ObservationResponseToJSONTyped(json, false);
}

export function ObservationResponseToJSONTyped(value?: ObservationResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'id': value['id'],
        'eventId': value['eventId'],
        'content': value['content'],
        'createdAt': ((value['createdAt']).toISOString()),
    };
}
