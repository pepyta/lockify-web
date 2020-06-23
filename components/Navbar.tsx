import React from 'react';
import Link from 'next/link';
import { User } from '../modules/api';

export default class Navbar extends React.Component<{ user: User }> {
    render() {
        return (
            <>
                <nav className="white black-text hide-on-large-only">
                    <div className="container">
                        <div className="nav-wrapper">
                            <a href="#!" className="brand-logo">Lockify</a>
                            <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                        </div>
                    </div>
                </nav>
                <ul className="sidenav sidenav-fixed no-autoinit" id="mobile-demo">
                    <li>
                        <div className="user-view" style={{ padding: 16 }}>
                            <div className="row valign-wrapper" style={{ marginBottom: 0 }}>
                                {this.props.user.image && this.props.user.image !== "" ? <div className="col s4">
                                    <img src={`data:image/png;base64, ${this.props.user.image}`} className="responsive-img circle z-depth-1" />
                                </div> : ""}
                                <div className={`col ${this.props.user.image && this.props.user.image !== "" ? "s8" : "s12"}`}>
                                    <a href="#name">
                                        <span className="name"><b>{this.props.user.name}</b></span>
                                    </a>
                                    <a href="#email">
                                        <span className="email">{this.props.user.email}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li><Link href="/"><a href="#" className="waves-effect sidenav-close"><i className="material-icons">home</i> Home</a></Link></li>
                    <li><Link href="settings"><a href="#" className="waves-effect sidenav-close"><i className="material-icons">settings</i> Settings</a></Link></li>
                    <li className="divider"></li>
                    <li><Link href="hybernated"><a href="#" className="waves-effect sidenav-close"><i className="material-icons">ac_unit</i> Hybernated tokens</a></Link></li>
                    <li className="divider"></li>
                    <li><Link href="logout"><a href="#" className="waves-effect sidenav-close"><i className="material-icons">exit_to_app</i> Logout</a></Link></li>

                </ul>

            </>
        );
    }

    componentDidMount() {
        const M = require('materialize-css');
        M.Sidenav.init(document.querySelectorAll('.sidenav'), {});
    }
}