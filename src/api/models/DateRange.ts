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
 * @interface DateRange
 */
export interface DateRange {
    /**
     * 
     * @type {string}
     * @memberof DateRange
     */
    start: string;
    /**
     * 
     * @type {string}
     * @memberof DateRange
     */
    end: string;
}

/**
 * Check if a given object implements the DateRange interface.
 */
export function instanceOfDateRange(value: object): value is DateRange {
    if (!('start' in value) || value['start'] === undefined) return false;
    if (!('end' in value) || value['end'] === undefined) return false;
    return true;
}

export function DateRangeFromJSON(json: any): DateRange {
    return DateRangeFromJSONTyped(json, false);
}

export function DateRangeFromJSONTyped(json: any, ignoreDiscriminator: boolean): DateRange {
    if (json == null) {
        return json;
    }
    return {
        
        'start': json['start'],
        'end': json['end'],
    };
}

export function DateRangeToJSON(json: any): DateRange {
    return DateRangeToJSONTyped(json, false);
}

export function DateRangeToJSONTyped(value?: DateRange | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'start': value['start'],
        'end': value['end'],
    };
}

