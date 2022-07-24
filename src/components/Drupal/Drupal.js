import Php from "../Php/Php.js"
import React from "react";
import index from "./index.php"
import styles from './Drupal.module.css'

export default class Drupal extends Php {

  php_index() {
    if (!this.state.pending && this.state.output == '') {
      this.php.run(index)
        .then(retVal => {
          this.setState({pending: true});
        })
        .catch(e => console.error(e.message));
    }
  }

  render() {
    return (
      <div className={styles.drupal}>
        <Php/>
      </div>
    )
  }
}
