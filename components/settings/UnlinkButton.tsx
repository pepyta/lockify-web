import React from 'react';
import { API_URL } from '../../modules/api';

export default class UnlinkButton extends React.Component<{
    id: string,
    disabledBecausePassword: boolean,
    ssoId: number,
    onSuccessful: () => void
}> {
    render(){
        return(<button
            id={this.props.id}
            className={`btn btn-large right red white-text waves-effect waves-light`}
            disabled={this.props.disabledBecausePassword}
            onClick={async (e) => {
                e.preventDefault();
                const M = require('materialize-css');
                
                if(this.props.disabledBecausePassword){
                    return;
                }

                let resp = await fetch(`${API_URL}/user/unlink`, {
                    method: "POST",
                    body: JSON.stringify({
                        id: this.props.ssoId,
                        loginToken: localStorage.getItem("loginToken")
                    })
                });

                let data = await resp.json();

                if(data['error']){
                    M.toast({ html: data['errorMessage'], classes: "error" });
                } else {
                    M.toast({ html: data['message'], classes: "successful" });
                    this.props.onSuccessful();
                }
            }}><i className="material-icons left">close</i>Unlink</button>);
    }
}