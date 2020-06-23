import React from 'react';
import Router from 'next/router';
import { RECAPTCHA_SITE_KEY, getBrowser } from '../../modules/globals';
import { ReCaptcha } from 'react-recaptcha-v3';
import { User, API_URL } from '../../modules/api';
import { motion } from 'framer-motion';
import GoogleLogin from 'react-google-login';

export default class Login extends React.Component<{}, {
    email: string,
    password: string
    reCaptchaTry: number,
    disabledButton: boolean,
    reCaptchaToken: string
}> {
    state = {
        email: "",
        password: "",
        reCaptchaToken: "",
        reCaptchaTry: 1,
        disabledButton: false
    };

    firstTry = true;

    async login(e) {
        e.preventDefault();

        this.setState({
            disabledButton: true,
            reCaptchaTry: this.state.reCaptchaTry + 1
        });

        const M = require('materialize-css');

        try {
            let user = await User.login(this.state.email, this.state.password, this.state.reCaptchaToken, getBrowser());
            if (user.user) {
                localStorage.setItem("loginToken", user.user.loginToken);
                Router.push("/");
            }

            M.toast({ html: user.message, classes: "successful" });
        } catch (e) {
            M.toast({ html: e, classes: "error" });
            this.setState({
                disabledButton: false
            });
        }
    }

    handleLogin(data) {
        const M = require('materialize-css');

        if (data['error']) {
            M.toast({ html: data['errorMessage'], classes: "error" });
            this.setState({
                disabledButton: false
            });
        } else {
            data = data['data'];
            localStorage.setItem("loginToken", data['loginToken']['token']);
            Router.push("/");
            M.toast({ html: "Successful login!", classes: "successful" });
        }
    }

    async handleGoogleAuth(result) {
        let resp = await fetch(`${API_URL}/v1/user/login/google`, {
            method: "POST",
            body: JSON.stringify({
                device: getBrowser(),
                token: result['tokenId']
            })
        });

        let data = await resp.json();
        this.handleLogin(data);
    }

    render() {
        return (
            <form className="col s12 no-padding" onSubmit={this.login.bind(this)}>
                <motion.div
                    initial={{
                        scale: 0
                    }}
                    animate={{
                        scale: 1
                    }}
                    transition={{
                        type: "tween",
                        duration: 0.2
                    }} className="col s12 input-field">
                    <input type="text" autoComplete={"off"} value={this.state.email} onChange={(e) => {
                        this.setState({
                            email: e.target.value
                        })
                    }} id="email" />
                    <label htmlFor="email">Email address or username</label>
                </motion.div>
                <motion.div
                    initial={{
                        scale: 0
                    }}
                    animate={{
                        scale: 1
                    }}
                    transition={{
                        type: "tween",
                        duration: 0.2,
                        delay: 0.1
                    }} className="col s12 input-field">
                    <input type="password" autoComplete={"off"} value={this.state.password} onChange={(e) => {
                        this.setState({
                            password: e.target.value
                        })
                    }} id="password" />
                    <label htmlFor="password">Password</label>
                </motion.div>
                <ReCaptcha
                    key={`recaptcha-login-${this.state.reCaptchaTry}`}
                    sitekey={RECAPTCHA_SITE_KEY}
                    action='submit'
                    verifyCallback={this.verifyCallback.bind(this)}
                />
                <motion.div
                    initial={{
                        scale: 0
                    }}
                    animate={{
                        scale: 1
                    }}
                    transition={{
                        type: "tween",
                        delay: 0.2,
                        duration: 0.2
                    }} className="col s12 input-field">
                    <button disabled={this.state.disabledButton} className="btn btn-large waves-effect waves-light black col s12">Login</button>
                </motion.div>


                <motion.div
                    initial={{
                        scale: 0
                    }}
                    animate={{
                        scale: 1
                    }}
                    transition={{
                        type: "tween",
                        delay: 0.3,
                        duration: 0.2
                    }} className="col s12 input-field">
                    <GoogleLogin
                        clientId="599565909422-hu86aagt1kvml7484csgroo0jgp301ee.apps.googleusercontent.com"
                        buttonText="Login"
                        onSuccess={async (result) => {
                            this.setState({
                                disabledButton: true
                            });

                            let resp = await fetch(`${API_URL}/user/login/google`, {
                                method: "POST",
                                body: JSON.stringify({
                                    device: getBrowser(),
                                    token: result['tokenId']
                                })
                            });

                            let data = await resp.json();
                            this.handleLogin(data);
                        }}
                        onFailure={console.log}
                        cookiePolicy={'single_host_origin'}
                        render={renderProps => (
                            <button onClick={renderProps.onClick} disabled={renderProps.disabled || this.state.disabledButton} className="btn btn-large waves-effect waves-dark white black-text col s12"><svg style={{
                                margin: 18
                            }} className="left" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><g fill="#000" fill-rule="evenodd"><path d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z" fill="#EA4335"></path><path d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z" fill="#4285F4"></path><path d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z" fill="#FBBC05"></path><path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z" fill="#34A853"></path><path fill="none" d="M0 0h18v18H0z"></path></g></svg> Login with Google</button>

                        )}
                    />
                </motion.div>
            </form>
        )
    }

    verifyCallback(reCaptchaToken) {
        this.setState({
            reCaptchaToken
        });
    }
}