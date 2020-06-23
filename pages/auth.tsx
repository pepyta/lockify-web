import React from 'react';
import { RECAPTCHA_SITE_KEY } from '../modules/globals';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import TabLink from '../components/TabLink';
import Head from 'next/head';

export default class LoginPage extends React.Component<{
    context: any
}, {
    switchedPage: boolean
}> {
    state = {
        switchedPage: true
    }

    render() {
        return (
            <>
                <Head>
                    <script async src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}></script>
                </Head>
                <div className="row" style={{ marginBottom: 0, minHeight: "100vh" }}>
                    <div className="col s12 m6 l4 auth-side valign-wrapper z-depth-1" style={{ minHeight: "100vh" }}>
                        <div className="row" style={{ marginBottom: 0, marginLeft: 40, marginRight: 40, width: "100%" }}>
                            <div className="row">
                                <div className="col s12">
                                    <TabLink onClick={() => {
                                        this.setState({
                                            switchedPage: true
                                        })
                                    }} active={this.state.switchedPage}>Login</TabLink>
                                    <TabLink onClick={() => {
                                        this.setState({
                                            switchedPage: false
                                        })
                                    }} active={!this.state.switchedPage}>Register</TabLink>
                                </div>
                            </div>
                            {this.state.switchedPage ? <Login /> : <Register />}
                        </div>
                    </div>
                    <div className="col hide-on-small-only m6 l8 valign-wrapper" style={{ height: "100vh" }}>  
                        <div className="row col s12 no-padding">
                            <div className="col s2"></div><div className="col s8"><img src={this.state.switchedPage ? "img/auth/login.svg" : "img/auth/register.svg"} className="responsive-img" /></div><div className="col s2"></div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}