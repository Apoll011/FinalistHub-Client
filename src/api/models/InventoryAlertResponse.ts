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
import type { LowStockItemResponse } from './LowStockItemResponse';
import {
    LowStockItemResponseFromJSON,
    LowStockItemResponseFromJSONTyped,
    LowStockItemResponseToJSON,
    LowStockItemResponseToJSONTyped,
} from './LowStockItemResponse';

/**
 * 
 * @export
 * @interface InventoryAlertResponse
 */
export interface InventoryAlertResponse {
    /**
     * 
     * @type {Array<LowStockItemResponse>}
     * @memberof InventoryAlertResponse
     */
    lowStockItems: Array<LowStockItemResponse>;
}

/**
 * Check if a given object implements the InventoryAlertResponse interface.
 */
export function instanceOfInventoryAlertResponse(value: object): value is InventoryAlertResponse {
    if (!('lowStockItems' in value) || value['lowStockItems'] === undefined) return false;
    return true;
}

export function InventoryAlertResponseFromJSON(json: any): InventoryAlertResponse {
    return InventoryAlertResponseFromJSONTyped(json, false);
}

export function InventoryAlertResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): InventoryAlertResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'lowStockItems': ((json['low_stock_items'] as Array<any>).map(LowStockItemResponseFromJSON)),
    };
}

export function InventoryAlertResponseToJSON(json: any): InventoryAlertResponse {
    return InventoryAlertResponseToJSONTyped(json, false);
}

export function InventoryAlertResponseToJSONTyped(value?: InventoryAlertResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'low_stock_items': ((value['lowStockItems'] as Array<any>).map(LowStockItemResponseToJSON)),
    };
}

