import React from 'react';
import { User, Token } from '../../modules/api';
import TwoFALoader from './TwoFALoader';
import TwoFACard from './TwoFACard';
import NoTokenCard from './NoTokenCard';

export default class TokenWrapper extends React.Component<{
    user: User
}, {
    loading: boolean,
    tokens: Array<Token>,
    encryptionToken: string,
    disableButton: boolean,
    modalOpen: boolean,
    user: User
}> {
    state = {
        loading: true,
        tokens: [],
        encryptionToken: "",
        disableButton: false,
        modalOpen: false,
        user: this.props.user
    };

    deleteToken(id: number) {
        let items = this.state.tokens;
        this.setState({ tokens: items.filter((tmp) => tmp.id !== id) });
        return items.filter((tmp) => tmp.id == id)
    }

    restore(token: Token){
        this.setState({
            tokens: [token, ...this.state.tokens]
        })
    }

    async tryToLoadTokens(token: string){
        const M = require('materialize-css');
        if(token === null) return false;
        
        try {
            let resp = await this.props.user.verifyEncryptionToken(token);

            let tokens = await this.props.user.getTokens();

            this.setState({
                loading: false,
                tokens
            });

            M.toast({
                html: resp
            });

            localStorage.setItem("encryptionToken", token);
            
            this.setState({
                user: new User(this.props.user.loginToken, token)
            });

            return true;
        } catch(e) {
            M.toast({
                html: e.message,
                classes: "error"
            });
            return false;
        }
    }

    modalInstance;

    async componentDidMount(){
        const M = require('materialize-css');

        if(this.props.user.extraEncryption){
            let resp = await this.tryToLoadTokens(localStorage.getItem("encryptionToken"));
            if(!resp && !this.state.modalOpen){
                this.modalInstance = M.Modal.init(document.querySelectorAll('.modal#encryption-token-modal'), {
                    dismissible: false
                })[0];
                
                this.modalInstance.open();
    
                this.setState({
                    modalOpen: true
                });
            }
        } else {
            const load = async () => {
                try {
                    let tokens = await this.props.user.getTokens();

                    this.setState({
                        tokens,
                        loading: false
                    });
                } catch(e){
                    M.toast({
                        html: e.message,
                        classes: "error"
                    });

                    M.toast({
                        html: "We will try again in a few seconds..."
                    });

                    setTimeout(() => {
                        load();
                    }, 6000);
                }
            };

            load();
        }
    }

    async setEncryptionToken(e) {
        e.preventDefault();

        this.setState({
            disableButton: true
        });
        let resp = await this.tryToLoadTokens(this.state.encryptionToken);
        
        if(resp){
            this.modalInstance.close();
        } else {
            this.setState({
                disableButton: false
            });
        }
    }

    public async addToken(token: Token) {
        this.setState({
            tokens: [token, ...this.state.tokens]
        });
    }

    public async hybernate(e){
        e.preventDefault();
        const M = require('materialize-css');
        try {
            let resp = await this.state.user.hybernate();
            localStorage.setItem("loginToken", resp.loginToken.token);
            
            this.setState({
                loading: false,
                tokens: []
            });

            this.modalInstance.close();

            M.toast({
                html: resp.message
            });
        } catch(e){
            M.toast({
                html: e.message,
                classes: "error"
            });
        }
    }

    render() {
        return (
            <>
                <div id="encryption-token-modal" className="modal">
                    <div className="modal-content">
                        <div className="row" style={{
                            marginBottom: 0
                        }}>
                            <h4 className="col s12">Welcome back!</h4>
                            <p className="col s12">
                                Please enter your encryption key that you've previously provided to us. If you can't remember it now you can click on <b>Hybernate tokens</b> button and we will save it for later. After this you'll find this tokens in Hybernated tokens section, where you can dehybernate them as soon as you know the code.
                            </p>
                            <form onSubmit={this.setEncryptionToken.bind(this)}>

                                <div className="col s12 input-field">
                                    <input type="text" value={this.state.encryptionToken} onChange={(e) => {
                                        this.setState({
                                            encryptionToken: e.target.value
                                        });
                                    }} id="encryption-token-field" />
                                    <label htmlFor="encryption-token-field">Encryption key</label>
                                </div>
                                <div className="col s12 input-field">
                                    <button disabled={this.state.disableButton} style={{ marginRight: 20 }} className="btn waves-effect waves-light black white-text">
                                        Save
                                    </button>
                                    <button onClick={this.hybernate.bind(this)} className="btn-flat waves-effect waves-dark">
                                        Hybernate
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {this.state.loading ? <><div className="col s12 m6"><TwoFALoader /><TwoFALoader /><TwoFALoader /></div><div className="col s12 m6"><TwoFALoader /><TwoFALoader /><TwoFALoader /></div></> : ""}

                {!this.state.loading ? <div className="col hide-on-small-only m6">
                    {this.state.tokens.map((tmp, index) => {
                        if (index % 2 == 1) return;
                        let token: Token = tmp;
                        return <TwoFACard
                            restore={this.restore.bind(this)}
                            position={index}
                            handleDelete={this.deleteToken.bind(this)}
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
                            restore={this.restore.bind(this)}
                            position={index}
                            handleDelete={this.deleteToken.bind(this)} id={`twofacard-${token.id}`} tokenId={token.id} token={token.token} image={token.provider.image == "" ? null : token.provider.image} service={token.provider.name} account={token.username == "" ? null : token.username} />
                    })}
                </div> : ""}

                {!this.state.loading ? this.state.tokens.map((tmp, index) => {
                    let token: Token = tmp;
                    return <div className="col s12 hide-on-med-and-up"><TwoFACard
                        restore={this.restore.bind(this)}
                        position={index}
                        handleDelete={this.deleteToken.bind(this)} id={`twofacard-${token.id}-small`} tokenId={token.id} token={token.token} image={token.provider.image == "" ? null : token.provider.image} service={token.provider.name} account={token.username == "" ? null : token.username} /></div>
                }) : ""}
                {this.state.tokens.length == 0 && !this.state.loading ? <div className="col s12"><NoTokenCard /></div> : ""}
            </>
        );
    }
}