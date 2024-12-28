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
import type { CategorySpending } from './CategorySpending';
import {
    CategorySpendingFromJSON,
    CategorySpendingFromJSONTyped,
    CategorySpendingToJSON,
    CategorySpendingToJSONTyped,
} from './CategorySpending';

/**
 * 
 * @export
 * @interface CategorySpendingAnalysis
 */
export interface CategorySpendingAnalysis {
    /**
     * 
     * @type {Array<CategorySpending>}
     * @memberof CategorySpendingAnalysis
     */
    categories: Array<CategorySpending>;
    /**
     * 
     * @type {number}
     * @memberof CategorySpendingAnalysis
     */
    totalSpending: number;
}

/**
 * Check if a given object implements the CategorySpendingAnalysis interface.
 */
export function instanceOfCategorySpendingAnalysis(value: object): value is CategorySpendingAnalysis {
    if (!('categories' in value) || value['categories'] === undefined) return false;
    if (!('totalSpending' in value) || value['totalSpending'] === undefined) return false;
    return true;
}

export function CategorySpendingAnalysisFromJSON(json: any): CategorySpendingAnalysis {
    return CategorySpendingAnalysisFromJSONTyped(json, false);
}

export function CategorySpendingAnalysisFromJSONTyped(json: any, ignoreDiscriminator: boolean): CategorySpendingAnalysis {
    if (json == null) {
        return json;
    }
    return {
        
        'categories': ((json['categories'] as Array<any>).map(CategorySpendingFromJSON)),
        'totalSpending': json['total_spending'],
    };
}

export function CategorySpendingAnalysisToJSON(json: any): CategorySpendingAnalysis {
    return CategorySpendingAnalysisToJSONTyped(json, false);
}

export function CategorySpendingAnalysisToJSONTyped(value?: CategorySpendingAnalysis | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'categories': ((value['categories'] as Array<any>).map(CategorySpendingToJSON)),
        'total_spending': value['totalSpending'],
    };
}
