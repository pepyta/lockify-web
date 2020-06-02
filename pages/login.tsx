import React from 'react';
import App from '../components/App';
import Link from 'next/link';
import { API_URL, validateEmail, getBrowser, RECAPTCHA_SITE_KEY } from '../modules/globals';
import Router from 'next/router';
import { loadReCaptcha, ReCaptcha } from 'react-recaptcha-v3';
import Head from 'next/head';

export default class LoginPage extends React.Component<{}, {
    email: string,
    password: string,
    disabledButton: boolean,
    reCaptchaToken: string,
    reCaptchaTry: number
}> {
    state = {
        email: "",
        password: "",
        disabledButton: false,
        reCaptchaToken: "",
        reCaptchaTry: 1
    };

    async login(e){
        e.preventDefault();

        const M = require('materialize-css');

        this.setState({
            disabledButton: true,
            reCaptchaTry: this.state.reCaptchaTry + 1
        });

        let result = await fetch(`${API_URL}/user/login`, {
            method: "POST",
            body: JSON.stringify(validateEmail(this.state.email) ? {
                email: this.state.email,
                password: this.state.password,
                device: getBrowser(),
                reCaptchaToken: this.state.reCaptchaToken
            } : {
                username: this.state.email,
                password: this.state.password,
                device: getBrowser(),
                reCaptchaToken: this.state.reCaptchaToken
            })
        });

        let data = await result.json();

        if(data['error']){
            M.toast({html: data['errorMessage'], classes: "error"}); 
        } else {
            data = data['data'];
            localStorage.setItem("loginToken", data['loginToken']['token']);
            localStorage.setItem("name", data['user']['name']);
            localStorage.setItem("email", data['user']['email']);
            localStorage.setItem("username", data['user']['username']);
            localStorage.setItem("userid", data['user']['userid']);
            Router.push("/");
            M.toast({html: "Successful login!", classes: "successful"});
        }

        this.setState({
            disabledButton: false
        });
    }

    render() {
        return (
            <>
                <App />
                <Head>
                    <script src="https://apis.google.com/js/platform.js" async defer />
                    <meta name="google-signin-client_id" content="YOUR_CLIENT_ID.apps.googleusercontent.com" />
                </Head>

                <div className="row" style={{ marginBottom: 0, height: "100vh" }}>
                    <div className="col s12 m6 l4 white valign-wrapper z-depth-1" style={{ height: "100%" }}>
                        <div className="row center-align" style={{ marginBottom: 0, marginLeft: "auto", marginRight: "auto", padding: 20 }}>
                            <form onSubmit={this.login.bind(this)}>
                                <div className="col s12 input-field">
                                    <input type="text" value={this.state.email} onChange={(e) => {
                                        this.setState({
                                            email: e.target.value
                                        })
                                    }} id="email" />
                                    <label htmlFor="email">Email address or username</label>
                                </div>
                                <div className="col s12 input-field">
                                    <input type="password" value={this.state.password} onChange={(e) => {
                                        this.setState({
                                            password: e.target.value
                                        })
                                    }} id="password" />
                                    <label htmlFor="password">Password</label>
                                </div>
                                <ReCaptcha
                                    key={`recaptcha-${this.state.reCaptchaTry}`}
                                    sitekey={RECAPTCHA_SITE_KEY}
                                    action='submit'
                                    verifyCallback={this.verifyCallback}
                                />
                                <div className="col s12 input-field">
                                    <button disabled={this.state.disabledButton} className="btn btn-large waves-effect waves-light black">Login</button>
                                </div>
                                <div className="col s12">
                                    Don't have an account yet? <Link href="register">Register one!</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="col hide-on-small-only m6 l8" style={{ height: "100vh" }}>
                    </div>
                </div>
            </>
        );
    }

    verifyCallback = (reCaptchaToken) => {  
        this.setState({
            reCaptchaToken
        });
    }

    componentDidMount(){        
        loadReCaptcha(RECAPTCHA_SITE_KEY);
    }
}