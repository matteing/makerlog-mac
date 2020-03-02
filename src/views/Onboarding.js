import React, { Component } from "react";
import { Link, Router } from "@reach/router";
import {
  createMemorySource,
  createHistory,
  LocationProvider
} from "@reach/router";

let source = createMemorySource("/");
let history = createHistory(source);

class Login extends Component {
  state = {
    username: "",
    password: ""
  };

  render() {
    return (
      <div className="flex flex-row min-h-screen p-10 ">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="mb-4">
            <h1 className="text-2xl mb-2">
              Login with <span className="text-primary">Makerlog</span>
            </h1>
          </div>
          <div className="mb-2">
            <input type="text" placeholder="Username" />
          </div>
          <div className="mb-6">
            <input type="password" placeholder="Password" />
          </div>
          <div>
            <Link to="login">
              <button className="font-semibold text-lg rounded-full text-black block p-2 pl-8 pr-8 bg-secondary">
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

class Splash extends Component {
  render() {
    return (
      <div className="flex flex-row min-h-screen p-10 brand-background">
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-4">
            <h1 className="text-4xl mb-2">
              Welcome to <span className="text-primary">Makerlog for Mac</span>
            </h1>
            <h3 className="text-gray-600">
              The Mac app that keeps you productive... together.
            </h3>
          </div>
          <div>
            <Link to="login">
              <button className="font-semibold text-xl rounded-full text-white block p-2 pl-8 pr-8 bg-primary">
                Get started
              </button>
            </Link>
          </div>
        </div>
        <div className="flex justify-center items-center flex-1">
          <img
            className="h-64 w-64 animated zoomIn fast"
            src="https://github.com/matteing/makerlog-menubar/blob/master/Icon.png?raw=true"
          />
        </div>
      </div>
    );
  }
}

export default class Onboarding extends Component {
  render() {
    return (
      <LocationProvider history={history}>
        <Router>
          <Splash path="/" />
          <Login path="login" />
        </Router>
      </LocationProvider>
    );
  }
}
