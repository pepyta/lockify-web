import React from 'react';
import { User } from '../../modules/api';

export default class PromptExtraEncryption extends React.Component<{
    user: User
}, {
    continue: boolean,
    encryptionToken: string,
    disableSendButton: boolean
}> {
    modalInstance;

    state = {
        continue: false,
        encryptionToken: "",
        disableSendButton: false
    };

    continueWithout() {
        localStorage.setItem("dismissed-extra-encryption-modal", "true");
        this.modalInstance.close();
    }

    continueWith() {
        this.setState({
            continue: true
        });
    }

    async encryptTokens(e) {
        e.preventDefault();
        const M = require('materialize-css');

        if (this.state.encryptionToken == "") return;
        this.setState({
            disableSendButton: true
        });

        try {
            let resp = await this.props.user.encryptTokens(this.state.encryptionToken)

            localStorage.setItem("loginToken", resp.loginToken);
            localStorage.setItem("encryptionToken", this.state.encryptionToken);
            M.toast({
                html: resp.message
            });

            this.modalInstance.close();
        } catch (e) {
            M.toast({
                html: e,
                classes: "error"
            });
        }
    }

    render() {
        return (
            <div id="prompt-extra-encryption-modal" className="modal">
                <div className="modal-content">
                    <div className="row" style={{
                        marginBottom: 0
                    }}>
                        <h4 className="col s12">Welcome to Lockify!</h4>
                    </div>
                    {!this.state.continue ? <>
                        <div className="row">
                            <div className="col s12">
                                Encryption is the key to secure your data. If you enable encryption on your account then you will only be able to access your data once you entered your encryption key (that you provided).
                        </div>
                        </div>
                        <div className="row">
                            <div className="col s12 center-align">
                                <button className="btn waves-effect waves-light black white-text" onClick={this.continueWith.bind(this)}>Setup encryption key</button>
                            </div>
                        </div>
                        <div className="row" style={{
                            marginBottom: 0
                        }}>
                            <div className="col s12 center-align">
                                <button className="btn-flat waves-effect waves-dark black-text" onClick={this.continueWithout.bind(this)}>Continue without encryption key</button>
                            </div>
                        </div>
                    </> : <>
                            <form onSubmit={this.encryptTokens.bind(this)}>
                                <div className="row">
                                    <div className="col s12" style={{
                                        marginBottom: 20
                                    }}>
                                        After you encrypt your data and if you forget your encryption token, then you won't be able to access any of your login tokens anymore!
                                    </div>

                                    <div className="col s12">
                                        Your encryption token must be at least 6 characters long!
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col s12 input-field">
                                        <input type="text" value={this.state.encryptionToken} onChange={(e) => {
                                            this.setState({
                                                encryptionToken: e.target.value
                                            })
                                        }} id="encryption-token" />
                                        <label htmlFor="encryption-token">Enter your encryption token!</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col s12 center-align">
                                        <button className="btn waves-effect waves-light black white-text" disabled={this.state.disableSendButton || this.state.encryptionToken.length < 6} onClick={this.encryptTokens.bind(this)}>Setup encryption key</button>
                                    </div>
                                </div>
                            </form>
                            <div className="row" style={{
                                marginBottom: 0
                            }}>
                                <div className="col s12 center-align">
                                    <button className="btn-flat waves-effect waves-dark black-text" onClick={() => {
                                        this.setState({
                                            continue: false
                                        })
                                    }}>Back</button>
                                </div>
                            </div>
                        </>}
                </div>
            </div>);
    }

    componentDidMount() {
        const M = require('materialize-css');

        this.modalInstance = M.Modal.init(document.querySelectorAll('.modal#prompt-extra-encryption-modal'), {
            dismissible: false,
        })[0];

        setTimeout(() => {
            this.modalInstance.open();
        }, 1000);
    }
}