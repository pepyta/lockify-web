import React from 'react';
import App from '../components/App';
import Navbar from '../components/Navbar';
import { API_URL } from '../modules/globals';


export default class SettingsPage extends React.Component<{}, {
    tokens: Array<{
        id: number,
        device: string,
        createdAt: string
    }>,
    username: string,
    email: string,
    nickname: string
}> {
    state = {
        tokens: [],
        username: "",
        email: "",
        nickname: ""
    }

    changeUsername(e) {
        e.preventDefault();
    }

    changeEmail(e){
        e.preventDefault();
    }

    render() {
        return (
            <>
                <App />
                <Navbar />
                <main>
                    <div className="container">
                        <div className="row">
                            <div className="col s12 m9">
                                <div className="section scrollspy" id="change-username">
                                    <div className="card hoverable">
                                        <form onSubmit={this.changeUsername.bind(this)}>
                                            <div className="card-content">
                                                <div className="card-title">
                                                    Your username
                                                </div>
                                                <p>
                                                    Prior to changing your account details we will send an email to your current email address with a confirmation link.
                                                </p>
                                                <p>
                                                    <input type="text" id="username" value={this.state.username} onChange={(e) => {
                                                        this.setState({
                                                            username: e.target.value
                                                        })
                                                    }} />
                                                </p>
                                            </div>
                                            <div className="card-action">
                                                <div className="row" style={{
                                                    marginBottom: 0
                                                }}>
                                                    <button className="btn waves-effect black right">Save</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="section scrollspy" id="change-email">
                                    <div className="card hoverable">
                                        <form onSubmit={this.changeEmail.bind(this)}>
                                            <div className="card-content">
                                                <div className="card-title">
                                                    Your email
                                                </div>
                                                <p>
                                                    Prior to changing your account details we will send an email to your current email address with a confirmation link.
                                                </p>
                                                <p>
                                                    <input type="text" id="email" value={this.state.email} onChange={(e) => {
                                                        this.setState({
                                                            email: e.target.value
                                                        })
                                                    }} />
                                                </p>
                                            </div>
                                            <div className="card-action">
                                                <div className="row" style={{
                                                    marginBottom: 0
                                                }}>
                                                    <button className="btn waves-effect black right">Save</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="section scrollspy" id="change-nickname">
                                    <div className="card hoverable">
                                        <form onSubmit={this.changeEmail.bind(this)}>
                                            <div className="card-content">
                                                <div className="card-title">
                                                    Your nickname
                                                </div>
                                                <p>
                                                    Prior to changing your account details we will send an email to your current email address with a confirmation link.
                                                </p>
                                                <p>
                                                    <input type="text" id="nickname" value={this.state.nickname} onChange={(e) => {
                                                        this.setState({
                                                            nickname: e.target.value
                                                        })
                                                    }} />
                                                </p>
                                            </div>
                                            <div className="card-action">
                                                <div className="row" style={{
                                                    marginBottom: 0
                                                }}>
                                                    <button className="btn waves-effect black right">Save</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="section scrollspy" id="active-logins">
                                    <div className="row">
                                        <div className="col s12 section-title">
                                            Active logins
                                        </div>
                                        {this.state.tokens.map((tmp) => {
                                            let token: {
                                                id: number,
                                                device: string,
                                                createdAt: string
                                            } = tmp;
                                            return <div className="col s12">
                                                <div className="card hoverable">
                                                    <div className="card-content">
                                                        <div className="row valign-wrapper" style={{ marginBottom: 0 }}>
                                                            <div className="col s4 center-align">
                                                                <i className="material-icons medium">desktop_windows</i>
                                                            </div>
                                                            <div className="col s8">
                                                                <div className="card-title">{token.device}</div>
                                                                Logged in at {new Date(token.createdAt).toLocaleDateString()} {new Date(token.createdAt).toLocaleTimeString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="col hide-on-small-only m3">
                                <div className="toc-wrapper pin-top pinned">
                                    <ul className="section table-of-contents">
                                        <li>
                                            <a href="#change-username">Username</a>
                                        </li>
                                        <li>
                                            <a href="#change-email">Email</a>
                                        </li>
                                        <li>
                                            <a href="#change-nickname">Nickname</a>
                                        </li>
                                        <li>
                                            <a href="#active-logins">Active logins</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    async componentDidMount() {
        const M = require('materialize-css');

        this.setState({
            email: localStorage.getItem("email")+"",
            username: localStorage.getItem("username")+"",
            nickname: localStorage.getItem("name")+""
        });

        M.updateTextFields();
        M.ScrollSpy.init(document.querySelectorAll('.scrollspy'), {});
        let result = await fetch(`${API_URL}/settings/getLoginTokens`, {
            method: "POST",
            body: JSON.stringify({
                token: localStorage.getItem("loginToken")
            })
        });

        let data = await result.json();
        if (data['error']) {
            M.toast({ html: data['errorMessage'], classes: "error" });
        } else {
            this.setState({
                tokens: data['data']['tokens']
            });
        }
    }
}