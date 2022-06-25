import React from "react";
import styles from './Drupal.module.css'

export default class Drupal extends React.Component {
  constructor(props) {
    super(props);
    this.php = {};
    this.state = {ready: false};
  }

  // Invoked after a component is mounted (inserted into the tree).
  async componentDidMount() {
    const PhpWeb = (await require('php-wasm/PhpWeb')).PhpWeb;
    this.php = new PhpWeb;
    console.log(this.php);
    this.setState({ready: true})
  }

  // Invoked immediately after updating occurs.
  componentDidUpdate(prevProps, prevState) {
  }

  php_test() {
    return this.php.run('<?php echo "Hello, world!";').retVal;
  }

  render() {
    if (this.state.ready) {
      const hello = this.php_test();
      console.log(hello);
      console.log('php_test: ', this.php_test());
      return (
          <div className={styles.drupal}>
            Drupal will be here!
            {hello}
            {this.php_test()}
          </div>
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
