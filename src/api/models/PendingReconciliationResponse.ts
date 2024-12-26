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
import type { TransactionResponse } from './TransactionResponse';
import {
    TransactionResponseFromJSON,
    TransactionResponseFromJSONTyped,
    TransactionResponseToJSON,
    TransactionResponseToJSONTyped,
} from './TransactionResponse';

/**
 * 
 * @export
 * @interface PendingReconciliationResponse
 */
export interface PendingReconciliationResponse {
    /**
     * 
     * @type {number}
     * @memberof PendingReconciliationResponse
     */
    pendingCount: number;
    /**
     * 
     * @type {number}
     * @memberof PendingReconciliationResponse
     */
    totalUnreconciledAmount: number;
    /**
     * 
     * @type {Array<TransactionResponse>}
     * @memberof PendingReconciliationResponse
     */
    transactions: Array<TransactionResponse>;
}

/**
 * Check if a given object implements the PendingReconciliationResponse interface.
 */
export function instanceOfPendingReconciliationResponse(value: object): value is PendingReconciliationResponse {
    if (!('pendingCount' in value) || value['pendingCount'] === undefined) return false;
    if (!('totalUnreconciledAmount' in value) || value['totalUnreconciledAmount'] === undefined) return false;
    if (!('transactions' in value) || value['transactions'] === undefined) return false;
    return true;
}

export function PendingReconciliationResponseFromJSON(json: any): PendingReconciliationResponse {
    return PendingReconciliationResponseFromJSONTyped(json, false);
}

export function PendingReconciliationResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): PendingReconciliationResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'pendingCount': json['pending_count'],
        'totalUnreconciledAmount': json['total_unreconciled_amount'],
        'transactions': ((json['transactions'] as Array<any>).map(TransactionResponseFromJSON)),
    };
}

export function PendingReconciliationResponseToJSON(json: any): PendingReconciliationResponse {
    return PendingReconciliationResponseToJSONTyped(json, false);
}

export function PendingReconciliationResponseToJSONTyped(value?: PendingReconciliationResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'pending_count': value['pendingCount'],
        'total_unreconciled_amount': value['totalUnreconciledAmount'],
        'transactions': ((value['transactions'] as Array<any>).map(TransactionResponseToJSON)),
    };
}

