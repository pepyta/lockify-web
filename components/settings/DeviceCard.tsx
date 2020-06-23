import React from 'react';

export default class DeviceCard extends React.Component<{
    id: number,
    device: string,
    createdAt: Date,
    type: "desktop" | "mobile" 
}> {
    render(){
        return(
            <div className="col s12" id={`device-card-${this.props.id}`}>
                <div className="card hoverable">
                    <div className="card-content">
                        <div className="row valign-wrapper" style={{ marginBottom: 0 }}>
                            <div className="col s4 center-align">
                                <i className="material-icons medium">{this.props.type == "desktop" ? "desktop_windows" : "stay_primary_portrait"}</i>
                            </div>
                            <div className="col s8">
                                <div className="card-title">{this.props.device}</div>
                                Logged in at {this.props.createdAt.toLocaleDateString()} {this.props.createdAt.toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}