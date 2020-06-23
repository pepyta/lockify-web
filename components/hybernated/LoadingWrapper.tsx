import React from 'react';
import TwoFALoader from '../index/TwoFALoader';

export default class LoadingWrapper extends React.Component {
    render(){
        return(
            <><div className="col s12 m6"><TwoFALoader /><TwoFALoader /><TwoFALoader /></div><div className="col s12 m6"><TwoFALoader /><TwoFALoader /><TwoFALoader /></div></>
        );
    }
}