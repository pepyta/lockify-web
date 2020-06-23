import React from 'react';
import Section from '../Section';
import SaveButton from '../SaveButton';
import { User } from '../../../modules/api';

export default class ChangePassword extends React.Component<{
    user: User,
    onSectionMounted: (id: string) => void,
    id: string,
    position: number
}, {
    currentPassword: string,
    password: string,
    password2: string,
    hasPassword: boolean
}> {
    state = {
        currentPassword: "",
        password: "",
        password2: "",
        hasPassword: true
    };

    async changePassword(e) {
        e.preventDefault();

        const M = require('materialize-css');

        try {
            let resp = await this.props.user.updateData("password", this.state.password, this.state.currentPassword);

            if (resp.loginToken) {
                localStorage.setItem("loginToken", resp.loginToken);
            }

            M.toast({
                html: resp.message
            });
        } catch (e) {
            M.toast({
                html: e.message,
                classes: "error"
            });
        }
    }

    render() {
        return (

            <Section
                position={this.props.position}
                id="change-password"
                title="Your password"
                action={<SaveButton disabled={this.state.password !== this.state.password2 || this.state.password.length < 8 || !this.state.password.match("[0-9]") || !this.state.password.match("[a-z]") || !this.state.password.match("[A-Z]") } />}
                onSubmit={this.changePassword.bind(this)}>
                <div className="row" style={{ marginBottom: 10 }}>
                    <div className="col s12">
                        Prior to changing your account details we will send an email to your current email address with a confirmation link.
                    </div>
                    <div className="col s12" style={{
                        marginTop: 20
                    }}>
                        <b>
                            Your password must be at least 8 characters long, must contain a lowercase, an uppercase letter and a number.
                        </b>
                    </div>
                </div>
                <div className="row" style={{ marginBottom: 0, display: this.state.hasPassword ? "block" : "none" }}>
                    <div className="col s12 input-field">
                        <input type="password" id="currentPassword" value={this.state.currentPassword} onChange={(e) => {
                            this.setState({
                                currentPassword: e.target.value
                            })
                        }} />
                        <label htmlFor="currentPassword">
                            Your current password
                        </label>
                    </div>
                </div>
                <div className="row" style={{ marginBottom: 0 }}>
                    <div className="col s12 input-field">
                        <input type="password" id="password" value={this.state.password} onChange={(e) => {
                            this.setState({
                                password: e.target.value
                            })
                        }} />
                        <label htmlFor="password">
                            Your new password
                    </label>
                    </div>
                </div>
                <div className="row" style={{ marginBottom: 0 }}>
                    <div className="col s12 input-field">
                        <input type="password" id="password2" value={this.state.password2} onChange={(e) => {
                            this.setState({
                                password2: e.target.value
                            })
                        }} />
                        <label htmlFor="password2">
                            Your new password again
                    </label>
                    </div>
                </div>
            </Section>
        );
    }

    async componentDidMount() {
        const M = require('materialize-css');
        this.props.onSectionMounted(this.props.id);

        let { hasPassword } = await this.props.user.getLinks();

        this.setState({
            hasPassword
        });

        M.AutoInit();
    }
}