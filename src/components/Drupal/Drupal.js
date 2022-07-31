import JSZip from "jszip"
import Php from "../Php/Php.js"
import React from "react";
import index from "./index.php"
import styles from './Drupal.module.css'

export default class Drupal extends Php {

  // Invoked after a component is mounted (inserted into the tree).
  async componentDidMount() {
    this.loadDrupalFiles();
  }

  // Invoked immediately after updating occurs.
  componentDidUpdate(prevProps, prevState) {
    if (prevState.ready != this.state.ready) {
    }
  }

  // Load Drupal files from ZIP.
  async loadDrupalFiles() {
    var zip = new JSZip();
    // GET request using fetch with set headers
    const headers = { 'Content-Type': 'application/zip', 'Encoding': 'binary' }
    fetch('_next/static/build/drupal-8.9.20.zip', { headers })
      .then(response => response.blob())
      .then(function(data) {
        zip.loadAsync(data)
          .then(function (zip) {
            return zip.file("drupal-8.9.20/README.txt").async("string");
          })
          .then(function (text) {console.log(text);})
        }
      )
      .catch(error => console.log(error));
  }

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
