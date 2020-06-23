import 'isomorphic-fetch';
import * as React from 'react';
import App from 'next/app';
import Head from 'next/head';
import nprogress from 'nprogress';
import Router from 'next/router';
import DarkMode from '../components/DarkMode';

import '../public/css/materialize.min.css';
import '../public/css/modern.min.css';
import '../public/css/nprogress.css';
import '../public/css/style.css';
import '../public/css/dark-mode.css';

export default class extends App<{
	pageProps,
	Component
}> {
	render(){
		return(
			<>
				<Head>
					<title>
						Lockify
					</title>

					<meta charSet="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0"/>

					<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

					<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js" defer></script>
				</Head>
				<DarkMode />
				<this.props.Component {...this.props.pageProps} />
			</>
		)
	}

	componentDidMount(){
		Router.events.on('routeChangeStart', nprogress.start);
		Router.events.on('routeChangeComplete', nprogress.done);
	}
}