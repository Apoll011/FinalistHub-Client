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
import type { FinancialTransaction } from './FinancialTransaction';
import {
    FinancialTransactionFromJSON,
    FinancialTransactionFromJSONTyped,
    FinancialTransactionToJSON,
    FinancialTransactionToJSONTyped,
} from './FinancialTransaction';

/**
 * 
 * @export
 * @interface FinancialReport
 */
export interface FinancialReport {
    /**
     * 
     * @type {number}
     * @memberof FinancialReport
     */
    totalRevenue: number;
    /**
     * 
     * @type {number}
     * @memberof FinancialReport
     */
    totalExpenses: number;
    /**
     * 
     * @type {number}
     * @memberof FinancialReport
     */
    netIncome: number;
    /**
     * 
     * @type {Array<FinancialTransaction>}
     * @memberof FinancialReport
     */
    transactions: Array<FinancialTransaction>;
}

/**
 * Check if a given object implements the FinancialReport interface.
 */
export function instanceOfFinancialReport(value: object): value is FinancialReport {
    if (!('totalRevenue' in value) || value['totalRevenue'] === undefined) return false;
    if (!('totalExpenses' in value) || value['totalExpenses'] === undefined) return false;
    if (!('netIncome' in value) || value['netIncome'] === undefined) return false;
    if (!('transactions' in value) || value['transactions'] === undefined) return false;
    return true;
}

export function FinancialReportFromJSON(json: any): FinancialReport {
    return FinancialReportFromJSONTyped(json, false);
}

export function FinancialReportFromJSONTyped(json: any, ignoreDiscriminator: boolean): FinancialReport {
    if (json == null) {
        return json;
    }
    return {
        
        'totalRevenue': json['total_revenue'],
        'totalExpenses': json['total_expenses'],
        'netIncome': json['net_income'],
        'transactions': ((json['transactions'] as Array<any>).map(FinancialTransactionFromJSON)),
    };
}

export function FinancialReportToJSON(json: any): FinancialReport {
    return FinancialReportToJSONTyped(json, false);
}

export function FinancialReportToJSONTyped(value?: FinancialReport | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'total_revenue': value['totalRevenue'],
        'total_expenses': value['totalExpenses'],
        'net_income': value['netIncome'],
        'transactions': ((value['transactions'] as Array<any>).map(FinancialTransactionToJSON)),
    };
}

