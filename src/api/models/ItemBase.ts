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
 * @interface ItemBase
 */
export interface ItemBase {
    /**
     * 
     * @type {string}
     * @memberof ItemBase
     */
    name: string;
    /**
     * 
     * @type {number}
     * @memberof ItemBase
     */
    quantity: number;
    /**
     * 
     * @type {number}
     * @memberof ItemBase
     */
    price: number;
}

/**
 * Check if a given object implements the ItemBase interface.
 */
export function instanceOfItemBase(value: object): value is ItemBase {
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('quantity' in value) || value['quantity'] === undefined) return false;
    if (!('price' in value) || value['price'] === undefined) return false;
    return true;
}

export function ItemBaseFromJSON(json: any): ItemBase {
    return ItemBaseFromJSONTyped(json, false);
}

export function ItemBaseFromJSONTyped(json: any, ignoreDiscriminator: boolean): ItemBase {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'],
        'quantity': json['quantity'],
        'price': json['price'],
    };
}

export function ItemBaseToJSON(json: any): ItemBase {
    return ItemBaseToJSONTyped(json, false);
}

export function ItemBaseToJSONTyped(value?: ItemBase | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'quantity': value['quantity'],
        'price': value['price'],
    };
}

