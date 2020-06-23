import SimpleCrypto from "simple-crypto-js";

export type LoginToken = {
    id: number,
    token: string,
    createdAt: string,
    device: string
};

export type Provider = {
    id: number,
    name: string,
    image: string
};

export type Token = {
    id: number,
    provider: Provider,
    token: string,
    username?: string,
    hybernated: boolean
};

export let API_URL = "http://localhost/v1";

export class InvalidEncryptionTokenError extends Error {
    name = "InvalidEncryptionTokenError";
    constructor(message: string){
        super();
        this.message = message;
    }
}

async function fetchWrapper(url: RequestInfo, params?: RequestInit){
    try {
        return await fetch(url, params);
    } catch {
        throw new Error("Lockify's systems are now not available.");
    }
}

export class User {
    public id: number;
    public username: string;
    public email: string;
    public name: string;
    public image: string;
    public loginToken: string;
    public encryptionToken: string;
    public extraEncryption: boolean;
    public emailVerification: boolean;

    private providers: Array<Provider> = [];
    private loginTokens: Array<LoginToken> = [];
    private tokens: Array<Token> = [];
    private hybernated: Array<Token> = [];

    private loaded = {
        tokens: false,
        providers: false,
        loginTokens: false,
        hybernated: false
    }

    constructor(loginToken: string, encryptionToken?: string) {
        const jwt_decode = require('jwt-decode');

        let data = jwt_decode(loginToken);

        this.id = data['user']['id'];
        this.name = data['user']['name'];
        this.email = data['user']['email'];
        this.username = data['user']['username'];
        this.image = data['user']['image'];
        this.extraEncryption = data['user']['extraEncryption'];
        this.emailVerification = data['user']['emailVerification'];
        this.loginToken = loginToken;
        
        if(encryptionToken){    
            this.encryptionToken = encryptionToken;
        }
    }

    /**
     * This method will add an extra layer of encryption to user's 2FA tokens
     * @param passphrase user's secret encryption token
     * @throws error when invalid loginToken is provided or already encrypted
     */
    public async encryptTokens(passphrase: string){
        let data = await fetchWrapper(`${API_URL}/user/encryptTokens`, {
            method: "POST",
            body: JSON.stringify({
                loginToken: this.loginToken,
                passphrase
            })
        });

        let resp = await data.json();

        if(resp['error']){
            throw new Error(resp['errorMessage']);
        } else {
            this.extraEncryption = true;
            this.loginToken = resp.data.loginToken;
            return {
                message: resp['message'],
                loginToken: resp['data']['loginToken']
            };
        }
    }

    /**
     * This method will decrypt the extra layer of encryption of user's 2FA tokens
     * @param passphrase users's encryption token
     * @throws error when invalidLogin token or encryption token is provided
     */
    public async decryptTokens(passphrase: string){
        let data = await fetchWrapper(`${API_URL}/user/decryptTokens`, {
            method: "POST",
            body: JSON.stringify({
                loginToken: this.loginToken,
                passphrase
            })
        });

        let resp = await data.json();

        if(resp['error']){
            throw new Error(resp['errorMessage']);
        } else {
            this.extraEncryption = false;
            this.loginToken = resp.data.loginToken;
            return {
                message: resp['message'],
                loginToken: resp['data']['loginToken']
            };
        }
    }

    /**
     * Register a new user into Lockify's system
     * @param username User provided username
     * @param email User provided email
     * @param password User provided (not encrypted) password
     * @param name User provided nickname
     * @param reCaptchaToken ReCaptcha verification token
     * @param device Device's name, that user is trying to register from
     * @throws Error when username/email is taken or already used with SSO authentication 
     */
    public static async register(username: string, email: string, password: string, name: string, reCaptchaToken: string, device: string) {
        let data = await fetchWrapper(`${API_URL}/user/register`, {
            method: "POST",
            body: JSON.stringify({
                userData: {    
                    name,
                    username,
                    email,
                    password
                },
                reCaptchaToken,
                device
            })
        });

        let result = await data.json();

        if (!result['error']) {
            return result.message;
        } else {
            throw new Error(result['errorMessage']);
        }
    }

