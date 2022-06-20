export {};

export interface TokenResponse {
    credential: string;
    clientId: string;
    select_by: string;
}

interface InitializeParams {
    client_id: string;
    callback: (rsp: TokenResponse) => void;
}

interface CodeClientConfig {
    client_id: string;
    scope: string;
    redirect_uri: string;
    callback: (rsp: CodeResponse) => void;
    state?: string;
    enable_serial_consent?: string;
    hint?: string;
    hosted_domain?: string;
    ux_mode?: string;
    select_account?: string;
}

interface CodeClient {
    requestCode: () => void;
}

export interface CodeResponse {
    code: string;
    scope: string;
    state: string;
    error: string;
    error_description: string;
    error_uri: string;
}

type Prompt = "" | "none" | "consent" | "select_account";

interface AccessTokenClientConfig {
    client_id: string;
    callback: (rsp: AccessTokenResponse) => void;
    scope: string;
    prompt?: Prompt;
    enable_serial_consent?: string;
    hint?: string;
    state?: string;
}

interface OverrideTokenClientConfig {
    prompt?: Prompt;
    enable_serial_consent?: string;
    hint?: string;
    state?: string;
}

interface TokenClient {
    requestAccessToken: (overrideConfig?: OverrideTokenClientConfig) => void;
}

export interface AccessTokenResponse {
    access_token: string;
    expires_in: number;
    hd: string;
    prompt: string;
    token_type: string;
    scopes: string;
    state: string;
    error: string;
    error_description: string;
    error_uri;
}

declare global {
    /**
     * Now declare things that go in the global namespace,
     * or augment existing declarations in the global namespace.
     */
    interface Window {
        google: {
            accounts: {
                id: {
                    initialize: (params: InitializeParams) => void;
                    renderButton: (elem: HTMLElement, options: { theme: string; size: string }) => void;
                };
                oauth2: {
                    initCodeClient: (config: CodeClientConfig) => CodeClient;
                    initTokenClient: (config: AccessTokenClientConfig) => TokenClient;
                };
            };
        };
    }
}
