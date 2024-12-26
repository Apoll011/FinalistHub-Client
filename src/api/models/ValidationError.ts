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
import type { ValidationErrorLocInner } from './ValidationErrorLocInner';
import {
    ValidationErrorLocInnerFromJSON,
    ValidationErrorLocInnerFromJSONTyped,
    ValidationErrorLocInnerToJSON,
    ValidationErrorLocInnerToJSONTyped,
} from './ValidationErrorLocInner';

/**
 * 
 * @export
 * @interface ValidationError
 */
export interface ValidationError {
    /**
     * 
     * @type {Array<ValidationErrorLocInner>}
     * @memberof ValidationError
     */
    loc: Array<ValidationErrorLocInner>;
    /**
     * 
     * @type {string}
     * @memberof ValidationError
     */
    msg: string;
    /**
     * 
     * @type {string}
     * @memberof ValidationError
     */
    type: string;
}

/**
 * Check if a given object implements the ValidationError interface.
 */
export function instanceOfValidationError(value: object): value is ValidationError {
    if (!('loc' in value) || value['loc'] === undefined) return false;
    if (!('msg' in value) || value['msg'] === undefined) return false;
    if (!('type' in value) || value['type'] === undefined) return false;
    return true;
}

export function ValidationErrorFromJSON(json: any): ValidationError {
    return ValidationErrorFromJSONTyped(json, false);
}

export function ValidationErrorFromJSONTyped(json: any, ignoreDiscriminator: boolean): ValidationError {
    if (json == null) {
        return json;
    }
    return {
        
        'loc': ((json['loc'] as Array<any>).map(ValidationErrorLocInnerFromJSON)),
        'msg': json['msg'],
        'type': json['type'],
    };
}

export function ValidationErrorToJSON(json: any): ValidationError {
    return ValidationErrorToJSONTyped(json, false);
}

export function ValidationErrorToJSONTyped(value?: ValidationError | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'loc': ((value['loc'] as Array<any>).map(ValidationErrorLocInnerToJSON)),
        'msg': value['msg'],
        'type': value['type'],
    };
}

