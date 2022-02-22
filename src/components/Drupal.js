import React from "react";
import styles from './Drupal.module.css'

export default class Drupal extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidUpdate(prevProps, prevState) {
	}

	async componentDidMount() {
		const PhpWeb = (await import('php-wasm/PhpWeb')).PhpWeb;
		const php = new PhpWeb;
	}

	render() {
		return (
			<div className={styles.drupal}>
				Drupal will be here!
			</div>
		)
	}
}
