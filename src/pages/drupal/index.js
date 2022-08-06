import dynamic from "next/dynamic";

const Drupal = dynamic(() => import("../../components/Drupal/Drupal"), {
  ssr: false,
});

export default function Home() {
  return <Drupal />;
}