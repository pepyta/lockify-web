import React from 'react';
import { RECAPTCHA_SITE_KEY, getBrowser } from '../../modules/globals';
import { ReCaptcha } from 'react-recaptcha-v3';
import { User } from '../../modules/api';
import { motion } from 'framer-motion';

export default class Register extends React.Component<{}, {
    email: string,
    password: string,
    username: string,
    name: string,
    passwordAgain: string,
    disabledButton: boolean,
    reCaptchaTry: number,
    reCaptchaToken: string
}> {
    state = {
        email: "",
        password: "",
        passwordAgain: "",
        username: "",
        name: "",
        disabledButton: false,
        reCaptchaTry: 1,
        reCaptchaToken: ""
    };

    async register(e) {
        e.preventDefault();
        const M = require('materialize-css');

        this.setState({
            disabledButton: true,
            reCaptchaTry: this.state.reCaptchaTry + 1
        });

        try {
            let result = await User.register(this.state.username, this.state.email, this.state.password, this.state.name, this.state.reCaptchaToken, getBrowser());

            M.toast({
                html: result,
                displayLength: Number.POSITIVE_INFINITY
            });
        } catch (e) {
            M.toast({
                html: e,
                classes: "error"
            });
        }

        this.setState({
            disabledButton: false
        });
    }

    render() {
        return (
            <>
                <ReCaptcha
                    key={`recaptcha-register-${this.state.reCaptchaTry}`}
                    sitekey={RECAPTCHA_SITE_KEY}
                    action='submit'
                    verifyCallback={this.verifyCallback.bind(this)}
                />
                <form className="col s12 no-padding" onSubmit={this.register.bind(this)}>
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
                        <input type="text" autoComplete={"off"} required value={this.state.username} onChange={(e) => {
                            this.setState({
                                username: e.target.value
                            })
                        }} id="username" />
                        <label htmlFor="username">Username</label>
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
                        <input type="email" autoComplete={"off"} required value={this.state.email} onChange={(e) => {
                            this.setState({
                                email: e.target.value
                            })
                        }} id="email" />
                        <label htmlFor="email">Email address</label>
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
                            delay: 0.2
                        }} className="col s12 input-field">
                        <input type="password" autoComplete={"off"} required value={this.state.password} onChange={(e) => {
                            this.setState({
                                password: e.target.value
                            })
                        }} id="password" />
                        <label htmlFor="password">Password</label>
                        <span className="helper-text" data-error={this.state.password.length < 8 || !this.state.password.includes("[0-9]") || !this.state.password.includes("[A-Z]") || !this.state.password.includes("[a-z]") ? "Your password must contain one small, one capital and one number at least and must be longer than 8 character." : ""}>Helper text</span>
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
                            delay: 0.3
                        }} className="col s12 input-field">
                        <input type="password" autoComplete={"off"} data-error={this.state.password !== this.state.passwordAgain ? "Your passwords doesn't match." : ""} required value={this.state.passwordAgain} onChange={(e) => {
                            this.setState({
                                passwordAgain: e.target.value
                            })
                        }} id="password2" />
                        <label htmlFor="password2">Password again</label>
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
                            delay: 0.4
                        }} className="col s12 input-field">
                        <input type="text" autoComplete={"off"} required value={this.state.name} onChange={(e) => {
                            this.setState({
                                name: e.target.value
                            })
                        }} id="name" />
                        <label htmlFor="name">Your nickname or your full name</label>
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
                            delay: 0.5
                        }} className="col s12 input-field">
                        <button className="btn btn-large waves-effect waves-light black white-text col s12 no-padding" disabled={this.state.disabledButton}>
                            Register
                        </button>
                    </motion.div>
                </form>
            </>
        );
    }

    verifyCallback(reCaptchaToken){
        this.setState({
            reCaptchaToken
        });
    }
}