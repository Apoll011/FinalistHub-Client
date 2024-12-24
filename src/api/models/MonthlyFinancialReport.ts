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
 * @interface MonthlyFinancialReport
 */
export interface MonthlyFinancialReport {
    /**
     * 
     * @type {number}
     * @memberof MonthlyFinancialReport
     */
    totalRevenue: number;
    /**
     * 
     * @type {number}
     * @memberof MonthlyFinancialReport
     */
    totalExpenses: number;
    /**
     * 
     * @type {number}
     * @memberof MonthlyFinancialReport
     */
    netIncome: number;
    /**
     * 
     * @type {Array<FinancialTransaction>}
     * @memberof MonthlyFinancialReport
     */
    transactions: Array<FinancialTransaction>;
    /**
     * 
     * @type {string}
     * @memberof MonthlyFinancialReport
     */
    month: string;
}

/**
 * Check if a given object implements the MonthlyFinancialReport interface.
 */
export function instanceOfMonthlyFinancialReport(value: object): value is MonthlyFinancialReport {
    if (!('totalRevenue' in value) || value['totalRevenue'] === undefined) return false;
    if (!('totalExpenses' in value) || value['totalExpenses'] === undefined) return false;
    if (!('netIncome' in value) || value['netIncome'] === undefined) return false;
    if (!('transactions' in value) || value['transactions'] === undefined) return false;
    if (!('month' in value) || value['month'] === undefined) return false;
    return true;
}

export function MonthlyFinancialReportFromJSON(json: any): MonthlyFinancialReport {
    return MonthlyFinancialReportFromJSONTyped(json, false);
}

export function MonthlyFinancialReportFromJSONTyped(json: any, ignoreDiscriminator: boolean): MonthlyFinancialReport {
    if (json == null) {
        return json;
    }
    return {
        
        'totalRevenue': json['total_revenue'],
        'totalExpenses': json['total_expenses'],
        'netIncome': json['net_income'],
        'transactions': ((json['transactions'] as Array<any>).map(FinancialTransactionFromJSON)),
        'month': json['month'],
    };
}

export function MonthlyFinancialReportToJSON(json: any): MonthlyFinancialReport {
    return MonthlyFinancialReportToJSONTyped(json, false);
}

export function MonthlyFinancialReportToJSONTyped(value?: MonthlyFinancialReport | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'total_revenue': value['totalRevenue'],
        'total_expenses': value['totalExpenses'],
        'net_income': value['netIncome'],
        'transactions': ((value['transactions'] as Array<any>).map(FinancialTransactionToJSON)),
        'month': value['month'],
    };
}

