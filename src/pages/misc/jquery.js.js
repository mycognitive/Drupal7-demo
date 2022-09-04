import React from "react";
import dynamic from "next/dynamic";

const Drupal = dynamic(() => import("../../components/Drupal/Drupal"), {ssr: false});

export default class Misc extends React.Component {
  constructor(props) {
    super(props);
  }

  // Invoked after a component is mounted (inserted into the tree).
  async componentDidMount() {
  }

  render() {
    return (
      <div>
        <Drupal loadJsFile="misc/jquery.js" />
      </div>
    );
  }
}