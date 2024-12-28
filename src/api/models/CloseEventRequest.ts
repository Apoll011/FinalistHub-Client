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
 * @interface CloseEventRequest
 */
export interface CloseEventRequest {
    /**
     * 
     * @type {string}
     * @memberof CloseEventRequest
     */
    eventId: string;
    /**
     * 
     * @type {string}
     * @memberof CloseEventRequest
     */
    userId: string;
    /**
     * 
     * @type {string}
     * @memberof CloseEventRequest
     */
    toAccountId: string;
}

/**
 * Check if a given object implements the CloseEventRequest interface.
 */
export function instanceOfCloseEventRequest(value: object): value is CloseEventRequest {
    if (!('eventId' in value) || value['eventId'] === undefined) return false;
    if (!('userId' in value) || value['userId'] === undefined) return false;
    if (!('toAccountId' in value) || value['toAccountId'] === undefined) return false;
    return true;
}

export function CloseEventRequestFromJSON(json: any): CloseEventRequest {
    return CloseEventRequestFromJSONTyped(json, false);
}

export function CloseEventRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): CloseEventRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'eventId': json['event_id'],
        'userId': json['user_id'],
        'toAccountId': json['to_account_id'],
    };
}

export function CloseEventRequestToJSON(json: any): CloseEventRequest {
    return CloseEventRequestToJSONTyped(json, false);
}

export function CloseEventRequestToJSONTyped(value?: CloseEventRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'event_id': value['eventId'],
        'user_id': value['userId'],
        'to_account_id': value['toAccountId'],
    };
}

