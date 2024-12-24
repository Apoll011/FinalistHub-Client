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
 * @interface Sale
 */
export interface Sale {
    /**
     * 
     * @type {number}
     * @memberof Sale
     */
    quantitySold: number;
    /**
     * 
     * @type {string}
     * @memberof Sale
     */
    itemId: string;
    /**
     * 
     * @type {string}
     * @memberof Sale
     */
    id: string;
    /**
     * 
     * @type {number}
     * @memberof Sale
     */
    totalRevenue: number;
    /**
     * 
     * @type {Date}
     * @memberof Sale
     */
    timestamp: Date;
}

/**
 * Check if a given object implements the Sale interface.
 */
export function instanceOfSale(value: object): value is Sale {
    if (!('quantitySold' in value) || value['quantitySold'] === undefined) return false;
    if (!('itemId' in value) || value['itemId'] === undefined) return false;
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('totalRevenue' in value) || value['totalRevenue'] === undefined) return false;
    if (!('timestamp' in value) || value['timestamp'] === undefined) return false;
    return true;
}

export function SaleFromJSON(json: any): Sale {
    return SaleFromJSONTyped(json, false);
}

export function SaleFromJSONTyped(json: any, ignoreDiscriminator: boolean): Sale {
    if (json == null) {
        return json;
    }
    return {
        
        'quantitySold': json['quantity_sold'],
        'itemId': json['item_id'],
        'id': json['id'],
        'totalRevenue': json['total_revenue'],
        'timestamp': (new Date(json['timestamp'])),
    };
}

export function SaleToJSON(json: any): Sale {
    return SaleToJSONTyped(json, false);
}

export function SaleToJSONTyped(value?: Sale | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'quantity_sold': value['quantitySold'],
        'item_id': value['itemId'],
        'id': value['id'],
        'total_revenue': value['totalRevenue'],
        'timestamp': ((value['timestamp']).toISOString()),
    };
}
