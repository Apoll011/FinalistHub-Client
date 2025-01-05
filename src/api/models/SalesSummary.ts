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
import type { SalesByPaymentMethod } from './SalesByPaymentMethod';
import {
    SalesByPaymentMethodFromJSON,
    SalesByPaymentMethodFromJSONTyped,
    SalesByPaymentMethodToJSON,
    SalesByPaymentMethodToJSONTyped,
} from './SalesByPaymentMethod';

/**
 * 
 * @export
 * @interface SalesSummary
 */
export interface SalesSummary {
    /**
     * 
     * @type {number}
     * @memberof SalesSummary
     */
    totalQuantitySold: number;
    /**
     * 
     * @type {number}
     * @memberof SalesSummary
     */
    totalRevenue: number;
    /**
     * 
     * @type {Array<SalesByPaymentMethod>}
     * @memberof SalesSummary
     */
    salesByPaymentMethod: Array<SalesByPaymentMethod>;
}

/**
 * Check if a given object implements the SalesSummary interface.
 */
export function instanceOfSalesSummary(value: object): value is SalesSummary {
    if (!('totalQuantitySold' in value) || value['totalQuantitySold'] === undefined) return false;
    if (!('totalRevenue' in value) || value['totalRevenue'] === undefined) return false;
    if (!('salesByPaymentMethod' in value) || value['salesByPaymentMethod'] === undefined) return false;
    return true;
}

export function SalesSummaryFromJSON(json: any): SalesSummary {
    return SalesSummaryFromJSONTyped(json, false);
}

export function SalesSummaryFromJSONTyped(json: any, ignoreDiscriminator: boolean): SalesSummary {
    if (json == null) {
        return json;
    }
    return {
        
        'totalQuantitySold': json['total_quantity_sold'],
        'totalRevenue': json['total_revenue'],
        'salesByPaymentMethod': ((json['sales_by_payment_method'] as Array<any>).map(SalesByPaymentMethodFromJSON)),
    };
}

export function SalesSummaryToJSON(json: any): SalesSummary {
    return SalesSummaryToJSONTyped(json, false);
}

export function SalesSummaryToJSONTyped(value?: SalesSummary | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'total_quantity_sold': value['totalQuantitySold'],
        'total_revenue': value['totalRevenue'],
        'sales_by_payment_method': ((value['salesByPaymentMethod'] as Array<any>).map(SalesByPaymentMethodToJSON)),
    };
}

