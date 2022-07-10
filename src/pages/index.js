import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import dynamic from "next/dynamic";
import Script from "next/script";

const Drupal = dynamic(() => import("../components/Drupal/Drupal"), {ssr: false});

export default function Home() {
  return (
    <Drupal/>
  )
}
