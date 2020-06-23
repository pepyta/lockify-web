import React from 'react';

export default class NoTokenCard extends React.Component {
    render() {
        return (
            <div className="valign-wrapper" style={{
                minHeight: "calc(100vh - 96px)"
            }}>
                <div className="row col s12 no-padding">

                    <div className="row col s12 no-padding">
                        <div className="col s2 m3 l4">

                        </div>
                        <div className="col s8 m6 l4">
                            <img src="img/hybernated/empty.svg" className="responsive-img" />
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
                            You don't have any token hybernated, which is pretty good!
                    </div>
                    </div>
                </div>
            </div>
        )
    }
}