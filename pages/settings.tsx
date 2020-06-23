import React from 'react';
import Navbar from '../components/Navbar';
import { User } from '../modules/api';
import AdvancedTokenEncryption from '../components/settings/sections/AdvancedTokenEncryption';
import ActiveLogins from '../components/settings/sections/ActiveLogins';
import ExternalLogins from '../components/settings/sections/ExternalLogins';
import ChangeNickname from '../components/settings/sections/ChangeNickname';
import ChangeEmail from '../components/settings/sections/ChangeEmail';
import ChangeUsername from '../components/settings/sections/ChangeUsername';
import Router from 'next/router';
import TwoFactorAuthentication from '../components/settings/sections/TwoFactorAuthentication';
import ChangePassword from '../components/settings/sections/ChangePassword';
import VisualPrefences from '../components/settings/sections/VisualPrefences';

export default class SettingsPage extends React.Component<{}, {
    user: any
}> {

    sections = [
        {
            id: "visual-prefences",
            class: VisualPrefences,
            loaded: false
        },
        {
            id: "change-username",
            class: ChangeUsername,
            loaded: false
        },
        {
            id: "change-email",
            class: ChangeEmail,
            loaded: false,
        },
        {
            id: "change-nickname",
            class: ChangeNickname,
            loaded: false
        },
        {
            id: "change-password",
            class: ChangePassword,
            loaded: false
        },
        {
            id: "external-logins",
            class: ExternalLogins,
            loaded: false
        },
        {
            id: "2fa",
            class: TwoFactorAuthentication,
            loaded: false
        },
        {
            id: "advanced-token-encryption",
            class: AdvancedTokenEncryption,
            loaded: false
        },
        {
            id: "active-logins",
            class: ActiveLogins,
            loaded: false
        }
    ];

    state = {
        user: null,
    };

    onSectionMounted(id: string) {
        const M = require('materialize-css');

        console.log(this);
        this.sections.forEach((section) => {
            if (section.id == id) {
                section.loaded = true;
            }
        });

        let loaded = true;
        this.sections.forEach((section) => {
            if (!section.loaded) {
                loaded = false;
            }
        });

        if (loaded) {
            M.ScrollSpy.init(document.querySelectorAll('.scrollspy'), {});
        }
    }

    render() {
        if (this.state.user === null) {
            return (<div />);
        }

        return (
            <>
                <Navbar user={this.state.user} />
                <main>
                    <div className="container">
                        <div className="row">
                            <div className="col s12 m9">
                                {this.sections.map((section, index) => {
                                    return <section.class position={index} id={section.id} user={this.state.user} onSectionMounted={this.onSectionMounted.bind(this)} />
                                })}
                            </div>
                            <div className="col hide-on-small-only m3">
                                <div className="toc-wrapper pin-top pinned">
                                    <ul className="section table-of-contents">
                                        <li>
                                            <a href="#visual-prefences">Visual prefences</a>
                                        </li>
                                        <li>
                                            <a href="#change-username">Username</a>
                                        </li>
                                        <li>
                                            <a href="#change-email">Email</a>
                                        </li>
                                        <li>
                                            <a href="#change-nickname">Nickname</a>
                                        </li>
                                        <li>
                                            <a href="#change-password">Password</a>
                                        </li>
                                        <li>
                                            <a href="#ssos">External logins</a>
                                        </li>
                                        <li>
                                            <a href="#2fa">Two factor authentication</a>
                                        </li>
                                        <li>
                                            <a href="#token-encryption">Advanced token encryption</a>
                                        </li>
                                        <li>
                                            <a href="#active-logins">Active logins</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    componentDidMount() {
        const M = require('materialize-css');

        let loginToken = localStorage.getItem("loginToken");
        if (loginToken === null) {
            M.toast({
                html: "Please login first!",
                classes: "error"
            });
            Router.push("/auth");
            return;
        }

        let user = new User(loginToken, localStorage.getItem("encryptionToken"));
        this.setState({
            user
        });

        M.updateTextFields();
    }
}