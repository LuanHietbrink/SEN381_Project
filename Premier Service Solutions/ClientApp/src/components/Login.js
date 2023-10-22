import React, { Component } from 'react';
import "./Login.css";

export class Login extends Component {
    render() {
        return (
                <div className="login-frame-desktop">
                    <div className="overlap-wrapper">
                        <div className="overlap">
                            <div className="overlap-group">
                                <div className="ellipse" />
                                <div className="text-wrapper">Premier Service Solutions</div>
                            </div>
                            <div className="div">
                                <div className="rectangle" />
                                <div className="text-wrapper-2">Login</div>
                            </div>
                            <div className="div-wrapper">
                                <div className="text-wrapper-3">Password:</div>
                            </div>
                            <div className="overlap-group-2">
                                <div className="text-wrapper-4">Username:</div>
                            </div>
                            <div className="text-wrapper-5">Forgot Password?</div>
                            <img className="line" alt="Line" src="line-24.svg" />
                            <p className="p">One call away from making your day</p>
                        </div>
                    </div>
                </div>
            );
    }
    
};
