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
 * @interface TransferHistoryResponse
 */
export interface TransferHistoryResponse {
    /**
     * 
     * @type {number}
     * @memberof TransferHistoryResponse
     */
    totalTransfers: number;
    /**
     * 
     * @type {number}
     * @memberof TransferHistoryResponse
     */
    totalAmountTransferred: number;
    /**
     * 
     * @type {Array<TransactionResponse>}
     * @memberof TransferHistoryResponse
     */
    transfers: Array<TransactionResponse>;
}

/**
 * Check if a given object implements the TransferHistoryResponse interface.
 */
export function instanceOfTransferHistoryResponse(value: object): value is TransferHistoryResponse {
    if (!('totalTransfers' in value) || value['totalTransfers'] === undefined) return false;
    if (!('totalAmountTransferred' in value) || value['totalAmountTransferred'] === undefined) return false;
    if (!('transfers' in value) || value['transfers'] === undefined) return false;
    return true;
}

export function TransferHistoryResponseFromJSON(json: any): TransferHistoryResponse {
    return TransferHistoryResponseFromJSONTyped(json, false);
}

export function TransferHistoryResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): TransferHistoryResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'totalTransfers': json['total_transfers'],
        'totalAmountTransferred': json['total_amount_transferred'],
        'transfers': ((json['transfers'] as Array<any>).map(TransactionResponseFromJSON)),
    };
}

export function TransferHistoryResponseToJSON(json: any): TransferHistoryResponse {
    return TransferHistoryResponseToJSONTyped(json, false);
}

export function TransferHistoryResponseToJSONTyped(value?: TransferHistoryResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'total_transfers': value['totalTransfers'],
        'total_amount_transferred': value['totalAmountTransferred'],
        'transfers': ((value['transfers'] as Array<any>).map(TransactionResponseToJSON)),
    };
}

