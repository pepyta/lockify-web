import React from 'react';

export default class NoTokenCard extends React.Component {
    render(){
        return(
            <div className="valign-wrapper" style={{
                minHeight: "calc(100vh - 96px)"
            }}>
                <div className="row col s12 no-padding">
                    
                <div className="row col s12 no-padding">
                    <div className="col s2 m3 l4">

                    </div>
                    <div className="col s8 m6 l4">
                        <img src="img/index/empty.svg" className="responsive-img" /> 
                    </div>
                    <div className="col s2 m3 l4">
                        
                    </div>
                </div>
                <div className="row col s12 no-padding" style={{
                    marginBottom: 0
                }}>
                    <div className="col s12 center-align" style={{
                        marginBottom: 20
                    }}>    
                        You don't have any tokens yet. How about adding some?
                    </div>
                    <div className="col s12 center-align">
                        <a href="#add-code" className="btn-flat waves-effect waves-dark modal-trigger" style={{
                            fontWeight: "bold"
                        }}>Add new token</a>
                    </div>
                </div>
                </div>
            </div>
        )
    }
}