import React from 'react';
import { API_URL, LoginToken, User } from "../../../modules/api";
import Router from "next/router";

export default class Page extends React.Component<{
	id: string,
	token: string
}> {
	static async getInitialProps({ query }) {
		const id = query['id'];
		const token = query['token'];
		return { id, token };
	}

	render() {
		return (
			<>
				<div className="container">
					<div className="row">
						<div className="col s12">
							<div className="card hoverable">
								<div className="card-content">
									<div className="card-title">
										Email confirmation in progres...
									</div>
									<p>	
										Please wait while we try to redirect you!
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		)
	}

	async componentDidMount() {
		const M = require('materialize-css');

		let resp = await fetch(`${API_URL}/user/processEmail`, {
			method: "POST",
			body: JSON.stringify({
				id: parseInt(this.props.id),
				token: this.props.token
			})
		});

		let data:{
			error: boolean,
			errorMessage?: string,
			message?: string,
			data?: {
				type: string,
				loginToken: LoginToken,
				user: User
			}
		} = await resp.json();

		if ("errorMessage" in data) {
			M.toast({
				html: data['errorMessage'],
				classes: "error"
			});
		} else if("data" in data) {
			switch(data.data.type){
				case "login": {
					localStorage.setItem("loginToken", data.data.loginToken.token);
					break;
				}
				case "register": {
					localStorage.setItem("loginToken", data.data.loginToken.token);
					break;
				}
				case "update": {
					localStorage.setItem("loginToken", data.data.loginToken.token);
					break;
				}
			}
		}

		if(data.message){
			M.toast({
				html: data.message
			});
		}

		Router.push("/");
	}
}