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
    //onPreInit: this.onPreInit,
    //onPreRun: this.onPreRun,
    onRuntimeInitialized: function () {
      console.debug("onRuntimeInitialized");
    },
    onFileOpen: function (path, fs) {
      var createDataFile = this["FS_createDataFile"];
      var cwd = fs.cwd();
      var path_rel = path.replace(cwd + "/", "");
      var data = this.readFile(path_rel, cwd, this.this);
      var node = undefined;
      if (data != null) {
        fs.mkdirTree(path.substring(0, path.lastIndexOf("/")));
        node = createDataFile(cwd, path_rel, data, true, true, true);
      }
      console.debug(
        "onFileOpen",
        path_rel,
        cwd,
        node,
        data ? data.length : null
      );
      return node;
    },
    preInit: [this.onPreInit],
    preRun: [(mod) => this.onPreRun(mod)],
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
    stderr: this.readStdErrChar,
    this: this,
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
        if (this.props.indexFile != undefined) {
          this.php_run(this.props.indexFile);
        } else {
          this.php_info();
        }
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

  onPreRun(module) {
    // Define initial directory structure.
    module["FS_createPath"]("/home/web_user", "modules", true, true);
    module["FS_createPath"]("/home/web_user", "sites", true, true);
    module["FS_createPath"]("/home/web_user/modules", "system", true, true);
    module["FS_createPath"]("/home/web_user/sites", "default", true, true);
    if (this.props.settingsFile != undefined) {
      module["FS_createDataFile"](
        "/home/web_user/sites/default",
        "settings.php",
        this.props.settingsFile,
        true,
        false,
        false
      );
    }
    //module["FS_createPreloadedFile"]("/home/web_user/sites/default", "settings.php", "file://sites/default/settings.php", true, false, true, true, true, false, true);
  }

  php_hello() {
    if (!this.state.pending && this.state.output == "") {
      this.php.run('<?php echo "Hello, world!";').then((retVal) => {
        this.setState({ pending: true });
      });
    }
  }

  php_run(data) {
    if (!this.state.pending && this.state.output == "") {
      this.php
        .run(data)
        .then((retVal) => {
          this.setState({ pending: true });
        })
        .catch((e) => console.error(e.message));
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
      this.php.run('<?php require("index.php");').then((retVal) => {
        this.setState({ pending: true });
      });
    }
  }

  readFile(path, cwd, _this) {
    return _this.props.readFile(path, cwd, _this);
  }

  readStdErrChar(chr) {
    this.state.error += String.fromCharCode(char);
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
