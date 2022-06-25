import Head from 'next/head'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import styles from '../styles/Home.module.css'
import Script from "next/script";

const Drupal = dynamic(() => import("../components/Drupal"), {ssr: false});

export default function Home() {
  return (
    <Drupal/>
  )
}
