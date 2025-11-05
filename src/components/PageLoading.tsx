import React from "react";
import Loading from "./Loading";

export default function PageLoading() {
  return (
    <div className="h-screen w-screen fixed inset-0 z-[999] flex flex-col items-center justify-center">
      <Loading />
    </div>
  );
}
