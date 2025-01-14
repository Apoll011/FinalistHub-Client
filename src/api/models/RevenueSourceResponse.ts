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
 * @interface RevenueSourceResponse
 */
export interface RevenueSourceResponse {
    /**
     * 
     * @type {string}
     * @memberof RevenueSourceResponse
     */
    description: string;
    /**
     * 
     * @type {number}
     * @memberof RevenueSourceResponse
     */
    totalAmount: number;
    /**
     * 
     * @type {number}
     * @memberof RevenueSourceResponse
     */
    transactionCount: number;
}

/**
 * Check if a given object implements the RevenueSourceResponse interface.
 */
export function instanceOfRevenueSourceResponse(value: object): value is RevenueSourceResponse {
    if (!('description' in value) || value['description'] === undefined) return false;
    if (!('totalAmount' in value) || value['totalAmount'] === undefined) return false;
    if (!('transactionCount' in value) || value['transactionCount'] === undefined) return false;
    return true;
}

export function RevenueSourceResponseFromJSON(json: any): RevenueSourceResponse {
    return RevenueSourceResponseFromJSONTyped(json, false);
}

export function RevenueSourceResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): RevenueSourceResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'description': json['description'],
        'totalAmount': json['total_amount'],
        'transactionCount': json['transaction_count'],
    };
}

export function RevenueSourceResponseToJSON(json: any): RevenueSourceResponse {
    return RevenueSourceResponseToJSONTyped(json, false);
}

export function RevenueSourceResponseToJSONTyped(value?: RevenueSourceResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'description': value['description'],
        'total_amount': value['totalAmount'],
        'transaction_count': value['transactionCount'],
    };
}

