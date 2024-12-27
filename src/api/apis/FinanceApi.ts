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
  AccountBalanceResponse,
  AccountCreate,
  AccountResponse,
  AccountStatement,
  Balance,
  CashflowForecast,
  CategorySpendingAnalysis,
  HTTPValidationError,
  MonthlyFinancialReport,
  ProfitReportResponse,
  TopRevenueSourcesResponse,
  TransactionCreate,
  TransactionResponse,
  TransferHistoryResponse,
  WeeklyFinancialReport,
} from '../models/index';
import {
    AccountBalanceResponseFromJSON,
    AccountBalanceResponseToJSON,
    AccountCreateFromJSON,
    AccountCreateToJSON,
    AccountResponseFromJSON,
    AccountResponseToJSON,
    AccountStatementFromJSON,
    AccountStatementToJSON,
    BalanceFromJSON,
    BalanceToJSON,
    CashflowForecastFromJSON,
    CashflowForecastToJSON,
    CategorySpendingAnalysisFromJSON,
    CategorySpendingAnalysisToJSON,
    HTTPValidationErrorFromJSON,
    HTTPValidationErrorToJSON,
    MonthlyFinancialReportFromJSON,
    MonthlyFinancialReportToJSON,
    ProfitReportResponseFromJSON,
    ProfitReportResponseToJSON,
    TopRevenueSourcesResponseFromJSON,
    TopRevenueSourcesResponseToJSON,
    TransactionCreateFromJSON,
    TransactionCreateToJSON,
    TransactionResponseFromJSON,
    TransactionResponseToJSON,
    TransferHistoryResponseFromJSON,
    TransferHistoryResponseToJSON,
    WeeklyFinancialReportFromJSON,
    WeeklyFinancialReportToJSON,
} from '../models/index';

export interface AnalyzeCategorySpendingFinanceCategoriesSpendingAnalysisGetRequest {
    startDate?: Date | null;
    endDate?: Date | null;
}

export interface CreateAccountFinanceAccountsPostRequest {
    accountCreate: AccountCreate;
}

export interface CreateTransactionFinanceTransactionsPostRequest {
    transactionCreate: TransactionCreate;
}

export interface ForecastCashflowFinanceCashflowForecastGetRequest {
    days?: number;
}

export interface GetAccountBalanceFinanceAccountsAccountIdBalanceGetRequest {
    accountId: string;
}

export interface GetAccountStatementFinanceAccountsAccountIdStatementGetRequest {
    accountId: string;
    startDate: Date;
    endDate: Date;
}

export interface GetProfitReportFinanceProfitGetRequest {
    year?: number;
    month?: number | null;
}

export interface GetTopRevenueSourcesFinanceTopRevenueSourcesGetRequest {
    limit?: number;
    startDate?: string | null;
    endDate?: string | null;
}

export interface GetTransactionFinanceTransactionsGetRequest {
    transactionId: string;
}

export interface GetTransferHistoryFinanceAccountsTransferHistoryGetRequest {
    startDate?: Date | null;
    endDate?: Date | null;
}

/**
 * 
 */
export class FinanceApi extends runtime.BaseAPI {

