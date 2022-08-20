import JSZip from "jszip";
import Php from "../Php/Php.js";
import React from "react";
import index from "./index.php";
import styles from "./Drupal.module.css";

export default class Drupal extends React.Component {
  coreFiles = [];
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
      // console.debug("Php1: ", this.state.phpRef);
      // console.debug("Php2: ", this.state.phpRef["current"]);
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
    var zip = new JSZip();
    // GET request using fetch with set headers.
    let data = fetch("_next/static/build/drupal-8.9.20.zip", {
      "Content-Type": "application/zip",
      Encoding: "binary",
    })
      // Fetch a zip file.
      .then((response) => response.blob())
      // Load a zip file.
      .then(function (data) {
        return data;
      })
      .catch((error) => console.log(error));
    // Loads a zip data and read list of files.
    zip
      .loadAsync(await data)
      .then(function (zip) {
        // Create an object with list of file entries.
        var filesList = {};
        zip.forEach(function (relativePath, zipEntry) {
          let path = zipEntry.name.substring(zipEntry.name.indexOf("/") + 1);
          filesList[path] = zipEntry;
        });
        // Returns list of loaded files.
        return filesList;
      })
      .then((filesList) => {
        this.coreFiles = filesList;
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

  readFile = (path, cwd, _this) => {
    path = path[0] == "/" ? path.substring(1) : path;
    if (this.state.ready && this.coreFiles[path]) {
      let dataResult = null;
      let dataReady = false;
      let promise = (async () => {
        this.coreFiles[path]
          .async("string")
          .then(function (data) {
            console.log("data", data);
            dataReady = true;
            dataResult = data;
            return data;
          })
          .catch((error) => {
            dataReady = true;
            dataResult = "";
            return "";
          });
      })();
      console.log("promise", dataReady, promise);
    }
    return "";
  };

  setPhpReady = () => this.setState({ phpReady: true });
  setPhpRef = (ref) => this.setState({ phpRef: ref });

  render() {
    return (
      <div className={styles.drupal}>
        <Php
          readFile={this.readFile}
          setReady={this.setPhpReady}
          setRef={this.setPhpRef}
        />
      </div>
    );
  }
}
