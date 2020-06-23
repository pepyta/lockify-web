import React from 'react';
import Section from '../Section';
import SaveButton from '../SaveButton';
import { User } from '../../../modules/api';

export default class ChangeUsername extends React.Component<{
    user: User,
    onSectionMounted: (id: string) => void,
    id: string,
    position: number
}, {
    username: string
}> {
    state = {
        username: ""
    };

    async changeUsername(e) {
        e.preventDefault();

        const M = require('materialize-css');

        try {
            let resp = await this.props.user.updateData("username", this.state.username);
            
            if(resp.loginToken){
                localStorage.setItem("loginToken", resp.loginToken);
            }

            M.toast({
                html: resp.message
            });
        } catch (e) {
            M.toast({
                html: e,
                classes: "error"
            });
        }
    }
    render(){
        return(
            <Section
                position={this.props.position}
                id="change-username"
                title="Your username"
                action={<SaveButton disabled={this.state.username == this.props.user.username} />}
                onSubmit={this.changeUsername.bind(this)}>
                    <p>
                        Prior to changing your account details we will send an email to your current email address with a confirmation link.
                    </p>
                    <p>
                        <input type="text" id="username" value={this.state.username} onChange={(e) => {
                            this.setState({
                                username: e.target.value
                            })
                        }} />
                    </p>
            </Section>
        );
    }

    componentDidMount(){
        this.setState({
            username: this.props.user.username
        });
        this.props.onSectionMounted(this.props.id);
    }
}