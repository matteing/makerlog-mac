import "../assets/css/App.css";
import React, { Component } from "react";
import { inject, observer, Provider } from "mobx-react";
import Onboarding from "../views/Onboarding";
import { config as storeConfig } from "~/stores";

// https://gitlab.com/makerlog/makedeck/-/blob/master/src/layouts/App.js

@inject("auth")
@observer
class App extends React.Component {
  render() {
    if (!this.props.auth.isLoggedIn) {
      return <Onboarding />;
    }

    return (
      <div>
        <h1>Hello, Electron!</h1>
        <p>
          I hope you enjoy using basic-electron-react-boilerplate to start your
          dev off right!
        </p>
      </div>
    );
  }
}

function AppContainer(props) {
  return (
    <Provider {...storeConfig.stores}>
      <App />
    </Provider>
  );
}

export default AppContainer;
