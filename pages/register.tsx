import React from 'react';
import App from '../components/App';
import Link from 'next/link';
import { API_URL, validateEmail, getBrowser } from '../modules/globals';
import Router from 'next/router';

export default class RegisterPage extends React.Component<{}, {
    email: string,
    password: string,
    username: string,
    name: string,
    passwordAgain: string,
    disabledButton: boolean
}> {
    state = {
        email: "",
        password: "",
        passwordAgain: "",
        username: "",
        name: "",
        disabledButton: false
    };

    async register(e) {
        e.preventDefault();
        const M = require('materialize-css');

        this.setState({
            disabledButton: true
        });

        let result = await fetch(`${API_URL}/user/register`, {
            method: "POST",
            body: JSON.stringify(validateEmail(this.state.email) ? {
                email: this.state.email,
                password: this.state.password,
                name: this.state.name,
                username: this.state.username,
                device: getBrowser()
            } : {
                    username: this.state.email,
                    password: this.state.password,
                    device: getBrowser()
                })
        });

        let data = await result.json();

        if(data['error']){
            M.toast({html: data['errorMessage'], classes: "error"}); 
        } else {
            data = data['data'];
            localStorage.setItem("loginToken", data['token']['token']);
            localStorage.setItem("name", data['user']['name']);
            localStorage.setItem("email", data['user']['email']);
            localStorage.setItem("username", data['user']['username']);
            localStorage.setItem("userid", data['user']['userid']);
            Router.push("/");
            M.toast({html: "Successful registration!", classes: "successful"});
        }

        this.setState({
            disabledButton: false
        });
    }

    render() {
        return (
            <>
                <App />
                <div className="row" style={{ marginBottom: 0, height: "100vh" }}>
                    <div className="col s12 m6 l4 white valign-wrapper z-depth-1" style={{ height: "100%" }}>
                        <div className="row" style={{ marginBottom: 0, marginLeft: "auto", marginRight: "auto", padding: 20 }}>
                            <ul className="stepper linear">
                                <li className="step active">
                                    <div className="step-title waves-effect">Your basic informations</div>
                                    <div className="step-content">
                                        <div className="row">
                                            <div className="col s12 input-field">
                                                <input type="text" required value={this.state.username} onChange={(e) => {
                                                    this.setState({
                                                        username: e.target.value
                                                    })
                                                }} id="username" />
                                                <label htmlFor="username">Username</label>
                                            </div>
                                            <div className="col s12 input-field">
                                                <input type="email" required value={this.state.email} onChange={(e) => {
                                                    this.setState({
                                                        email: e.target.value
                                                    })
                                                }} id="email" />
                                                <label htmlFor="email">Email address</label>
                                            </div>
                                            <div className="col s12 input-field">
                                                <input type="password" required value={this.state.password} onChange={(e) => {
                                                    this.setState({
                                                        password: e.target.value
                                                    })
                                                }} id="password" />
                                                <label htmlFor="password">Password</label>
                                            </div>
                                            <div className="col s12 input-field">
                                                <input type="password" required value={this.state.passwordAgain} onChange={(e) => {
                                                    this.setState({
                                                        passwordAgain: e.target.value
                                                    })
                                                }} id="password2" />
                                                <label htmlFor="password2">Password again</label>
                                            </div>
                                        </div>
                                        <div className="step-actions">
                                            <button className="waves-effect waves-dark btn next-step">Continue</button>
                                        </div>
                                    </div>
                                </li>
                                <li className="step">
                                    <div className="step-title waves-effect">How do you want us to call you?</div>
                                    <div className="step-content">
                                        <form onSubmit={this.register.bind(this)}>
                                            <div className="row">
                                                <div className="col s12 input-field">
                                                    <input type="text" value={this.state.name} onChange={(e) => {
                                                        this.setState({
                                                            name: e.target.value
                                                        })
                                                    }} id="name" />
                                                    <label htmlFor="name">Your nickname or your full name</label>
                                                </div>
                                            </div>
                                            <div className="step-actions">
                                                <button className="waves-effect waves-dark btn">Register</button>
                                            </div>
                                        </form>
                                    </div>
                                </li>
                            </ul>
                            <div className="col s12">
                                Do you already have an account? <Link href="login">Then just log in!</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col hide-on-small-only m6 l8" style={{ height: "100vh" }}>
                    </div>
                </div>
                <script src="https://unpkg.com/materialize-stepper@3.1.0/dist/js/mstepper.min.js"></script>
                <script type="module" src="js/init.mstepper.js"></script>
            </>
        );
    }

    componentDidMount(){
        const M = require('materialize-css');
        require('../public/js/init.mstepper').initStepper(() => {
            if(this.state.password !== this.state.passwordAgain){
                M.toast({html: "The two passwords doesn't match.", classes: "error"});
                return false;
            }

            if(this.state.password.length < 8){
                M.toast({ html: "Your password cannot be shorter then 8 characters.", classes: "error" });
                return false;
            }

            if(validateEmail(this.state.username)){
                M.toast({html: "Your username cannot be an email address.", classes: "error"});
                return false;
            }

            if(!validateEmail(this.state.email)){
                M.toast({html: "Your email must be an email address.", classes: "error"});
                return false;
            }
            return true;
        });
    }
}