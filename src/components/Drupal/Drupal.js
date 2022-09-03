import Php from "../Php/Php.js";
import React from "react";
import indexFile from "./index.php";
import settingsFile from "./settings.php";
import styles from "./Drupal.module.css";
import { unzipSync } from "fflate";

export default class Drupal extends React.Component {
  coreFiles = [];
  corePrefix = "drupal-8.9.20/";
  state = {
    phpReady: false,
    phpRef: null,
    ready: false,
    timeLoadZip: 0.0,
  };

  constructor(props) {
    super(props);
  }

  // Invoked after a component is mounted (inserted into the tree).
  async componentDidMount() {
    this.loadDrupalFiles();
  }

  // Invoked immediately after updating occurs.
  componentDidUpdate(prevProps, prevState) {
    if (prevState.phpReady !== this.state.phpReady && this.state.phpReady) {
      console.debug("Php is ready.");
    }
    if (prevState.ready != this.state.ready && this.state.ready) {
      console.debug(`Loaded files: ${Object.keys(this.coreFiles).length}`);
    }
    if (prevState.timeLoadZip != this.state.timeLoadZip) {
      console.debug(`timeLoadZip: ${this.state.timeLoadZip}ms`);
    }
  }

  // Load Drupal files from ZIP.
  async loadDrupalFiles() {
    var timeLoadZipStart = new Date();
    // GET request using fetch with set headers.
    let data = fetch("_next/static/build/drupal-7.91.zip", {
      "Content-Type": "application/zip",
      Encoding: "binary",
    })
      // Fetch a zip file.
      .then((response) => response.blob())
      // Load a zip file.
      .then((blob) =>
        blob.arrayBuffer().then((arr) => {
          // Create an object with list of file entries.
          var filesList = {};
          // Loads a zip data and read list of files.
          filesList = unzipSync(new Uint8Array(arr), {
            filter(file) {
              // Filter out unwanted files.
              if (!file.name.endsWith(".txt")) {
                return true;
              }
              return false;
            },
          });
          this.coreFiles = filesList;
          this.corePrefix = Object.keys(filesList)[0];
          this.setState({ ready: true });
          this.setState({ timeLoadZip: new Date() - timeLoadZipStart });
        })
      )
      .catch((error) => console.log(error));
  }

  readFile = (path, cwd, _this) => {
    if (this.state.ready) {
      //path = path[0] == "/" ? path.substring(1) : path;
      let pathKey = this.corePrefix + path;
      if (this.coreFiles[pathKey]) {
        console.debug("readFile (true)", path, cwd);
        return this.coreFiles[pathKey];
      } else {
        console.debug("readFile (false)", path, cwd);
      }
    }
    return null;
  };

  setPhpReady = () => this.setState({ phpReady: true });
  setPhpRef = (ref) => this.setState({ phpRef: ref });

  render() {
    return (
      <div className={styles.drupal}>
        <Php
          indexFile={indexFile}
          readFile={this.readFile}
          setReady={this.setPhpReady}
          setRef={this.setPhpRef}
          settingsFile={settingsFile}
        />
      </div>
    );
  }
}
