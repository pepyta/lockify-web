import React from 'react';
import { User } from '../../../modules/api';
import Section from '../Section';

export default class AdvancedTokenEncryption extends React.Component<{
    user: User,
    onSectionMounted: (id: string) => void,
    id: string,
    position: number
}, {
    passphrase: string,
    user: User
}> {
    state = {
        passphrase: "",
        user: this.props.user
    };

    async removeEncryption(e){
        e.preventDefault();
        const M = require('materialize-css');

        try {
            let resp = await this.props.user.decryptTokens(this.state.passphrase);
            M.toast({
                html: resp.message
            });
            localStorage.setItem("loginToken", resp.loginToken);
            let user = this.state.user;
            user.extraEncryption = false;
            this.setState({
                user
            });
        } catch(e){
            M.toast({
                html: e,
                classes: "error"
            });
        }
    }
    
    async enableEncryption(e){
        e.preventDefault();
        const M = require('materialize-css');

        try {
            let resp = await this.props.user.encryptTokens(this.state.passphrase);
            
            localStorage.setItem("loginToken", resp.loginToken);
            localStorage.setItem("encryptionToken", this.state.passphrase);
            M.toast({
                html: resp.message
            });

            let user = this.state.user;
            user.extraEncryption = true;
            this.setState({
                user
            });
        } catch(e){
            M.toast({
                html: e,
                classes: "error"
            });
        }
    }

    render() {
        return (
            <Section
                position={this.props.position}
                id="token-encryption"
                title="Advanced token encryption"
                onSubmit={this.state.user.extraEncryption ?
                    this.removeEncryption.bind(this) :
                    this.enableEncryption.bind(this)}
                    action={<button className="btn waves-effect black white-text waves-effect">{!this.state.user.extraEncryption ? "Setup" : "Remove"}</button>}>
                <div style={{
                    marginBottom: 20
                }} className="card red lighten-4">
                    
                    {!this.state.user.extraEncryption ? 
                    <div className="card-content">
                        If you enable this function and forget your passphrase that you enter here you will not be able to access your current tokens anymore! By clicking on submit you acknowledge that <b>we will not be able to recover your tokens after you forgot your key</b>.
                    </div>:""}
                </div>
                <div className="row" style={{
                    marginBottom: 0
                }}>
                    <div className="col s12 input-field" style={{
                    marginBottom: 0
                }}>
                        <input type="text" onChange={(e) => {
                            this.setState({
                                passphrase: e.target.value
                            });
                        }} value={this.state.passphrase} id="passphrase" />
                        <label htmlFor="passphrase">Enter your encryption key!</label>
                    </div>
                </div>
            </Section>);
    }

    componentDidMount(){
        this.props.onSectionMounted(this.props.id);
    }
}