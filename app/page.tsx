import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import { createClient } from "@/prismicio";

export default async function Home() {
  const client = createClient();

  const page = await client.getByUID("page", "home");

  return <SliceZone slices={page.data.slices} components={components} />;
}
