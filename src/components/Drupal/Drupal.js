import JSZip from "jszip";
import Php from "../Php/Php.js";
import React from "react";
import index from "./index.php";
import styles from "./Drupal.module.css";

export default class Drupal extends Php {
  constructor(props) {
    super(props);
    this.coreFiles = [];
    this.state = { ready: false, timeLoadZip: 0.0 };
  }

  // Invoked after a component is mounted (inserted into the tree).
  async componentDidMount() {
    this.loadDrupalFiles();
  }

  // Invoked immediately after updating occurs.
  componentDidUpdate(prevProps, prevState) {
    if (prevState.ready != this.state.ready) {
      if (this.state.ready) {
        // console.log("files: ", this.coreFiles);
      }
    }
    if (prevState.timeLoadZip != this.state.timeLoadZip) {
      console.log(`[Debug]: timeLoadZip: ${this.state.timeLoadZip}ms`);
    }
  }

  // Load Drupal files from ZIP.
  async loadDrupalFiles() {
    var timeLoadZipStart = new Date();
    var zip = new JSZip();
    // GET request using fetch with set headers
    const headers = { "Content-Type": "application/zip", Encoding: "binary" };
    let result = fetch("_next/static/build/drupal-8.9.20.zip", { headers })
      // Fetch a zip file.
      .then((response) => response.blob())
      // Load a zip file.
      .then(function (data) {
        var filesList = {};
        zip
          .loadAsync(data)
          .then(function (zip) {
            // Create an object with list of file entries.
            zip.forEach(function (relativePath, zipEntry) {
              let path = zipEntry.name.substring(
                zipEntry.name.indexOf("/") + 1
              );
              filesList[path] = zipEntry;
            });
            return filesList;
          })
          .then((retVal) => {
            console.log(`[Debug]: Loaded files: ${Object.keys(retVal).length}`);
          })
          .catch((error) => console.log(error));
        return filesList;
      })
      .then((retVal) => {
        // Returns list of loaded files.
        this.coreFiles = retVal;
        this.setState({ ready: true });
        this.setState({ timeLoadZip: new Date() - timeLoadZipStart });
      })
      .catch((error) => console.log(error));
  }

  php_index() {
    if (!this.state.pending && this.state.output == "") {
      this.php
        .run(index)
        .then((retVal) => {
          this.setState({ pending: true });
        })
        .catch((e) => console.error(e.message));
    }
  }

  render() {
    return (
      <div className={styles.drupal}>
        <Php />
      </div>
    );
  }
}
