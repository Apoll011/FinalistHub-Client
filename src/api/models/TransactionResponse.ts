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
import type { TransactionType } from './TransactionType';
import {
    TransactionTypeFromJSON,
    TransactionTypeFromJSONTyped,
    TransactionTypeToJSON,
    TransactionTypeToJSONTyped,
} from './TransactionType';
import type { PaymentMethod } from './PaymentMethod';
import {
    PaymentMethodFromJSON,
    PaymentMethodFromJSONTyped,
    PaymentMethodToJSON,
    PaymentMethodToJSONTyped,
} from './PaymentMethod';

/**
 * 
 * @export
 * @interface TransactionResponse
 */
export interface TransactionResponse {
    /**
     * 
     * @type {TransactionType}
     * @memberof TransactionResponse
     */
    type: TransactionType;
    /**
     * 
     * @type {number}
     * @memberof TransactionResponse
     */
    amount: number;
    /**
     * 
     * @type {string}
     * @memberof TransactionResponse
     */
    description?: string | null;
    /**
     * 
     * @type {PaymentMethod}
     * @memberof TransactionResponse
     */
    paymentMethod?: PaymentMethod | null;
    /**
     * 
     * @type {string}
     * @memberof TransactionResponse
     */
    fromAccountId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof TransactionResponse
     */
    toAccountId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof TransactionResponse
     */
    categoryId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof TransactionResponse
     */
    eventId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof TransactionResponse
     */
    receiptNumber?: string | null;
    /**
     * 
     * @type {string}
     * @memberof TransactionResponse
     */
    notes?: string | null;
    /**
     * 
     * @type {string}
     * @memberof TransactionResponse
     */
    createdBy?: string | null;
    /**
     * 
     * @type {Date}
     * @memberof TransactionResponse
     */
    createdAt: Date;
    /**
     * 
     * @type {Date}
     * @memberof TransactionResponse
     */
    updatedAt: Date;
    /**
     * 
     * @type {string}
     * @memberof TransactionResponse
     */
    id: string;
}



/**
 * Check if a given object implements the TransactionResponse interface.
 */
export function instanceOfTransactionResponse(value: object): value is TransactionResponse {
    if (!('type' in value) || value['type'] === undefined) return false;
    if (!('amount' in value) || value['amount'] === undefined) return false;
    if (!('createdAt' in value) || value['createdAt'] === undefined) return false;
    if (!('updatedAt' in value) || value['updatedAt'] === undefined) return false;
    if (!('id' in value) || value['id'] === undefined) return false;
    return true;
}

export function TransactionResponseFromJSON(json: any): TransactionResponse {
    return TransactionResponseFromJSONTyped(json, false);
}

export function TransactionResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): TransactionResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'type': TransactionTypeFromJSON(json['type']),
        'amount': json['amount'],
        'description': json['description'] == null ? undefined : json['description'],
        'paymentMethod': json['payment_method'] == null ? undefined : PaymentMethodFromJSON(json['payment_method']),
        'fromAccountId': json['from_account_id'] == null ? undefined : json['from_account_id'],
        'toAccountId': json['to_account_id'] == null ? undefined : json['to_account_id'],
        'categoryId': json['category_id'] == null ? undefined : json['category_id'],
        'eventId': json['event_id'] == null ? undefined : json['event_id'],
        'receiptNumber': json['receipt_number'] == null ? undefined : json['receipt_number'],
        'notes': json['notes'] == null ? undefined : json['notes'],
        'createdBy': json['created_by'] == null ? undefined : json['created_by'],
        'createdAt': (new Date(json['created_at'])),
        'updatedAt': (new Date(json['updated_at'])),
        'id': json['id'],
    };
}

export function TransactionResponseToJSON(json: any): TransactionResponse {
    return TransactionResponseToJSONTyped(json, false);
}

export function TransactionResponseToJSONTyped(value?: TransactionResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'type': TransactionTypeToJSON(value['type']),
        'amount': value['amount'],
        'description': value['description'],
        'payment_method': PaymentMethodToJSON(value['paymentMethod']),
        'from_account_id': value['fromAccountId'],
        'to_account_id': value['toAccountId'],
        'category_id': value['categoryId'],
        'event_id': value['eventId'],
        'receipt_number': value['receiptNumber'],
        'notes': value['notes'],
        'created_by': value['createdBy'],
        'created_at': ((value['createdAt']).toISOString()),
        'updated_at': ((value['updatedAt']).toISOString()),
        'id': value['id'],
    };
}

