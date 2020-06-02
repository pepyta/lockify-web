import React from 'react';
import Link from 'next/link';
import Router from 'next/router';

export default class Navbar extends React.Component {
    state = {
        nickname: "",
        email: ""
    }
    render() {
        return (
            <>
                <nav className="white black-text hide-on-large-only">
                    <div className="container">
                        <div className="nav-wrapper">
                            <a href="#!" className="brand-logo">Lockify</a>
                            <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                            <ul className="right hide-on-med-and-down">
                                <li><a href="sass.html">Sass</a></li>
                                <li><a href="badges.html">Components</a></li>
                                <li><a href="collapsible.html">Javascript</a></li>
                                <li><a href="mobile.html">Mobile</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <ul className="sidenav sidenav-fixed no-autoinit" id="mobile-demo">
                    <li>
                        <div className="user-view" style={{ padding: 16 }}>
                            <div className="background black">
                            </div>
                            <div className="row valign-wrapper" style={{ marginBottom: 0 }}>
                                <div className="col s12">
                                    <a href="#name">
                                        <span className="white-text name"><b>{this.state.nickname}</b></span>
                                    </a>
                                    <a href="#email">
                                        <span className="white-text email">{this.state.email}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li><Link href="/"><a href="#" className="waves-effect sidenav-close"><i className="material-icons">home</i> Home</a></Link></li>
                    <li><Link href="settings"><a href="#" className="waves-effect sidenav-close"><i className="material-icons">settings</i> Settings</a></Link></li>
                    <li className="divider"></li>
                    <li><Link href="logout"><a href="#" className="waves-effect sidenav-close"><i className="material-icons">exit_to_app</i> Logout</a></Link></li>
                
                </ul>
            </>
        );
    }

    componentDidMount() {
        const M = require('materialize-css');

        M.Sidenav.init(document.querySelectorAll('.sidenav'), {});

        let next = document.getElementById('__next');

        document.querySelectorAll('.sidenav-overlay, .drag-target').forEach((element) => {
            next?.appendChild(element);
        });

        this.setState({
            nickname: localStorage.getItem("name"),
            email: localStorage.getItem("email")
        });

        if(!localStorage.getItem("loginToken")){
            Router.push("/");
            M.toast({html: "Please login first"});
        }
    }
}