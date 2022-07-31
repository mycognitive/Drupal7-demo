import PhpWeb from "./PhpWeb.js"
import React from "react";
import styles from "./Php.module.css"

export default class Php extends React.Component {

  constructor(props) {
    super(props);
    this.php = {};
    this.state = {error: '', output: '', pending: false, ready: false};
  }

  // Invoked after a component is mounted (inserted into the tree).
  async componentDidMount() {
    if (!this.state.ready) {
      try {
        const PhpWeb = (await require('./PhpWeb')).PhpWeb;
        this.php = new PhpWeb;
        this.php.addEventListener('error', (event) => {
          console.error(event.detail[0]);
          this.setState({error: this.state.error + event.detail[0]});
        });
        this.php.addEventListener('output', (event) => {
          console.log(event);
          this.setState({output: this.state.output + event.detail[0]});
          this.setState({pending: false});
          // console.log(event.detail[0]);
        });
        this.php.addEventListener('ready', () => {
          this.setState({ready: true});
        });
      }
      catch (e) {
        console.log(e);
      }
    }
  }

  // Invoked immediately after updating occurs.
  componentDidUpdate(prevProps, prevState) {
    if (prevState.ready != this.state.ready) {
      // console.log('componentDidUpdate');
    }
  }

  php_files() {
    if (!this.state.pending && this.state.output == '') {
      this.php.run('<?php'
        + '$it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator("."));'
        + 'foreach ($it as $name => $entry) { echo $name . "<br/>"; }'
        )
        .then(retVal => {
          this.setState({pending: true});
      });
    }
  }

  php_hello() {
    if (!this.state.pending && this.state.output == '') {
      this.php.run('<?php echo "Hello, world!";')
        .then(retVal => {
          this.setState({pending: true});
      });
    }
  }

  php_info() {
    if (!this.state.pending && this.state.output == '') {
      this.php.run('<?php phpinfo();')
        .then(retVal => {
          this.setState({pending: true});
      });
    }
  }

  render() {
    if (this.state.ready) {
      this.php_info();
      return (
        <iframe
          className={styles.php}
          sandbox="allow-same-origin allow-scripts allow-forms"
          srcDoc={this.state.output} />
      )
    }
    else {
      return (
        <div className={styles.php}>
          Loading...
        </div>
      )
    }
  }
}
