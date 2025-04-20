"use client";
import Link from "next/link";
import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {};

const UnauthorizedContent = (props: Props) => {
  const params = useSearchParams();
  const message = params.get("message");
  console.log(message);

  return (
    <div className="p-4 text-center h-screen w-screen flex justify-center items-center flex-col">
      <h1 className="text-3xl md:text-6xl">Unauthorized access!</h1>
      <Link href="/" className="mt-4 bg-primary p-2">
        Back to home
      </Link>
      {message && <p className="text-gray-600 pt-5 ">{message}</p>}
    </div>
  );
};

const Unauthorized = (props: Props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnauthorizedContent {...props} />
    </Suspense>
  );
};

export default Unauthorized;
