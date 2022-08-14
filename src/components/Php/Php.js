import React from "react";
import styles from "./Php.module.css";
import { PhpBase } from "php-wasm/PhpBase";
const PhpBinary = require("./php-web");

export class PhpWeb extends PhpBase {
  constructor(args = {}) {
    super(PhpBinary, args);
  }
}

export default class Php extends React.Component {
  phpWebArgs = {
    INITIAL_MEMORY: 1073741824,
    arguments: [],
    expectedDataFileDownloads: 1,
    getPreloadedPackage: function (pkg_name, pkg_size) {
      return false;
    },
    noExitRuntime: false,
    onAbort: function (what) {
      console.error(what);
    },
    onRuntimeInitialized: function () {
      console.log("onRuntimeInitialized");
    },
    onFileOpen: function (path, fs) {
      var node = this["FS_createDataFile"](
        fs.cwd(),
        path,
        "",
        true,
        true,
        true
      );
      console.log(path, node);
      return node;
    },
    preInit: [], // List of functions to call.
    preRun: [], // List of functions to call.
    preloadPlugins: {
      handleDrupal: function (byteArray, fullname, finish, f) {
        console.log("preloadPlugins", fullname);
      },
    },
    preloadedImages: {},
    // print: console.log.bind(console),
    printErr: console.warn.bind(console),
    quit: function (status, toThrow) {
      console.error(status);
      throw toThrow;
    },
    setStatus: function (status) {
      console.log(status);
    },
    thisProgram: "NextJS",
    // "locateFile": function(file, size) { return "WASM"; },
    // "wasmBinary": "foo",
  };

  constructor(props) {
    super(props);
    this.php = {};
    this.state = { error: "", output: "", pending: false, ready: false };
  }

  // Invoked after a component is mounted (inserted into the tree).
  async componentDidMount() {
    if (!this.state.ready) {
      try {
        this.php = new PhpWeb(this.phpWebArgs);
        this.php.addEventListener("error", (event) => {
          console.error(event.detail[0]);
          this.setState({ error: this.state.error + event.detail[0] });
        });
        this.php.addEventListener("output", (event) => {
          // console.log(event);
          this.setState({ output: this.state.output + event.detail[0] });
          this.setState({ pending: false });
          // console.log(event.detail[0]);
        });
        this.php.addEventListener("ready", () => {
          this.setState({ ready: true });
        });
        this.php.addEventListener("custom", (event) => {
          console.log("custom", event.detail);
        });
      } catch (e) {
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
    if (!this.state.pending && this.state.output == "") {
      this.php
        .run(
          "<?php" +
            '$it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator("."));' +
            'foreach ($it as $name => $entry) { echo $name . "<br/>"; }'
        )
        .then((retVal) => {
          this.setState({ pending: true });
        });
    }
  }

  php_hello() {
    if (!this.state.pending && this.state.output == "") {
      this.php.run('<?php echo "Hello, world!";').then((retVal) => {
        this.setState({ pending: true });
      });
    }
  }

  php_info() {
    if (!this.state.pending && this.state.output == "") {
      this.php.run("<?php phpinfo();").then((retVal) => {
        this.setState({ pending: true });
      });
    }
  }

  php_require() {
    if (!this.state.pending && this.state.output == "") {
      this.php.run('<?php require("README.md");').then((retVal) => {
        this.setState({ pending: true });
      });
    }
  }

  render() {
    if (this.state.ready) {
      this.php_info();
      //this.php_require();
      return (
        <iframe
          className={styles.php}
          sandbox="allow-same-origin allow-scripts allow-forms"
          srcDoc={this.state.output}
        />
      );
    } else {
      return <div className={styles.php}>Loading...</div>;
    }
  }
}
