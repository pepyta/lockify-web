import React from 'react';
import { User, LoginToken } from '../../../modules/api';
import Section from '../Section';

export default class ActiveLogins extends React.Component<{
    user: User,
    onSectionMounted: (id: string) => void,
    id: string,
    position: number
}, {
    loginTokens: Array<LoginToken>
}> {
    state = {
        loginTokens: new Array<LoginToken>()
    };

    async logout(loginToken: LoginToken){
        const M = require('materialize-css');

        let backup = this.state.loginTokens;
        let loginTokens = backup.filter(e => e !== loginToken)

        this.setState({
            loginTokens
        });

        try {
            let resp = await this.props.user.logout(loginToken.token);
            M.toast({
                html: resp 
            });
        } catch(e) {
            this.setState({
                loginTokens: backup
            });

            M.toast({
                html: e.message 
            });
        }
    }

    render() {
        return (
            <Section
                position={this.props.position}
                id="active-logins"
                title="Active logins">
                <table className="responsive-table">
                    <thead>
                        <tr>
                            <th>Device</th>
                            <th>Identifier</th>
                            <th>Logged in at</th>
                            <th>Logout</th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.state.loginTokens.map((loginToken) => {
                            let d = new Date(loginToken.createdAt);
                            return (
                                <tr>
                                    <td><i className="material-icons">desktop_windows</i></td>
                                    <td>{loginToken.device} {this.props.user.loginToken == loginToken.token ? <b>(current)</b> : ""}</td>
                                    <td>{d.toLocaleDateString()} {d.toLocaleTimeString()}</td>
                                    <td>
                                        <button onClick={(e) => {
                                            e.preventDefault();
                                            this.logout(loginToken);
                                        }} className="btn red waves-effect waves-light" disabled={this.props.user.loginToken == loginToken.token}>
                                            Logout
                                        </button>
                                    </td>
                                </tr>);
                        })}
                    </tbody>
                </table>
            </Section>
        );
    }

    async componentDidMount() {
        try {
            let loginTokens = await this.props.user.getLoginTokens();

            this.setState({
                loginTokens
            });
        } catch (e) {
            const M = require('materialize-css');
            M.toast({
                html: e,
                classes: "error"
            });
        }
        this.props.onSectionMounted(this.props.id);
    }
}