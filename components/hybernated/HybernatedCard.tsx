import React from 'react';
import { User } from '../../modules/api';

export default class HybernatedCard extends React.Component<{
    id: number,
    service: string,
    username?: string,
    onDecryption: (id: number) => void,
    user: User
}, {
    password: string,
    loading: boolean,
    disabled: boolean
}> {
    state = {
        password: "",
        loading: false,
        disabled: false
    };

    async decrypt(e) {
        e.preventDefault();
        const M = require('materialize-css');

        this.setState({
            disabled: true
        });

        try {
            let msg = await this.props.user.decryptHybernated(this.props.id, this.state.password);
            M.toast({
                html: msg
            });

            this.setState({
                password: ""
            });

            this.props.onDecryption(this.props.id);
        } catch (e) {
            M.toast({
                html: e.message,
                classes: "error"
            });

            this.setState({
                disabled: false
            });
        }
    }

    render() {
        return (
            <div className="card hoverable">
                <div className="card-content">
                    <div className="row" style={{
                        marginBottom: 0
                    }}>
                        <div className="col s4">
                            Service:
                        </div>
                        <div className="col s8">
                            <b>
                                {this.props.service}
                            </b>
                        </div>
                        {this.props.username ? <>
                            <div className="col s4">
                                Username:
                            </div>
                            <div className="col s8">
                                <b>
                                    {this.props.username}
                                </b>
                            </div>
                        </> : ""}
                    </div>
                </div>
                <div className="card-action">
                    <form onSubmit={this.decrypt.bind(this)}>
                        <div className="row valign-wrapper" style={{
                            marginBottom: 0
                        }}>
                            <div className="col s8 input-field">
                                <input type="password" value={this.state.password} style={{
                                    marginBottom: 0
                                }} onChange={(e) => {
                                    this.setState({
                                        password: e.target.value
                                    })
                                }} id={`hybernated-password-${this.props.id}`} />
                                <label htmlFor={`hybernated-password-${this.props.id}`}>
                                    Decryption key
                                </label>
                            </div>
                            <div className="col s4">
                                <button disabled={this.state.loading} className="btn col s12 no-padding waves-effect waves-light black">
                                    Decrypt
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}