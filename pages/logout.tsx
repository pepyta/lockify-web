import React from 'react';
import Router from 'next/router';
import { API_URL } from '../modules/globals';
import App from '../components/App';

export default class LogoutPage extends React.Component {
    render(){
        return(
            <>
                <App />
                <div style={{
                    height: "100vh"
                }} className="container valign-wrapper">
                    <div className="row" style={{ width: "100%" }}>
                        <div className="col hide-on-small-only m4"></div>
                        <div className="col s12 m4">
                            <div className="card hoverable" style={{ width: "100%" }}>
                                <div className="card-content">
                                    <div className="card-title">
                                        Logging out...
                                    </div>
                                                                        
                                    <div style={{ 
                                        marginTop: '1rem',
                                        marginBottom: 0
                                     }} className="progress">
                                        <div className="indeterminate"></div>
                                    </div>
        
                                </div>
                            </div>
                        </div>
                        <div className="col hide-on-small-only m4"></div>
                    </div>
                </div>
            </>
        );
    }
    
    async componentDidMount(){
        const M = require('materialize-css');
        let result = await fetch(`${API_URL}/user/logout`, {
            method: "POST",
            body: JSON.stringify({
                token: localStorage.getItem("loginToken")
            })
        });

        let data = await result.json();
        if(data['error']){
            M.toast({ html: data['errorMessage'], classes: "error" });
        } else {
            M.toast({ html: data['message'] });
        }
        localStorage.clear();
        
        Router.push("/login");
    }
}