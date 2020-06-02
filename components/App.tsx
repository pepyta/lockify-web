import React from 'react';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';

export default class App extends React.Component {
    render(){
        return (
            <Head>
                <title>
                    Lockify
                </title>

                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
                <link rel="stylesheet" href="https://unpkg.com/materialize-stepper@3.1.0/dist/css/mstepper.min.css" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <link href="../../css/materialize.min.css" rel="stylesheet" />
                <link href="../../css/style.css" rel="stylesheet" />
                <link href="../../css/modern.min.css" rel="stylesheet" />
                <link href="../../css/nprogress.css" rel="stylesheet" />

                <script type="text/javascript" src="../../js/materialize.min.js"></script>
                <script type="text/javascript" src="https://unpkg.com/materialize-stepper@3.1.0/dist/js/mstepper.min.js"></script>
            </Head>
        );
    }

    componentDidMount(){
        Router.events.on('routeChangeStart', NProgress.start);
        Router.events.on('routeChangeComplete', NProgress.done);
    }
}