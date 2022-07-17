//require("./php-web.js")
import React from "react";

export default class Php extends React.Component {

  constructor(props) {
    super(props);
    this.php = {};
    this.state = {error: '', output: '', pending: false, ready: false};
  }

  render() {
    if (this.state.ready) {
      return (
        <div>
          Hello World!
        </div>
      )
    }
    else {
      return (
        <div>
          Loading...
        </div>
      )
    }
  }
}
