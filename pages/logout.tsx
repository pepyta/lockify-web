import React from 'react';
import Router from 'next/router';
import { User } from '../modules/api';

export default class LogoutPage extends React.Component {
    render() {
        return (
            <div style={{
                height: "100vh"
            }} className="container valign-wrapper">
                <div className="row" style={{ width: "100%" }}>
                    <div className="col hide-on-small-only m4"></div>
                    <div className="col s12 m4">
                        <div className="card hoverable" style={{ width: "100%" }}>
                            <div className="card-content">
                                <div className="card-title">
                                    Logging out...
                                    </div>
                            </div>
                            <div style={{
                                marginBottom: 0
                            }} className="progress">
                                <div className="indeterminate"></div>
                            </div>
                        </div>
                    </div>
                    <div className="col hide-on-small-only m4"></div>
                </div>
            </div>
        );
    }

    async componentDidMount() {
        const M = require('materialize-css');
        let loginToken = localStorage.getItem("loginToken");

        try {
            let user = new User(loginToken, localStorage.getItem("encryptionToken"));

            let resp = await user.logout();

            M.toast({
                html: resp
            });
        } catch (e) {
            M.toast({
                html: e,
                classes: "error"
            });
        }

        localStorage.removeItem("loginToken");
        localStorage.removeItem("encryptionToken");

        Router.push("/auth");
    }
}