    /**
     * Login a user into the Lockify system
     * @param usernameOrEmail User provided identifier. Can be email or username.
     * @param password User provided password (not encrypted)
     * @param reCaptchaToken ReCaptcha verification token
     * @param device Device's name, that user is trying to login from
     * @throws Error when user is not found or invalid password or reCaptchaToken is invalid or when password authentication is disabled
     */
    public static async login(usernameOrEmail: string, password: string, reCaptchaToken: string, device?: string){
        if(!device){
            device = "Application";
        }

        let data = await fetchWrapper(`${API_URL}/user/login`, {
            method: "POST",
            body: JSON.stringify(validateEmail(usernameOrEmail) ? {
                device,
                email: usernameOrEmail,
                reCaptchaToken,
                password
            } : {
                device,
                username: usernameOrEmail,
                reCaptchaToken,
                password
            })
        });

        let result:{
            error: boolean,
            errorMessage?: string,
            data?: {
                user: User,
                loginToken: LoginToken
            },
            resp: "successful" | "email",
            message: string
        } = await data.json();

        if (!result['error']) {
            if(result.resp === "successful"){
                return {
                    resp: result.resp,
                    message: result.message,
                    user: new User(result.data.loginToken.token)
                };
            } else if(result.resp === "email") {
                return {
                    resp: result.resp,
                    message: result.message
                };
            }
        } else {
            throw new Error(result['errorMessage']);
        }
    }

    /**
     * Query not hybernated 2FA tokens from the database
     * @throws Error when encryption token is required, but not provided or invalid encryption token or invalid login token
     */
    private async refreshTokens(){
        let result = await fetchWrapper(`${API_URL}/tokens/get`, {
            method: "POST",
            body: JSON.stringify({
                loginToken: this.loginToken,
                encryptionToken: this.encryptionToken
            })
        });

        if(this.extraEncryption && !this.encryptionToken){
            throw new Error("Encryption token is required");
        }

        let data = await result.json();
        if(data['error']){
            throw new Error(data['errorMessage']);
        } else {
            let tokens = data['data']['tokens'];

            this.loaded.tokens = true;
            this.tokens = tokens;
        }
    }

    /**
     * Query hybernated 2FA tokens from the database
     * @throws Error when invalid login token is provided
     */
    private async refreshHybernatedTokens(){
        let result = await fetchWrapper(`${API_URL}/tokens/hybernated/get`, {
            method: "POST",
            body: JSON.stringify({
                loginToken: this.loginToken
            })
        });

        let data = await result.json();
        if(data['error']){
            throw new Error(data['errorMessage']);
        } else {
            let tokens = data['data']['tokens'];

            this.loaded.hybernated = true;
            this.hybernated = tokens;
        }
    }

    /**
     * Query providers from the database
     * @throws Error when login token is invalid
     */
    private async refreshProviders(){
        let result = await fetchWrapper(`${API_URL}/providers/get`, {
            method: "POST",
            body: JSON.stringify({
                loginToken: this.loginToken
            })
        });

        let data = await result.json();
        if(data['error']){
            throw new Error(data['errorMessage']);
        } else {
            this.loaded.providers = true;
            this.tokens = data['data']['providers'];
        }
    }

    /**
     * Query logged in devices from the system
     * @throws Error when login token is invalid
     */
    private async refreshLoginTokens(){
        let result = await fetchWrapper(`${API_URL}/settings/getLoginTokens`, {
            method: "POST",
            body: JSON.stringify({
                loginToken: this.loginToken
            })
        });

        let data = await result.json();
        if(data['error']){
            throw new Error(data['errorMessage']);
        } else {
            this.loaded.loginTokens = true;
            this.loginTokens = data['data']['tokens'];
        }
    }

    public async getProviders(forceReload = false){
        if(forceReload || !this.loaded.providers){
            await this.refreshProviders();
        }

        return this.providers;
    }

    public async getTokens(forceReload = false){
        if(forceReload || !this.loaded.tokens){
            await this.refreshTokens();
        }

        return this.tokens;
    }

    public async getHybernatedTokens(forceReload = false){
        if(forceReload || !this.loaded.hybernated){
            await this.refreshHybernatedTokens();
        }

        return this.hybernated;
    }

    public async getLoginTokens(forceReload = false){
        if(forceReload || !this.loaded.loginTokens){
            await this.refreshLoginTokens();
        }

        return this.loginTokens;
    }

    public async verifyEncryptionToken(passphrase: string){
        let result = await fetchWrapper(`${API_URL}/user/verifyEncryption`, {
            method: "POST",
            body: JSON.stringify({
                loginToken: this.loginToken,
                passphrase
            })
        });

        let resp = await result.json();

        if('errorMessage' in resp){
            throw new Error(resp.errorMessage);
        } else {
            this.encryptionToken = passphrase;
            return resp.message;
        }
    }

