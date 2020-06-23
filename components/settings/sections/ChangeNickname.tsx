import React from 'react';
import Section from '../Section';
import SaveButton from '../SaveButton';
import { User } from '../../../modules/api';

export default class ChangeNickname extends React.Component<{
    user: User,
    onSectionMounted: (id: string) => void,
    id: string,
    position: number
}, {
    nickname: string
}> {
    state = {
        nickname: ""
    };

    async changeNickname(e) {
        e.preventDefault();

        const M = require('materialize-css');

        try {
            let resp = await this.props.user.updateData("name", this.state.nickname);
            
            if(resp.loginToken){
                localStorage.setItem("loginToken", resp.loginToken);
            }

            M.toast({
                html: resp.message
            });
        } catch (e) {
            M.toast({
                html: e.message,
                classes: "error"
            });
        }
    }
    render() {
        return (

            <Section
                position={this.props.position}
                id="change-nickname"
                title="Your nickname"
                action={<SaveButton disabled={this.props.user.name == this.state.nickname} />}
                onSubmit={this.changeNickname.bind(this)}>
                <p>
                    Prior to changing your account details we will send an email to your current email address with a confirmation link.
                    </p>
                <p>
                    <input type="text" id="nickname" value={this.state.nickname} onChange={(e) => {
                        this.setState({
                            nickname: e.target.value
                        })
                    }} />
                </p>
            </Section>
        );
    }

    componentDidMount() {
        this.setState({
            nickname: this.props.user.name
        });
        this.props.onSectionMounted(this.props.id);
    }
}