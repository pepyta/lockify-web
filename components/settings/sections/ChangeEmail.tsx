import React from 'react';
import Section from '../Section';
import SaveButton from '../SaveButton';
import { User } from '../../../modules/api';

export default class ChangeEmail extends React.Component<{
    user: User,
    onSectionMounted: (id: string) => void,
    id: string,
    position: number
}, {
    email: string
}> {
    state = {
        email: ""
    };

    async changeEmail(e) {
        e.preventDefault();

        const M = require('materialize-css');

        try {
            let resp = await this.props.user.updateData("email", this.state.email);
            
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
                id="change-email"
                title="Your email"
                action={<SaveButton disabled={this.props.user.email == this.state.email} />}
                onSubmit={this.changeEmail.bind(this)}>
                    <p>
                        Prior to changing your account details we will send an email to your current email address with a confirmation link.
                    </p>
                    <p>
                        <input type="text" id="email" value={this.state.email} onChange={(e) => {
                            this.setState({
                                email: e.target.value
                            })
                        }} />
                    </p>
            </Section>
        );
    }

    componentDidMount(){
        this.setState({
            email: this.props.user.email
        });
        this.props.onSectionMounted(this.props.id);
    }
}