    /**
     * Analyze spending patterns by category
     * Analyze Category Spending
     */
    async analyzeCategorySpendingFinanceCategoriesSpendingAnalysisGetRaw(requestParameters: AnalyzeCategorySpendingFinanceCategoriesSpendingAnalysisGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CategorySpendingAnalysis>> {
        const queryParameters: any = {};

        if (requestParameters['startDate'] != null) {
            queryParameters['start_date'] = (requestParameters['startDate'] as any).toISOString();
        }

        if (requestParameters['endDate'] != null) {
            queryParameters['end_date'] = (requestParameters['endDate'] as any).toISOString();
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/finance/categories/spending-analysis`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CategorySpendingAnalysisFromJSON(jsonValue));
    }

    /**
     * Analyze spending patterns by category
     * Analyze Category Spending
     */
    async analyzeCategorySpendingFinanceCategoriesSpendingAnalysisGet(requestParameters: AnalyzeCategorySpendingFinanceCategoriesSpendingAnalysisGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CategorySpendingAnalysis> {
        const response = await this.analyzeCategorySpendingFinanceCategoriesSpendingAnalysisGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Create a new account (bank or cash)
     * Create Account
     */
    async createAccountFinanceAccountsPostRaw(requestParameters: CreateAccountFinanceAccountsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AccountResponse>> {
        if (requestParameters['accountCreate'] == null) {
            throw new runtime.RequiredError(
                'accountCreate',
                'Required parameter "accountCreate" was null or undefined when calling createAccountFinanceAccountsPost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/finance/accounts`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AccountCreateToJSON(requestParameters['accountCreate']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AccountResponseFromJSON(jsonValue));
    }

    /**
     * Create a new account (bank or cash)
     * Create Account
     */
    async createAccountFinanceAccountsPost(requestParameters: CreateAccountFinanceAccountsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AccountResponse> {
        const response = await this.createAccountFinanceAccountsPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Create a new transaction with optional receipt upload
     * Create Transaction
     */
    async createTransactionFinanceTransactionsPostRaw(requestParameters: CreateTransactionFinanceTransactionsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TransactionResponse>> {
        if (requestParameters['transactionCreate'] == null) {
            throw new runtime.RequiredError(
                'transactionCreate',
                'Required parameter "transactionCreate" was null or undefined when calling createTransactionFinanceTransactionsPost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/finance/transactions`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TransactionCreateToJSON(requestParameters['transactionCreate']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TransactionResponseFromJSON(jsonValue));
    }

    /**
     * Create a new transaction with optional receipt upload
     * Create Transaction
     */
    async createTransactionFinanceTransactionsPost(requestParameters: CreateTransactionFinanceTransactionsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TransactionResponse> {
        const response = await this.createTransactionFinanceTransactionsPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Generate cashflow forecast based on historical patterns using simple ML techniques
     * Forecast Cashflow
     */
    async forecastCashflowFinanceCashflowForecastGetRaw(requestParameters: ForecastCashflowFinanceCashflowForecastGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CashflowForecast>> {
        const queryParameters: any = {};

        if (requestParameters['days'] != null) {
            queryParameters['days'] = requestParameters['days'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/finance/cashflow/forecast`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CashflowForecastFromJSON(jsonValue));
    }

    /**
     * Generate cashflow forecast based on historical patterns using simple ML techniques
     * Forecast Cashflow
     */
    async forecastCashflowFinanceCashflowForecastGet(requestParameters: ForecastCashflowFinanceCashflowForecastGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CashflowForecast> {
        const response = await this.forecastCashflowFinanceCashflowForecastGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get current balance and transaction history for an account
     * Get Account Balance
     */
    async getAccountBalanceFinanceAccountsAccountIdBalanceGetRaw(requestParameters: GetAccountBalanceFinanceAccountsAccountIdBalanceGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AccountBalanceResponse>> {
        if (requestParameters['accountId'] == null) {
            throw new runtime.RequiredError(
                'accountId',
                'Required parameter "accountId" was null or undefined when calling getAccountBalanceFinanceAccountsAccountIdBalanceGet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/finance/accounts/{account_id}/balance`.replace(`{${"account_id"}}`, encodeURIComponent(String(requestParameters['accountId']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AccountBalanceResponseFromJSON(jsonValue));
    }

    /**
     * Get current balance and transaction history for an account
     * Get Account Balance
     */
    async getAccountBalanceFinanceAccountsAccountIdBalanceGet(requestParameters: GetAccountBalanceFinanceAccountsAccountIdBalanceGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AccountBalanceResponse> {
        const response = await this.getAccountBalanceFinanceAccountsAccountIdBalanceGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Generate account statement for a specific period
     * Get Account Statement
     */
    async getAccountStatementFinanceAccountsAccountIdStatementGetRaw(requestParameters: GetAccountStatementFinanceAccountsAccountIdStatementGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AccountStatement>> {
        if (requestParameters['accountId'] == null) {
            throw new runtime.RequiredError(
                'accountId',
                'Required parameter "accountId" was null or undefined when calling getAccountStatementFinanceAccountsAccountIdStatementGet().'
            );
        }

        if (requestParameters['startDate'] == null) {
            throw new runtime.RequiredError(
                'startDate',
                'Required parameter "startDate" was null or undefined when calling getAccountStatementFinanceAccountsAccountIdStatementGet().'
            );
        }

        if (requestParameters['endDate'] == null) {
            throw new runtime.RequiredError(
                'endDate',
                'Required parameter "endDate" was null or undefined when calling getAccountStatementFinanceAccountsAccountIdStatementGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['startDate'] != null) {
            queryParameters['start_date'] = (requestParameters['startDate'] as any).toISOString();
        }

        if (requestParameters['endDate'] != null) {
            queryParameters['end_date'] = (requestParameters['endDate'] as any).toISOString();
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/finance/accounts/{account_id}/statement`.replace(`{${"account_id"}}`, encodeURIComponent(String(requestParameters['accountId']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AccountStatementFromJSON(jsonValue));
    }

    /**
     * Generate account statement for a specific period
     * Get Account Statement
     */
    async getAccountStatementFinanceAccountsAccountIdStatementGet(requestParameters: GetAccountStatementFinanceAccountsAccountIdStatementGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AccountStatement> {
        const response = await this.getAccountStatementFinanceAccountsAccountIdStatementGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get Accounts
     */
    async getAccountsFinanceAccountsGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<AccountResponse>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/finance/accounts`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(AccountResponseFromJSON));
    }

    /**
     * Get Accounts
     */
    async getAccountsFinanceAccountsGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<AccountResponse>> {
        const response = await this.getAccountsFinanceAccountsGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get financial report for the current month
     * Get Monthly Transactions
     */
    async getMonthlyTransactionsFinanceTransactionsMonthlyGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<MonthlyFinancialReport>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/finance/transactions/monthly`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => MonthlyFinancialReportFromJSON(jsonValue));
    }

    /**
     * Get financial report for the current month
     * Get Monthly Transactions
     */
    async getMonthlyTransactionsFinanceTransactionsMonthlyGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<MonthlyFinancialReport> {
        const response = await this.getMonthlyTransactionsFinanceTransactionsMonthlyGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Generate profit and loss report
     * Get Profit Report
     */
    async getProfitReportFinanceProfitGetRaw(requestParameters: GetProfitReportFinanceProfitGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ProfitReportResponse>> {
        const queryParameters: any = {};

        if (requestParameters['year'] != null) {
            queryParameters['year'] = requestParameters['year'];
        }

        if (requestParameters['month'] != null) {
            queryParameters['month'] = requestParameters['month'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/finance/profit`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ProfitReportResponseFromJSON(jsonValue));
    }

    /**
     * Generate profit and loss report
     * Get Profit Report
     */
    async getProfitReportFinanceProfitGet(requestParameters: GetProfitReportFinanceProfitGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ProfitReportResponse> {
        const response = await this.getProfitReportFinanceProfitGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get top revenue sources grouped by category
     * Get Top Revenue Sources
     */
    async getTopRevenueSourcesFinanceTopRevenueSourcesGetRaw(requestParameters: GetTopRevenueSourcesFinanceTopRevenueSourcesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TopRevenueSourcesResponse>> {
        const queryParameters: any = {};

        if (requestParameters['limit'] != null) {
            queryParameters['limit'] = requestParameters['limit'];
        }

        if (requestParameters['startDate'] != null) {
            queryParameters['start_date'] = requestParameters['startDate'];
        }

        if (requestParameters['endDate'] != null) {
            queryParameters['end_date'] = requestParameters['endDate'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/finance/top-revenue-sources`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TopRevenueSourcesResponseFromJSON(jsonValue));
    }

    /**
     * Get top revenue sources grouped by category
     * Get Top Revenue Sources
     */
    async getTopRevenueSourcesFinanceTopRevenueSourcesGet(requestParameters: GetTopRevenueSourcesFinanceTopRevenueSourcesGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TopRevenueSourcesResponse> {
        const response = await this.getTopRevenueSourcesFinanceTopRevenueSourcesGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get total balance across all accounts
     * Get Total Balance
     */
    async getTotalBalanceFinanceBalanceGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Balance>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/finance/balance`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BalanceFromJSON(jsonValue));
    }

    /**
     * Get total balance across all accounts
     * Get Total Balance
     */
    async getTotalBalanceFinanceBalanceGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Balance> {
        const response = await this.getTotalBalanceFinanceBalanceGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get Transaction
     */
    async getTransactionFinanceTransactionsGetRaw(requestParameters: GetTransactionFinanceTransactionsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TransactionResponse>> {
        if (requestParameters['transactionId'] == null) {
            throw new runtime.RequiredError(
                'transactionId',
                'Required parameter "transactionId" was null or undefined when calling getTransactionFinanceTransactionsGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['transactionId'] != null) {
            queryParameters['transactionId'] = requestParameters['transactionId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/finance/transactions`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TransactionResponseFromJSON(jsonValue));
    }

    /**
     * Get Transaction
     */
    async getTransactionFinanceTransactionsGet(requestParameters: GetTransactionFinanceTransactionsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TransactionResponse> {
        const response = await this.getTransactionFinanceTransactionsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get history of transfers between accounts
     * Get Transfer History
     */
    async getTransferHistoryFinanceAccountsTransferHistoryGetRaw(requestParameters: GetTransferHistoryFinanceAccountsTransferHistoryGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TransferHistoryResponse>> {
        const queryParameters: any = {};

        if (requestParameters['startDate'] != null) {
            queryParameters['start_date'] = (requestParameters['startDate'] as any).toISOString();
        }

        if (requestParameters['endDate'] != null) {
            queryParameters['end_date'] = (requestParameters['endDate'] as any).toISOString();
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/finance/accounts/transfer-history`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TransferHistoryResponseFromJSON(jsonValue));
    }

    /**
     * Get history of transfers between accounts
     * Get Transfer History
     */
    async getTransferHistoryFinanceAccountsTransferHistoryGet(requestParameters: GetTransferHistoryFinanceAccountsTransferHistoryGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TransferHistoryResponse> {
        const response = await this.getTransferHistoryFinanceAccountsTransferHistoryGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get financial report for the current week
     * Get Weekly Transactions
     */
    async getWeeklyTransactionsFinanceTransactionsWeeklyGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<WeeklyFinancialReport>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/finance/transactions/weekly`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => WeeklyFinancialReportFromJSON(jsonValue));
    }

    /**
     * Get financial report for the current week
     * Get Weekly Transactions
     */
    async getWeeklyTransactionsFinanceTransactionsWeeklyGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<WeeklyFinancialReport> {
        const response = await this.getWeeklyTransactionsFinanceTransactionsWeeklyGetRaw(initOverrides);
        return await response.value();
    }

}
