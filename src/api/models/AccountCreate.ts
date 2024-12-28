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
import type { AccountType } from './AccountType';
import {
    AccountTypeFromJSON,
    AccountTypeFromJSONTyped,
    AccountTypeToJSON,
    AccountTypeToJSONTyped,
} from './AccountType';

/**
 * 
 * @export
 * @interface AccountCreate
 */
export interface AccountCreate {
    /**
     * 
     * @type {string}
     * @memberof AccountCreate
     */
    name: string;
    /**
     * 
     * @type {AccountType}
     * @memberof AccountCreate
     */
    type: AccountType;
    /**
     * 
     * @type {string}
     * @memberof AccountCreate
     */
    description?: string | null;
}



/**
 * Check if a given object implements the AccountCreate interface.
 */
export function instanceOfAccountCreate(value: object): value is AccountCreate {
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('type' in value) || value['type'] === undefined) return false;
    return true;
}

export function AccountCreateFromJSON(json: any): AccountCreate {
    return AccountCreateFromJSONTyped(json, false);
}

export function AccountCreateFromJSONTyped(json: any, ignoreDiscriminator: boolean): AccountCreate {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'],
        'type': AccountTypeFromJSON(json['type']),
        'description': json['description'] == null ? undefined : json['description'],
    };
}

export function AccountCreateToJSON(json: any): AccountCreate {
    return AccountCreateToJSONTyped(json, false);
}

export function AccountCreateToJSONTyped(value?: AccountCreate | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'type': AccountTypeToJSON(value['type']),
        'description': value['description'],
    };
}
