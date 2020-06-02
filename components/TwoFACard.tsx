import React from 'react';

export default class TwoFACard extends React.Component<{
    id: string,
    image: string | null,
    tokenId: number,
    service: string,
    account: string | null,
    token: string,
    handleDelete: any
}, {
    timerPercentage: number,
    token: string,
    progressBar: number,
    progressBarTime: number
}> {
    state = {
        timerPercentage: 0,
        token: "######",
        progressBar: 0,
        progressBarTime: 0
    }

    render() {
        return (
            <div className="card hoverable">
                <div className="card-content">
                    <div className="row valign-wrapper" style={{ marginBottom: 0 }}>
                        {this.props.image === null ? "" : <div className="col s4 center-align">
                            <img src={this.props.image} className="responsive-img z-depth-1" style={{ borderRadius: 7, width: 100 }} />
                        </div>}
                        <div className={`col ${this.props.image === null ? "s12" : "s8"}`}>
                            <div className="card-title">
                                {this.state.token}
                                <span className="right">
                                    <a className="dropdown-trigger black-text" href="#" data-target={`dropdown-twofacard-${this.props.id}`}><i className="material-icons">more_vert</i></a>
                                </span>
                                <ul id={`dropdown-twofacard-${this.props.id}`} className='dropdown-content'>
                                    <li><a href={`#modal-delete-twofacard-${this.props.id}`} className="modal-trigger">Remove</a></li>
                                </ul>
                            </div>
                            <div id={`modal-delete-twofacard-${this.props.id}`} className="modal">
                                <div className="modal-content">
                                    <h4>Are you sure?</h4>
                                    <p>If you delete your two-factor-authentication key, then <b>you might be not able to access your current profile</b>. Please first remove the authenticator from that service.</p>
                                </div>
                                <div className="modal-footer">
                                    <a href="#!" className="modal-close waves-effect btn-flat waves-dark" style={{
                                        marginRight: 10
                                    }}>Close</a>
                                    <a href="#!" onClick={async () => {
                                        let M = require('materialize-css');
                                        let data = await fetch(`/api/tokens/delete`, {
                                            method: "POST",
                                            body: JSON.stringify({
                                                loginToken: localStorage.getItem("loginToken"),
                                                token: this.props.tokenId
                                            })
                                        });

                                        let result = await data.json();

                                        if(result['error']){
                                            M.toast({ html: result['errorMessage'], classes: "error" });
                                        } else {
                                            this.props.handleDelete(this.props.tokenId);
                                            M.toast({ html: result['message'] });
                                        }
                                    }} className="modal-close waves-effect btn red white-text waves-light">Remove</a>
                                </div>
                            </div>

                            <div className="row" style={{ marginBottom: 0 }}>
                                <div className="col s12 no-padding">
                                    <div className="col s4">
                                        Service:
                                    </div>
                                    <div className="col s8 truncate">
                                        <b>
                                            {this.props.service}
                                        </b>
                                    </div>
                                </div>
                                {this.props.account == null ? "" :
                                    <div className="col s12 no-padding">
                                        <div className="col s4">
                                            Account:
                                    </div>
                                        <div className="col s8 truncate">
                                            <b>
                                                {this.props.account}
                                            </b>
                                        </div>
                                    </div>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="progress">
                    {/*
                        <style jsx>{`
                            .progress .determinate#${`progress-bar-2fa-${this.props.id}`} {
                                animation: mymove-${this.props.id} ${this.state.progressBarTime}s infinite linear;
                            }
                        
                            @keyframes mymove-${this.props.id} {
                                from {width:${this.state.progressBar}%;}
                                to {width: 0;}
                            }
                        `}</style>
                     */}
                    <div id={`progress-bar-2fa-${this.props.id}`} className="determinate" style={{ width: `${this.state.timerPercentage}%` }}></div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        let twoFactor = require('node-2fa');
        let M = require('materialize-css');

        M.Dropdown.init(document.querySelectorAll(`.dropdown-trigger`), {});
        M.Modal.init(document.querySelectorAll('.modal'), {});
        
        let previousSec = 30;
        setInterval(() => {
            let d = new Date().getSeconds() + new Date().getMilliseconds() / 1000;
            if (d > 30) {
                d -= 30;
            }

            if (previousSec < d) {
                this.setState({
                    token: twoFactor.generateToken(this.props.token)['token']
                });
            }

            previousSec = d;

            this.setState({
                timerPercentage: (30 - d) / 30 * 100
            });
        }, 300);
        /*
        // might look like spaghetti code, but it's the most efficient
        let d = new Date();
        let time = d.getSeconds() + d.getMilliseconds() / 1000; // [0; 30]
        if (time > 30) {
            time -= 30;
        }

        let generateToken = (token: string) => {
            console.log("Updated token for " + this.props.service + ":" + this.props.account);
            this.setState({
                token: twoFactor.generateToken(token)['token']
            });
        }
        generateToken(this.props.token);

        let timer = (secPassed: number) => {
            setTimeout(() => {
                generateToken(this.props.token);
                this.setState({
                    progressBar: 100,
                    progressBarTime: 30
                });
                timer(0);
            }, (30 - secPassed) * 1000);
        }
        timer(time);

        let percentage = time;
        percentage = (30 - percentage) / 3 * 10;

        this.setState({
            progressBar: percentage,
            progressBarTime: 30 - time
        });*/

    }
}