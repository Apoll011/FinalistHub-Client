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


import * as runtime from '../runtime';
import type {
  CloseItemRequest,
  HTTPValidationError,
  ItemStatus,
  StandaloneItem,
  StandaloneItemCreate,
  StandaloneItemReport,
  StandaloneItemSale,
  StandaloneItemSaleCreate,
  StandaloneItemUpdate,
} from '../models/index';
import {
    CloseItemRequestFromJSON,
    CloseItemRequestToJSON,
    HTTPValidationErrorFromJSON,
    HTTPValidationErrorToJSON,
    ItemStatusFromJSON,
    ItemStatusToJSON,
    StandaloneItemFromJSON,
    StandaloneItemToJSON,
    StandaloneItemCreateFromJSON,
    StandaloneItemCreateToJSON,
    StandaloneItemReportFromJSON,
    StandaloneItemReportToJSON,
    StandaloneItemSaleFromJSON,
    StandaloneItemSaleToJSON,
    StandaloneItemSaleCreateFromJSON,
    StandaloneItemSaleCreateToJSON,
    StandaloneItemUpdateFromJSON,
    StandaloneItemUpdateToJSON,
} from '../models/index';

export interface CloseItemStandaloneItemsItemIdClosePostRequest {
    itemId: string;
    closeItemRequest: CloseItemRequest;
}

export interface CreateStandaloneItemStandaloneItemsPostRequest {
    standaloneItemCreate: StandaloneItemCreate;
}

export interface GetItemReportStandaloneItemsItemIdReportGetRequest {
    itemId: string;
}

export interface GetItemStandaloneItemsItemIdGetRequest {
    itemId: string;
}

export interface GetItemsStandaloneItemsGetRequest {
    status?: ItemStatus | null;
}

export interface SellItemStandaloneItemsItemIdSellPostRequest {
    itemId: string;
    standaloneItemSaleCreate: StandaloneItemSaleCreate;
}

export interface UpdateItemStandaloneItemsItemIdPutRequest {
    itemId: string;
    standaloneItemUpdate: StandaloneItemUpdate;
}

/**
 * 
 */
export class StandaloneItemsApi extends runtime.BaseAPI {

    /**
     * Close an item and create a transaction for all its sales
     * Close Item
     */
    async closeItemStandaloneItemsItemIdClosePostRaw(requestParameters: CloseItemStandaloneItemsItemIdClosePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['itemId'] == null) {
            throw new runtime.RequiredError(
                'itemId',
                'Required parameter "itemId" was null or undefined when calling closeItemStandaloneItemsItemIdClosePost().'
            );
        }

