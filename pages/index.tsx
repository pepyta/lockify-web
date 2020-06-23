import React from 'react';
import Navbar from '../components/Navbar';
import Router from 'next/router';
import { User, Token } from '../modules/api';
import AddSite from '../components/index/AddSite';
import TokenWrapper from '../components/index/TokenWrapper';
import PromptExtraEncryption from '../components/index/PromptExtraEncryption';

export default class IndexPage extends React.Component<{}, {
    user: User | null
}> {
    tokenWrapper;
    constructor(props) {
        super(props);
        console.log(props);
        this.tokenWrapper = React.createRef();
        console.log(this.context);
    }

    state = {
        enteredCode: "",
        service: "",
        username: "",
        tokens: [],
        loading: true,
        user: null
    };

    addToken(token: Token) {
        this.tokenWrapper.current.addToken(token);
    }

    render() {
        if (this.state.user === null) {
            return (<div />);
        }

        return (
            <>
                <Navbar user={this.state.user} />
                <main>
                    <div className="container">
                        <div className="row">
                            <TokenWrapper user={this.state.user} ref={this.tokenWrapper} />
                        </div>
                        <AddSite user={this.state.user} addToken={this.addToken.bind(this)} />
                        {!this.state.user.extraEncryption && !localStorage.getItem("dismissed-extra-encryption-modal") ? <PromptExtraEncryption user={this.state.user} /> : ""}
                    </div>
                </main>
            </>
        );
    }

    componentDidMount() {
        let loginToken = localStorage.getItem("loginToken");
        if (loginToken === null) {
            Router.push("/auth");
            return;
        }

        let user = new User(loginToken, localStorage.getItem("encryptionToken"));
        this.setState({
            user
        });
    }
}