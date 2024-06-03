"use client";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data, status } = useSession();
  if (status === "loading") return <h1> loading... please wait</h1>;
  if (status === "authenticated") {
    return (
      <div>
        <h1> hi {data?.user?.name}</h1>
      </div>
    );
  }
  return <h1>This is home page</h1>;
}
