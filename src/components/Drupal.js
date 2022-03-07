import React from "react";
import styles from './Drupal.module.css'

export default class Drupal extends React.Component {
  constructor(props) {
    super(props);
  }

  // Invoked after a component is mounted (inserted into the tree).
  async componentDidMount() {
    const PhpWeb = (await require('php-wasm/PhpWeb')).PhpWeb;
    this.php = new PhpWeb;
  }

  // Invoked immediately after updating occurs.
  componentDidUpdate(prevProps, prevState) {
  }

  php_test() {
    //php_test = this.php.run('<?php echo "Hello, world!";');
    //return php_test.retVal;
  }

  render() {
    return (
      <div className={styles.drupal}>
        Drupal will be here!
        {this.php_test()}
      </div>
    )
  }
}
