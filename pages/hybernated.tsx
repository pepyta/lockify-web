import React from 'react';
import Navbar from '../components/Navbar';
import { User } from '../modules/api';
import Router from 'next/router';
import TokenWrapper from '../components/hybernated/TokenWrapper';

export default class HybernatedTokens extends React.Component<{}, {
    user: User | null
}> {
    state = {
        user: null
    };

    render(){
        return(
            <> 
                {this.state.user ? <>
                    <Navbar user={this.state.user} />
                    <TokenWrapper user={this.state.user} />
                </> : ""}
            </>
        );
    }

    async componentDidMount(){
        let loginToken = localStorage.getItem("loginToken");

        if(loginToken === null){
            Router.push("/login");
            return;
        }
        
        this.setState({
            user: new User(loginToken, localStorage.getItem("encryptionToken"))
        });
    }
}