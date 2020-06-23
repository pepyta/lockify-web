import React from 'react';
import { User, Token } from '../../modules/api';
import NoTokenCard from './NoTokenCard';
import LoadingWrapper from './LoadingWrapper';
import HybernatedCard from './HybernatedCard';

export default class TokenWrapper extends React.Component<{
    user: User
}, {
    tokens: Array<Token>,
    loading: boolean
}> {
    state = {
        tokens: [],
        loading: true
    };

    onDecryption(id: number){
        const M = require('materialize-css');

        this.setState({
            tokens: this.state.tokens.filter(tmp => tmp.id !== id)
        });
        
        document.querySelectorAll("input").forEach((item) => {
            item.value = "";
        });
        M.updateTextFields();
    }

    render(){
        return(
            <main>
                <div className="container">
                    <div className="row">
                        {this.state.loading ? <LoadingWrapper /> : this.state.tokens.length == 0 ? <NoTokenCard /> : this.state.tokens.map((token) => {
                            return <HybernatedCard user={this.props.user} onDecryption={this.onDecryption.bind(this)} id={token.id} service={token.provider.name} username={token.username} />
                        })}
                    </div>
                </div>
            </main>
        );
    }

    async componentDidMount(){
        this.setState({
            tokens: await this.props.user.getHybernatedTokens(),
            loading: false
        });
    }
}