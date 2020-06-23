import React, { createContext } from 'react';
import { User } from '../modules/api';
export const UserContext = createContext({});

export default class UserContextProvider extends React.Component<{}, {
    user: User
}> {
    state = {
        user: null
    };

    render(){
        return (
            <UserContext.Provider value={{
                user: this.state.user
             }}>
                 adsdasdsa
                {this.props.children}
            </UserContext.Provider>
        );
    }

    componentDidMount(){
        this.setState({
            user: new User(localStorage.getItem("loginToken"), localStorage.getItem("encryptionToken"))
        });
    }
}