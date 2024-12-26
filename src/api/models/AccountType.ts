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


/**
 * 
 * @export
 */
export const AccountType = {
    Bank: 'bank',
    Cash: 'cash'
} as const;
export type AccountType = typeof AccountType[keyof typeof AccountType];


export function instanceOfAccountType(value: any): boolean {
    for (const key in AccountType) {
        if (Object.prototype.hasOwnProperty.call(AccountType, key)) {
            if (AccountType[key as keyof typeof AccountType] === value) {
                return true;
            }
        }
    }
    return false;
}

export function AccountTypeFromJSON(json: any): AccountType {
    return AccountTypeFromJSONTyped(json, false);
}

export function AccountTypeFromJSONTyped(json: any, ignoreDiscriminator: boolean): AccountType {
    return json as AccountType;
}

export function AccountTypeToJSON(value?: AccountType | null): any {
    return value as any;
}

export function AccountTypeToJSONTyped(value: any, ignoreDiscriminator: boolean): AccountType {
    return value as AccountType;
}

