import { redirect } from "next/navigation";

export default function CommercialShowRoomPage({ searchParams }) {
  const id = searchParams?.id;
  redirect(id ? `/post-property?id=${id}` : "/post-property");
}
