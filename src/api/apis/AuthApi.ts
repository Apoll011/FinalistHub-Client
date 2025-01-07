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
  HTTPValidationError,
  PasswordChangeRequest,
  User,
  UserLogin,
} from '../models/index';
import {
    HTTPValidationErrorFromJSON,
    HTTPValidationErrorToJSON,
    PasswordChangeRequestFromJSON,
    PasswordChangeRequestToJSON,
    UserFromJSON,
    UserToJSON,
    UserLoginFromJSON,
    UserLoginToJSON,
} from '../models/index';

export interface ChangePasswordAuthUserChangePasswordPatchRequest {
    passwordChangeRequest: PasswordChangeRequest;
}

export interface DeleteUserAuthUserUsernameDeleteRequest {
    username: string;
}

export interface GetNameAuthNameGetRequest {
    userId: string;
}

export interface LoginAuthLoginPostRequest {
    userLogin: UserLogin;
}

export interface RegisterAuthRegisterPostRequest {
    user: User;
}

export interface UpdateRoleAuthUserRolePatchRequest {
    username: string;
    newRole: string;
}

/**
 * 
 */
export class AuthApi extends runtime.BaseAPI {

    /**
     * Change Password
     */
    async changePasswordAuthUserChangePasswordPatchRaw(requestParameters: ChangePasswordAuthUserChangePasswordPatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<any>> {
        if (requestParameters['passwordChangeRequest'] == null) {
            throw new runtime.RequiredError(
                'passwordChangeRequest',
                'Required parameter "passwordChangeRequest" was null or undefined when calling changePasswordAuthUserChangePasswordPatch().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2PasswordBearer", []);
        }

        const response = await this.request({
            path: `/auth/user/change-password`,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: PasswordChangeRequestToJSON(requestParameters['passwordChangeRequest']),
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<any>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     * Change Password
     */
    async changePasswordAuthUserChangePasswordPatch(requestParameters: ChangePasswordAuthUserChangePasswordPatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<any> {
        const response = await this.changePasswordAuthUserChangePasswordPatchRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Delete User
     */
    async deleteUserAuthUserUsernameDeleteRaw(requestParameters: DeleteUserAuthUserUsernameDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<any>> {
        if (requestParameters['username'] == null) {
            throw new runtime.RequiredError(
                'username',
                'Required parameter "username" was null or undefined when calling deleteUserAuthUserUsernameDelete().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2PasswordBearer", []);
        }

        const response = await this.request({
            path: `/auth/user/{username}`.replace(`{username}`, encodeURIComponent(String(requestParameters['username']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<any>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     * Delete User
     */
    async deleteUserAuthUserUsernameDelete(requestParameters: DeleteUserAuthUserUsernameDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<any> {
        const response = await this.deleteUserAuthUserUsernameDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get Me
     */
    async getMeAuthMeGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<any>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2PasswordBearer", []);
        }

        const response = await this.request({
            path: `/auth/me`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<any>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     * Get Me
     */
    async getMeAuthMeGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<any> {
        const response = await this.getMeAuthMeGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get Name
     */
    async getNameAuthNameGetRaw(requestParameters: GetNameAuthNameGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<any>> {
        if (requestParameters['userId'] == null) {
            throw new runtime.RequiredError(
                'userId',
                'Required parameter "userId" was null or undefined when calling getNameAuthNameGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['userId'] != null) {
            queryParameters['user_id'] = requestParameters['userId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/auth/name`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<any>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     * Get Name
     */
    async getNameAuthNameGet(requestParameters: GetNameAuthNameGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<any> {
        const response = await this.getNameAuthNameGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get Users
     */
    async getUsersAuthUsersGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<any>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2PasswordBearer", []);
        }

        const response = await this.request({
            path: `/auth/users`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<any>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     * Get Users
     */
    async getUsersAuthUsersGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<any> {
        const response = await this.getUsersAuthUsersGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Login
     */
    async loginAuthLoginPostRaw(requestParameters: LoginAuthLoginPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<any>> {
        if (requestParameters['userLogin'] == null) {
            throw new runtime.RequiredError(
                'userLogin',
                'Required parameter "userLogin" was null or undefined when calling loginAuthLoginPost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/auth/login`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UserLoginToJSON(requestParameters['userLogin']),
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<any>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     * Login
     */
    async loginAuthLoginPost(requestParameters: LoginAuthLoginPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<any> {
        const response = await this.loginAuthLoginPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Register
     */
    async registerAuthRegisterPostRaw(requestParameters: RegisterAuthRegisterPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<any>> {
        if (requestParameters['user'] == null) {
            throw new runtime.RequiredError(
                'user',
                'Required parameter "user" was null or undefined when calling registerAuthRegisterPost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/auth/register`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UserToJSON(requestParameters['user']),
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<any>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     * Register
     */
    async registerAuthRegisterPost(requestParameters: RegisterAuthRegisterPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<any> {
        const response = await this.registerAuthRegisterPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Update Role
     */
    async updateRoleAuthUserRolePatchRaw(requestParameters: UpdateRoleAuthUserRolePatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['username'] == null) {
            throw new runtime.RequiredError(
                'username',
                'Required parameter "username" was null or undefined when calling updateRoleAuthUserRolePatch().'
            );
        }

        if (requestParameters['newRole'] == null) {
            throw new runtime.RequiredError(
                'newRole',
                'Required parameter "newRole" was null or undefined when calling updateRoleAuthUserRolePatch().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['username'] != null) {
            queryParameters['username'] = requestParameters['username'];
        }

        if (requestParameters['newRole'] != null) {
            queryParameters['new_role'] = requestParameters['newRole'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2PasswordBearer", []);
        }

        const response = await this.request({
            path: `/auth/user/role`,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Update Role
     */
    async updateRoleAuthUserRolePatch(requestParameters: UpdateRoleAuthUserRolePatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.updateRoleAuthUserRolePatchRaw(requestParameters, initOverrides);
    }

}
