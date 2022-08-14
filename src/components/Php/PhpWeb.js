import { PhpBase } from "php-wasm/PhpBase";

const PhpBinary = require("./php-web");

export class PhpWeb extends PhpBase {
  constructor(args = {}) {
    super(PhpBinary, args);
  }
}

if (window && document) {
  var args = {
    INITIAL_MEMORY: 1073741824,
    arguments: [],
    expectedDataFileDownloads: 1,
    getPreloadedPackage: function (pkg_name, pkg_size) {
      return true;
    },
    noExitRuntime: false,
    onAbort: function (what) {
      console.error(what);
    },
    onRuntimeInitialized: function () {
      console.log("onRuntimeInitialized");
    },
    onFileMissing: function (path, node) {
      console.log(path, node);
    },
    preInit: [], // List of functions to call.
    preRun: [], // List of functions to call.
    preloadedImages: {},
    print: console.log.bind(console),
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
  const php = new PhpWeb(args);

  const runScriptTag = (element) => {
    const src = element.getAttribute("src");

    if (src) {
      fetch(src)
        .then((r) => r.text())
        .then((r) => {
          php.run(r).then((exit) => console.log(exit));
        });

      return;
    }

    const inlineCode = element.innerText.trim();

    if (inlineCode) {
      php.run(inlineCode);
    }
  };

  php.addEventListener("ready", () => {
    const phpSelector = 'script[type="text/php"]';

    const htmlNode = document.body.parentElement;
    const observer = new MutationObserver((mutations, observer) => {
      for (const mutation of mutations) {
        for (const addedNode of mutation.addedNodes) {
          if (!addedNode.matches || !addedNode.matches(phpSelector)) {
            continue;
          }

          runScriptTag(addedNode);
        }
      }
    });

    observer.observe(htmlNode, { childList: true, subtree: true });

    const phpNodes = document.querySelectorAll(phpSelector);

    for (const phpNode of phpNodes) {
      const code = phpNode.innerText.trim();

      runScriptTag(phpNode);
    }
  });
}
