import React from 'react';
import { User } from '../../../modules/api';
import Section from '../Section';

export default class TwoFactorAuthentication extends React.Component<{
    user: User,
    onSectionMounted: (id: string) => void,
    id: string,
    position: number
}, {
    checked: boolean,
    disabled: boolean
}> {
    modal;
    checkbox;

    state = {
        checked: this.props.user.emailVerification,
        disabled: false
    }

    async handler(){
        if(this.state.checked){
            this.modal.open();
        } else {
            this.setState({
                checked: true
            });

            const M = require('materialize-css');
            
            try {
                let resp = await this.props.user.updateData("emailVerification", true);

                if('loginToken' in resp){
                    localStorage.setItem("loginToken", resp.loginToken);
                }

                M.toast({
                    html: resp.message
                });
            } catch(e){
                M.toast({
                    html: e.message
                });

                this.setState({
                    checked: false
                });
            }
        }
    };

    render() {
        return (
            <>
                <div id="two-factor-authentication-modal" className="modal">
                    <div className="modal-content">
                        <h4>Security warning</h4>
                        <p>Disabling this feature will leave your account vulnurable to anyone who has your password. We recommend you to not turn it off.</p>
                        <p>
                            <div className="input-field center-align">
                                <button className="btn waves-effect waves-light red white-text" onClick={async (e) => {
                                    e.preventDefault();
                                    const M = require('materialize-css');

                                    this.modal.close();
                                    this.setState({
                                        disabled: true
                                    });

                                    try {
                                        let resp = await this.props.user.updateData("emailVerification", false);
                                        console.log(resp);
                                        if('loginToken' in resp){
                                            localStorage.setItem("loginToken", resp.loginToken);

                                            this.setState({
                                                checked: false
                                            });
                                        }

                                        M.toast({
                                            html: resp.message
                                        });
                                    } catch(e){
                                        M.toast({
                                            html: e.message,
                                            classes: "error"
                                        });
                                    }

                                    this.setState({
                                        disabled: false
                                    });
                                }}>
                                    Disable this feature
                                </button>
                            </div>
                        </p>
                        <p style={{
                            marginBottom: 0
                        }}>
                            <div id="checkbox-2fa" className="input-field center-align">
                                <button className="btn-flat waves-effect waves-dark" onClick={(e) => {
                                    e.preventDefault();
                                    this.modal.close();
                                }}>
                                    Don't disable it
                                </button>
                            </div>
                        </p>
                    </div>
                </div>
                <Section
                    position={this.props.position}
                    title={"Two factor authentication"}
                    id={this.props.id}>
                    <label>
                        <input id="checkbox-2fa" disabled={this.state.disabled} type="checkbox" checked={this.state.checked} onClick={this.handler.bind(this)} />
                        <span>Enable email verification when signing in or changing user informations</span>
                    </label>
                </Section>
            </>
        );
    }

    componentDidMount() {
        const M = require('materialize-css');

        this.props.onSectionMounted(this.props.id);
        this.modal = M.Modal.init(document.querySelectorAll('.modal#two-factor-authentication-modal'), {
            dismissable: false
        })[0];
    }
}