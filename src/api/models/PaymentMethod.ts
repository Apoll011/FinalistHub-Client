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
export const PaymentMethod = {
    Cash: 'cash',
    CreditCard: 'credit_card',
    DebitCard: 'debit_card',
    BankTransfer: 'bank_transfer',
    Pix: 'pix',
    Other: 'other'
} as const;
export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];


export function instanceOfPaymentMethod(value: any): boolean {
    for (const key in PaymentMethod) {
        if (Object.prototype.hasOwnProperty.call(PaymentMethod, key)) {
            if (PaymentMethod[key as keyof typeof PaymentMethod] === value) {
                return true;
            }
        }
    }
    return false;
}

export function PaymentMethodFromJSON(json: any): PaymentMethod {
    return PaymentMethodFromJSONTyped(json, false);
}

export function PaymentMethodFromJSONTyped(json: any, ignoreDiscriminator: boolean): PaymentMethod {
    return json as PaymentMethod;
}

export function PaymentMethodToJSON(value?: PaymentMethod | null): any {
    return value as any;
}

export function PaymentMethodToJSONTyped(value: any, ignoreDiscriminator: boolean): PaymentMethod {
    return value as PaymentMethod;
}
