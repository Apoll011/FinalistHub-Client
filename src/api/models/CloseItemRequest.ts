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
 * @interface CloseItemRequest
 */
export interface CloseItemRequest {
    /**
     * 
     * @type {string}
     * @memberof CloseItemRequest
     */
    userId: string;
    /**
     * 
     * @type {string}
     * @memberof CloseItemRequest
     */
    toAccountId: string;
}

/**
 * Check if a given object implements the CloseItemRequest interface.
 */
export function instanceOfCloseItemRequest(value: object): value is CloseItemRequest {
    if (!('userId' in value) || value['userId'] === undefined) return false;
    if (!('toAccountId' in value) || value['toAccountId'] === undefined) return false;
    return true;
}

export function CloseItemRequestFromJSON(json: any): CloseItemRequest {
    return CloseItemRequestFromJSONTyped(json, false);
}

export function CloseItemRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): CloseItemRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'userId': json['user_id'],
        'toAccountId': json['to_account_id'],
    };
}

export function CloseItemRequestToJSON(json: any): CloseItemRequest {
    return CloseItemRequestToJSONTyped(json, false);
}

export function CloseItemRequestToJSONTyped(value?: CloseItemRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'user_id': value['userId'],
        'to_account_id': value['toAccountId'],
    };
}