        if (requestParameters['closeItemRequest'] == null) {
            throw new runtime.RequiredError(
                'closeItemRequest',
                'Required parameter "closeItemRequest" was null or undefined when calling closeItemStandaloneItemsItemIdClosePost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/standalone/items/{item_id}/close`.replace(`{${"item_id"}}`, encodeURIComponent(String(requestParameters['itemId']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CloseItemRequestToJSON(requestParameters['closeItemRequest']),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Close an item and create a transaction for all its sales
     * Close Item
     */
    async closeItemStandaloneItemsItemIdClosePost(requestParameters: CloseItemStandaloneItemsItemIdClosePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.closeItemStandaloneItemsItemIdClosePostRaw(requestParameters, initOverrides);
    }

    /**
     * Create a new standalone item
     * Create Standalone Item
     */
    async createStandaloneItemStandaloneItemsPostRaw(requestParameters: CreateStandaloneItemStandaloneItemsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StandaloneItem>> {
        if (requestParameters['standaloneItemCreate'] == null) {
            throw new runtime.RequiredError(
                'standaloneItemCreate',
                'Required parameter "standaloneItemCreate" was null or undefined when calling createStandaloneItemStandaloneItemsPost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/standalone/items`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StandaloneItemCreateToJSON(requestParameters['standaloneItemCreate']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StandaloneItemFromJSON(jsonValue));
    }

    /**
     * Create a new standalone item
     * Create Standalone Item
     */
    async createStandaloneItemStandaloneItemsPost(requestParameters: CreateStandaloneItemStandaloneItemsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StandaloneItem> {
        const response = await this.createStandaloneItemStandaloneItemsPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get a sales report for a specific item
     * Get Item Report
     */
    async getItemReportStandaloneItemsItemIdReportGetRaw(requestParameters: GetItemReportStandaloneItemsItemIdReportGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StandaloneItemReport>> {
        if (requestParameters['itemId'] == null) {
            throw new runtime.RequiredError(
                'itemId',
                'Required parameter "itemId" was null or undefined when calling getItemReportStandaloneItemsItemIdReportGet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/standalone/items/{item_id}/report`.replace(`{${"item_id"}}`, encodeURIComponent(String(requestParameters['itemId']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StandaloneItemReportFromJSON(jsonValue));
    }

    /**
     * Get a sales report for a specific item
     * Get Item Report
     */
    async getItemReportStandaloneItemsItemIdReportGet(requestParameters: GetItemReportStandaloneItemsItemIdReportGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StandaloneItemReport> {
        const response = await this.getItemReportStandaloneItemsItemIdReportGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get a specific standalone item by ID
     * Get Item
     */
    async getItemStandaloneItemsItemIdGetRaw(requestParameters: GetItemStandaloneItemsItemIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StandaloneItem>> {
        if (requestParameters['itemId'] == null) {
            throw new runtime.RequiredError(
                'itemId',
                'Required parameter "itemId" was null or undefined when calling getItemStandaloneItemsItemIdGet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/standalone/items/{item_id}`.replace(`{${"item_id"}}`, encodeURIComponent(String(requestParameters['itemId']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StandaloneItemFromJSON(jsonValue));
    }

    /**
     * Get a specific standalone item by ID
     * Get Item
     */
    async getItemStandaloneItemsItemIdGet(requestParameters: GetItemStandaloneItemsItemIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StandaloneItem> {
        const response = await this.getItemStandaloneItemsItemIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get all standalone items with optional status filter
     * Get Items
     */
    async getItemsStandaloneItemsGetRaw(requestParameters: GetItemsStandaloneItemsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<StandaloneItem>>> {
        const queryParameters: any = {};

        if (requestParameters['status'] != null) {
            queryParameters['status'] = requestParameters['status'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/standalone/items`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(StandaloneItemFromJSON));
    }

    /**
     * Get all standalone items with optional status filter
     * Get Items
     */
    async getItemsStandaloneItemsGet(requestParameters: GetItemsStandaloneItemsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<StandaloneItem>> {
        const response = await this.getItemsStandaloneItemsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Record a sale for a standalone item
     * Sell Item
     */
    async sellItemStandaloneItemsItemIdSellPostRaw(requestParameters: SellItemStandaloneItemsItemIdSellPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StandaloneItemSale>> {
        if (requestParameters['itemId'] == null) {
            throw new runtime.RequiredError(
                'itemId',
                'Required parameter "itemId" was null or undefined when calling sellItemStandaloneItemsItemIdSellPost().'
            );
        }

        if (requestParameters['standaloneItemSaleCreate'] == null) {
            throw new runtime.RequiredError(
                'standaloneItemSaleCreate',
                'Required parameter "standaloneItemSaleCreate" was null or undefined when calling sellItemStandaloneItemsItemIdSellPost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/standalone/items/{item_id}/sell`.replace(`{${"item_id"}}`, encodeURIComponent(String(requestParameters['itemId']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StandaloneItemSaleCreateToJSON(requestParameters['standaloneItemSaleCreate']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StandaloneItemSaleFromJSON(jsonValue));
    }

    /**
     * Record a sale for a standalone item
     * Sell Item
     */
    async sellItemStandaloneItemsItemIdSellPost(requestParameters: SellItemStandaloneItemsItemIdSellPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StandaloneItemSale> {
        const response = await this.sellItemStandaloneItemsItemIdSellPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Update a standalone item\'s details
     * Update Item
     */
    async updateItemStandaloneItemsItemIdPutRaw(requestParameters: UpdateItemStandaloneItemsItemIdPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StandaloneItem>> {
        if (requestParameters['itemId'] == null) {
            throw new runtime.RequiredError(
                'itemId',
                'Required parameter "itemId" was null or undefined when calling updateItemStandaloneItemsItemIdPut().'
            );
        }

        if (requestParameters['standaloneItemUpdate'] == null) {
            throw new runtime.RequiredError(
                'standaloneItemUpdate',
                'Required parameter "standaloneItemUpdate" was null or undefined when calling updateItemStandaloneItemsItemIdPut().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/standalone/items/{item_id}`.replace(`{${"item_id"}}`, encodeURIComponent(String(requestParameters['itemId']))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: StandaloneItemUpdateToJSON(requestParameters['standaloneItemUpdate']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StandaloneItemFromJSON(jsonValue));
    }

    /**
     * Update a standalone item\'s details
     * Update Item
     */
    async updateItemStandaloneItemsItemIdPut(requestParameters: UpdateItemStandaloneItemsItemIdPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StandaloneItem> {
        const response = await this.updateItemStandaloneItemsItemIdPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
