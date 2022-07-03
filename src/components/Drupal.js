import React from "react";
import styles from './Drupal.module.css'

export default class Drupal extends React.Component {
  constructor(props) {
    super(props);
    this.php = {};
    this.state = {error: false, output: '', pending: false, ready: false};
  }

  // Invoked after a component is mounted (inserted into the tree).
  async componentDidMount() {
    if (!this.state.ready) {
      try {
        const PhpWeb = (await require('php-wasm/PhpWeb')).PhpWeb;
        this.php = new PhpWeb;
        this.php.addEventListener('error', (event) => {
          console.log(event);
        });
        this.php.addEventListener('output', (event) => {
          console.log(event);
          this.setState({output: event.detail[0]});
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
    // console.log('componentDidUpdate');
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
      this.php.run('<?php php_info();')
        .then(retVal => {
          this.setState({pending: true});
      });
    }
  }

  render() {
    if (this.state.ready) {
      this.php_hello();
      return (
        <div className={styles.drupal} dangerouslySetInnerHTML={{__html: this.state.output}} />
      )
    }
    else {
      return (
        <div className={styles.drupal}>
          Loading...
        </div>
      )
    }
  }
}
