import React from 'react';
import App from '../components/App';
import Navbar from '../components/Navbar';
import TwoFACard from '../components/TwoFACard';
import TwoFALoader from '../components/TwoFALoader';
import { API_URL } from '../modules/globals';

type Token = {
    id: number,
    provider: {
        id: number,
        image: string,
        name: string
    },
    token: string,
    username: string
};

export default class IndexPage extends React.Component<{}, {
    enteredCode: string,
    service: string,
    username: string,
    tokens: Array<any>,
    loading: boolean
}> {

    constructor(props) {
        super(props);
        this.deleteToken = this.deleteToken.bind(this);
    }

    state = {
        enteredCode: "",
        service: "",
        username: "",
        tokens: [],
        loading: true
    };

    async addSite(e) {
        e.preventDefault();

        const M = require('materialize-css');

        let result = await fetch(`${API_URL}/tokens/add`, {
            method: "POST",
            body: JSON.stringify({
                loginToken: localStorage.getItem("loginToken"),
                provider: this.state.service,
                token: this.state.enteredCode.toLowerCase().split(" ").join(""),
                username: this.state.username
            })
        });

        let data = await result.json();

        if (data['error']) {
            M.toast({ html: data['errorMessage'], classes: "error" });
        } else {
            this.setState({
                enteredCode: "",
                service: "",
                username: "",
                tokens: [data['data']['token'], ...this.state.tokens]
            });

            M.Modal.getInstance(document.querySelector('#add-code')).close();

            M.toast({ html: data['message'] });
        }
    }

    deleteToken(id) {
        console.log(this.state);

        const items = this.state.tokens.filter((tmp) => {
            let token: Token = tmp;
            return token.id !== id;
        });
        this.setState({ tokens: items });
    }

    render() {
        return (
            <>
                <App />
                <Navbar />
                <main>
                    <div className="container">
                        <div className="row">
                            {this.state.loading ? <><div className="col s12 m6"><div className="card hoverable"><div className="card-content"><TwoFALoader /></div></div></div><div className="col s12 m6"><div className="card hoverable"><div className="card-content"><TwoFALoader /></div></div></div><div className="col s12 m6"><div className="card hoverable"><div className="card-content"><TwoFALoader /></div></div></div><div className="col s12 m6"><div className="card hoverable"><div className="card-content"><TwoFALoader /></div></div></div></> : ""}

                            {!this.state.loading ? <div className="col hide-on-small-only m6">
                                {this.state.tokens.map((tmp, index) => {
                                    if (index % 2 == 1) return;
                                    let token: Token = tmp;
                                    return <TwoFACard
                                        handleDelete={this.deleteToken}
                                        id={`twofacard-${token.id}`}
                                        tokenId={token.id}
                                        token={token.token}
                                        image={token.provider.image == "" ? null : token.provider.image} service={token.provider.name} account={token.username == "" ? null : token.username} />
                                })}
                            </div> : ""}

                            {!this.state.loading ? <div className="col hide-on-small-only m6">
                                {this.state.tokens.map((tmp, index) => {
                                    if (index % 2 == 0) return;
                                    let token: Token = tmp;
                                    return <TwoFACard
                                        handleDelete={this.deleteToken} id={`twofacard-${token.id}`} tokenId={token.id} token={token.token} image={token.provider.image == "" ? null : token.provider.image} service={token.provider.name} account={token.username == "" ? null : token.username} />
                                })}
                            </div> : ""}

                            {!this.state.loading ? this.state.tokens.map((tmp) => {
                                let token: Token = tmp;
                                return <div className="col s12 hide-on-med-and-up"><TwoFACard
                                    handleDelete={this.deleteToken} id={`twofacard-${token.id}-small`} tokenId={token.id} token={token.token} image={token.provider.image == "" ? null : token.provider.image} service={token.provider.name} account={token.username == "" ? null : token.username} /></div>
                            }) : ""}
                        </div>
                    </div>
                </main>
                <div className="fixed-action-btn">
                    <a id="add-code-button" className="btn-floating btn-large white waves-effect waves-dark modal-trigger" href="#add-code">
                        <i className="large material-icons black-text">add</i>
                    </a>
                </div>

                <div id="add-code" className="modal">
                    <form onSubmit={this.addSite.bind(this)}>
                        <div className="modal-content">
                            <div className="row">
                                <h4 className="col s12">Add new 2FA site</h4>
                                <p className="col s12">Currently if you want to add any site to your account, you can only do it on your PC with the code and not with the QR code.</p>
                                <p className="col s12">
                                    A 2FA code looks like this: <b>1ab2 3c4d e56f g7h4</b>
                                </p>
                                <div className="col s12 input-field">
                                    <input type="text" id="enteredCode" autoComplete={"off"} required={true} value={this.state.enteredCode} onChange={(e) => {
                                        this.setState({
                                            enteredCode: e.target.value
                                        })
                                    }} />
                                    <label htmlFor="enteredCode">Enter your 2FA code</label>
                                </div>
                                <div className="col s12 input-field">
                                    <input type="text" autoComplete={"off"} id="services-selector" required={true} className="autocomplete" value={this.state.service} onChange={(e) => {
                                        this.setState({
                                            service: e.target.value
                                        })
                                    }} />
                                    <label htmlFor="services-selector">Enter the service name</label>
                                </div>
                                <div className="col s12 input-field">
                                    <input type="text" autoComplete={"off"} id="username" value={this.state.username} onChange={(e) => {
                                        this.setState({
                                            username: e.target.value
                                        })
                                    }} />
                                    <label htmlFor="username">Enter this account's name (optional)</label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-flat waves-effect" disabled={this.state.enteredCode.length == 0}><i className="material-icons left">add</i> Add</button>
                            <a href="#!" className="modal-close waves-effect btn-flat"><i className="material-icons left">close</i> Close</a>
                        </div>
                    </form>
                </div>

                <div className="tap-target black white-text" data-target="add-code-button">
                    <div className="tap-target-content">
                        <h5>Add your first account</h5>
                        <p>Click on the <b>+</b> button to start adding your 2FA secured account now!</p>
                    </div>
                </div>
            </>
        );
    }

    async componentDidMount() {
        const M = require('materialize-css');

        M.Modal.init(document.querySelectorAll('.modal'), {});

        let result = await fetch(`${API_URL}/tokens/get`, {
            method: "POST",
            body: JSON.stringify({
                token: localStorage.getItem("loginToken")
            })
        });

        let tokens = await result.json();
        if (tokens['error']) {
            M.toast({ html: tokens['errorMessage'], classes: "error" });
        } else {
            this.setState({
                tokens: tokens['data']['tokens']
            });

            if (tokens['data']['tokens'].length == 0) { //&& !localStorage.getItem("dismissed-fd")){
                M.TapTarget.init(document.querySelectorAll('.tap-target'), {
                    onClose: function () {
                        localStorage.setItem("dismissed-fd", "true");
                    }
                })[0].open();
            }
        }

        this.setState({
            loading: false
        });

        let providersData = await fetch(`${API_URL}/providers/get`, {
            method: "POST",
            body: JSON.stringify({
                token: localStorage.getItem("loginToken")
            })
        });

        let providers = await providersData.json();
        let autoCompleteData = {};
        if (providers['error']) {
            M.toast({ html: providers['errorMessage'], classes: "error" });
        } else {
            providers['data']['providers'].forEach((provider) => {
                autoCompleteData[provider['name']] = provider['image'];
            });
        }

        M.Autocomplete.init(document.querySelectorAll('.autocomplete'), {
            data: autoCompleteData,
            onAutocomplete: (e) => {
                this.setState({
                    service: e
                });
            }
        });
    }
}