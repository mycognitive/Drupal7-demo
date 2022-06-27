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
    try {
      const PhpWeb = (await require('php-wasm/PhpWeb')).PhpWeb;
      this.php = new PhpWeb;
      this.setState({ready: true});
    }
    catch (e) {
      console.log(e);
    }
  }

  // Invoked immediately after updating occurs.
  componentDidUpdate(prevProps, prevState) {
    console.log('componentDidUpdate');
  }

  php_test() {
    console.log(this.php.run('<?php echo "Hello, world!";').then(retVal => { console.log('retVal: ', retVal); }));
    //return this.php.run('<?php echo "Hello, world!";').then(retVal => { console.log('retVal: ', retVal); });
  }

  render() {
    if (this.state.ready) {
      console.log('Ready');
      const hello = this.php_test();
      return (
          <div className={styles.drupal}>
            Drupal will be here!
            {hello}
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