    public async hybernate(){
        let result = await fetchWrapper(`${API_URL}/tokens/hybernate/migrate`, {
            method: "POST",
            body: JSON.stringify({
                loginToken: this.loginToken
            })
        });

        let data:{
            error: boolean,
            errorMessage?: string,
            message?: string,
            data: {
                loginToken: LoginToken
            }
        } = await result.json();

        if('errorMessage' in data){
            throw new Error(data.errorMessage);
        } else {
            return {
                message: data.message,
                loginToken: data.data.loginToken
            };
        }
    }

    public async decryptHybernated(tokenId: number, encryptionToken: string){
        let result = await fetchWrapper(`${API_URL}/tokens/hybernate/decrypt`, {
            method: "POST",
            body: JSON.stringify(this.encryptionToken ? {
                loginToken: this.loginToken,
                tokenId,
                encryptionToken,
                currentEncryption: this.encryptionToken
            } : {
                loginToken: this.loginToken,
                tokenId,
                encryptionToken
            })
        });

        let data:{
            error: boolean,
            errorMessage?: string,
            message?: string
        } = await result.json();

        if('errorMessage' in data){
            throw new Error(data.errorMessage);
        } else {
            return data.message;
        }

    }

    public async updateData(field: "username" | "password" | "name" | "email" | "emailVerification", value: string | boolean, verification?: string){
        let result = await fetchWrapper(`${API_URL}/user/update`, {
            method: "POST",
            body: JSON.stringify({
                loginToken: this.loginToken,
                toBeUpdated: {
                    field,
                    value,
                    verification
                }
            })
        });

        let data:{
            error: boolean,
            resp: string,
            message?: string,
            errorMessage?: string
            data?: {
                loginToken: LoginToken,
                user: User
            }
        } = await result.json();

        if(data.error){
            throw new Error(data.errorMessage);
        } else {
            if(data.resp == "successful"){
                this.loginToken = data.data.loginToken.token;
                
                return {
                    resp: data.resp,
                    message: data.message,
                    loginToken: data.data.loginToken.token
                };
            } else {
                return {
                    resp: data.resp,
                    message: data.message
                }
            }
        }
    }

    public async addToken(provider: string, token: string, username?: string){
        let tokens = await this.getTokens();

        if(this.extraEncryption){    
            const simpleCrypto = new SimpleCrypto(this.encryptionToken);
            token = simpleCrypto.encrypt(token);
        }

        let result = await fetchWrapper(`${API_URL}/tokens/add`, {
            method: "POST",
            body: JSON.stringify(username ? {
                loginToken: this.loginToken,
                provider,
                token,
                username
            } : {
                loginToken: this.loginToken,
                provider,
                token
            })
        });

        let data = await result.json();

        if(data['error']){
            throw new Error(data['errorMessage']);
        } else {
            let token:Token = data.data.token;
            
            this.tokens = [token, ...tokens];
            return data.data.token;
        }
    }

    public async deleteToken(id: number){
        let tokens = await this.getTokens();

        let result = await fetchWrapper(`${API_URL}/tokens/delete`, {
            method: "POST",
            body: JSON.stringify({
                loginToken: this.loginToken,
                token: id
            })
        });

        let data = await result.json();

        if(data['error']){
            throw new Error(data['errorMessage']);
        } else {
            delete tokens[id];
            this.tokens = tokens;
        }
    }

    public async logout(loginToken?: string){
        let result = await fetchWrapper(`${API_URL}/user/logout`, {
            method: "POST",
            body: JSON.stringify({
                loginToken: loginToken ? loginToken : this.loginToken
            })
        });

        let data = await result.json();

        if(data['error']){
            throw new Error(data['errorMessage']);
        } else {
            return data.message;
        }
    }

    public async getLinks(){
        let result = await fetchWrapper(`${API_URL}/user/getLinks`, {
            method: "POST",
            body: JSON.stringify({
                loginToken: this.loginToken
            })
        });

        let data:{
            error: boolean,
            errorMessage: string,
        } | {
            error: boolean,
            data: {
                ssos: Array<{
                    id: number,
                    name: string,
                    provider: string
                }>,
                hasPassword: boolean
            }
        } = await result.json();

        if('errorMessage' in data){
            throw new Error(data.errorMessage);
        } else {
            return data.data;
        }
    }
}

function validateEmail(email: string) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
