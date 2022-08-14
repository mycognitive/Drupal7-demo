import React from "react";
import styles from "./Php.module.css";
import { PhpBase } from "php-wasm/PhpBase";
const PhpBinary = require("./php-web");

export class PhpWeb extends PhpBase {
  files = [];
  //phpWebRef = React.createRef();
  constructor(args = {}) {
    super(PhpBinary, args);
  }
  updateFiles(files_new) {
    this.files = this.files.concat(files_new);
  }
}

export default class Php extends React.Component {
  php = {};
  phpRef = React.createRef();
  phpWebArgs = {
    INITIAL_MEMORY: 1073741824,
    arguments: [],
    expectedDataFileDownloads: 1,
    getPreloadedPackage: function (pkg_name, pkg_size) {
      return false;
    },
    noExitRuntime: false,
    noInitialRun: false,
    onAbort: this.onAbort,
    onExit: this.onExit,
    onRuntimeInitialized: function () {
      console.debug("onRuntimeInitialized");
    },
    onFileOpen: function (path, fs) {
      var createDataFile = this["FS_createDataFile"];
      var data = this.readFile(path, fs.cwd());
      var node = createDataFile(fs.cwd(), path, data, true, true, true);
      console.debug(path, node);
      return node;
    },
    preInit: [this.onPreInit],
    preRun: [this.onPreRun],
    preloadPlugins: {
      handleDrupal: function (byteArray, fullname, finish, f) {
        console.debug("preloadPlugins", fullname);
      },
    },
    preloadedImages: {},
    // print: console.log.bind(console),
    printErr: console.warn.bind(console),
    readFile: this.readFile,
    quit: function (status, toThrow) {
      console.error(status);
      throw toThrow;
    },
    setStatus: function (status) {
      console.debug(status);
    },
    thisProgram: "NextJS",
    // "locateFile": function(file, size) { return "WASM"; },
    // "wasmBinary": "foo",
  };
  state = {
    error: "",
    output: "",
    pending: false,
    ready: false,
  };

  constructor(props) {
    super(props);
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
          this.php.updateFiles(["foo"]);
          console.debug("ready", this.php);
        });
        this.php.addEventListener("custom", (event) => {
          console.debug("custom", event.detail);
        });
      } catch (e) {
        console.error(e);
      }
    }
  }

  // Invoked immediately after updating occurs.
  componentDidUpdate(prevProps, prevState) {
    if (prevState.ready != this.state.ready) {
      if (this.state.ready) {
        // this.php_info();
        this.php_require();
        this.props.setReady();
        this.props.setRef(this.phpRef);
      }
    }
  }

  onAbort(what) {
    console.error(what);
  }

  onExit(status) {
    console.debug("exit", status);
  }

  onPreInit() {
    console.debug("preInit");
  }

  onPreRun() {
    console.debug("preRun");
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

  readFile(path, cwd) {
    console.debug("readFile", path, cwd);
    return path;
  }

  render() {
    return this.state.ready ? (
      <iframe
        className={styles.php}
        ref={this.phpRef}
        sandbox="allow-same-origin allow-scripts allow-forms"
        srcDoc={this.state.output}
      />
    ) : (
      <div className={styles.php} ref={this.phpRef}>
        Loading...
      </div>
    );
  }
}
