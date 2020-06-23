import React from 'react';
import { User, API_URL } from '../../../modules/api';
import UnlinkButton from '../UnlinkButton';
import Section from '../Section';
import GoogleLogin from 'react-google-login';

export default class ExternalLogins extends React.Component<{
    user: User,
    onSectionMounted: (id: string) => void,
    id: string,
    position: number
}, {
    loaded: {
        links: boolean
    },
    links: any,
    hasPassword: boolean,
}> {
    state = {
        loaded: {
            links: false
        },
        hasPassword: false,
        links: {}
    };

    async handleGoogleAuth(result) {
        const M = require('materialize-css');
        let resp = await fetch(`${API_URL}/user/link/google`, {
            method: "POST",
            body: JSON.stringify({
                loginToken: localStorage.getItem("loginToken"),
                googleToken: result['tokenId']
            })
        });


        let data = await resp.json();

        if (data['error']) {
            M.toast({ html: data['errorMessage'], classes: "error" });
        } else {
            let links = this.state.links;
            links['google'] = data['data']['sso'];
            this.setState({
                links
            });
            M.toast({ html: data['message'], classes: "successful" });
        }
    }

    async componentDidMount(){
        let { ssos, hasPassword } = await this.props.user.getLinks();

        let links = {};
        ssos.forEach((sso) => {
            links[sso.provider] = sso;
        });

        this.setState({
            hasPassword,
            links,
            loaded: {
                links: true
            }
        });
        this.props.onSectionMounted(this.props.id);
    }

    render(){
        return <Section
        position={this.props.position}
        id="ssos"
        title="Active external logins">

        {!this.state.hasPassword && Object.keys(this.state.links).length == 1 ? <p style={{ marginBottom: 20 }}>
            You can't unlink anymore account as you won't be able to login next time.
                </p> : ""}
        <div className="row valign-wrapper" style={{
            marginBottom: 0
        }}>
            <div className="col s5">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1280px-Google_2015_logo.svg.png" style={{
                    maxHeight: 54
                }} className="responsive-img" />
            </div>
            <div className="col s7">
                {this.state.loaded.links ? 'google' in this.state.links ?
                    <UnlinkButton
                        id={"google-unlink-button"}
                        disabledBecausePassword={!this.state.hasPassword && Object.keys(this.state.links).length == 1}
                        ssoId={this.state.links['google']['id']} 
                        onSuccessful={() => {
                            let links = this.state.links;
                            delete links['google'];
                            this.setState({
                                links
                            });
                        }}/> :

                    <GoogleLogin
                        clientId="599565909422-hu86aagt1kvml7484csgroo0jgp301ee.apps.googleusercontent.com"
                        onSuccess={this.handleGoogleAuth.bind(this)}
                        onFailure={console.log}
                        cookiePolicy={'single_host_origin'}
                        render={renderProps => (
                            <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="right btn btn-large waves-effect waves-dark white black-text"><svg style={{
                                margin: 18
                            }} className="left" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><g fill="#000" fill-rule="evenodd"><path d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z" fill="#EA4335"></path><path d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z" fill="#4285F4"></path><path d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z" fill="#FBBC05"></path><path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z" fill="#34A853"></path><path fill="none" d="M0 0h18v18H0z"></path></g></svg> Login with Google</button>
                        )}
                    /> :

                    <button
                        className="btn btn-large right disabled">
                        Loading...
                            </button>}
            </div>
        </div>
    </Section>
    }
}