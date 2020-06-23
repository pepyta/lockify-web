import React from 'react';
import { User } from '../../modules/api';
import copy from 'copy-to-clipboard';
import { motion } from 'framer-motion';

export default class TwoFACard extends React.Component<{
    id: string,
    position: number,
    image: string | null,
    tokenId: number,
    service: string,
    account: string | null,
    token: string,
    handleDelete: any,
    restore: any
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
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                    delay: this.props.position * 0.1
                }}>
                <div className="card hoverable">
                    <div className="card-content">
                        <div className="row valign-wrapper" style={{ marginBottom: 0 }}>
                            {this.props.image === null ? "" : <div className="col s4 center-align">
                                <img src={this.props.image} className="responsive-img z-depth-1" style={{ borderRadius: 7, width: 100 }} />
                            </div>}
                            <div className={`col ${this.props.image === null ? "s12" : "s8"}`}>
                                <div className="card-title">
                                    {this.state.token}
                                    <a href="#" className="black-text" onClick={(e) => {
                                        e.preventDefault();
                                        const M = require('materialize-css');
                                        M.toast({
                                            html: "The key has been copied to clipboard"
                                        });
                                        copy(this.state.token);
                                    }}>
                                        <i className="material-icons left">file_copy</i></a>
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
                                            let loginToken = localStorage.getItem("loginToken");

                                            if (loginToken === null) {
                                                return;
                                            }

                                            let user = new User(loginToken, localStorage.getItem("encryptionToken"));
                                            let token = this.props.handleDelete(this.props.tokenId);
                                            try {
                                                user.deleteToken(this.props.tokenId).then(() => {
                                                    M.toast({
                                                        html: "You've successfully removed this authenticator.",
                                                    });
                                                });
                                            } catch (e) {
                                                this.props.restore(token);
                                                M.toast({
                                                    html: e,
                                                    classes: "error"
                                                });
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
                        <div id={`progress-bar-2fa-${this.props.id}`} className="determinate" style={{ width: `${this.state.timerPercentage}%` }}></div>
                    </div>
                </div>
            </motion.div>
        );
    }

    componentDidMount() {
        let twoFactor = require('node-2fa');
        let M = require('materialize-css');

        M.Dropdown.init(document.querySelectorAll(`.dropdown-trigger`), {});
        M.Modal.init(document.querySelectorAll('.modal'), {});
        console.log(this.props.token);
        let previousSec = 30;
        setInterval(() => {
            let d = new Date().getSeconds() + new Date().getMilliseconds() / 1000;
            if (d > 30) {
                d -= 30;
            }

            if (previousSec > d) {
                this.setState({
                    token: twoFactor.generateToken(this.props.token+"")['token']
                });
            }

            previousSec = d;

            this.setState({
                timerPercentage: (30 - d) / 30 * 100
            });
        }, 300);
    }
}