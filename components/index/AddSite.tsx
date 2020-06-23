import React from 'react';
import { User, Token } from '../../modules/api';

export default class AddSite extends React.Component<{
    user: User,
    addToken: ((token: Token) => void)
}, {
    enteredCode: string,
    service: string,
    username: string
}> {
    state = {
        enteredCode: "",
        service: "",
        username: ""
    };

    async addSite(e) {
        e.preventDefault();

        const M = require('materialize-css');
        M.Modal.getInstance(document.querySelector('#add-code')).close();

        try {
            let token = await this.props.user.addToken(this.state.service, this.state.enteredCode.toLowerCase().split(" ").join(""), this.state.username);
            console.log(token);
            M.toast({
                html: "You've successfully added this token to your list!"
            });
            this.props.addToken(token);
        } catch (e) {
            M.toast({
                html: e,
                classes: "error"
            });
        }
    }

    async componentDidMount(){
        const M = require('materialize-css');
        M.Modal.init(document.querySelectorAll('.modal#add-code'), {});
        
        try {
            let providers = await this.props.user.getProviders();
        
            let autoComplete = {};
            providers.forEach((provider) => {
                autoComplete[provider.name] = provider.image;
            });

            M.Autocomplete.init(document.querySelectorAll('.autocomplete'), {
                data: autoComplete,
                onAutocomplete: (e) => {
                    this.setState({
                        service: e
                    });
                }
            });
        } catch(e){
            M.toast({ html: e, classes: "error" });
        }
    }

    render(){
        return(
            <>
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
            </>);
    }
}