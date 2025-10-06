"use client";
import Image from "next/image";
import React from "react";

export default function ComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[80vh] p-6 overflow-hidden relative z-10">
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="mx-auto w-full max-w-[600px] text-center">
          <h1 className="mb-3 font-bold text-brand-600 text-title-md dark:text-brand-500/90 xl:text-title-xl">
            Coming Soon
          </h1>

          <div className="flex justify-center gap-2 my-5">
            <div className="w-[250px] lg:w-[350px]">
              <Image
                src="/images/coming-soon/coming-soon.svg"
                alt="Coming Soon"
                width={350}
                height={100}
                className="w-full h-auto"
              />
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-9 dark:text-gray-400 mt-2 sm:text-lg sm:whitespace-nowrap">
            We’re building something exciting at{" "}
            <span className="font-semibold text-brand-600 dark:text-brand-500">
              Gravita Oasis Review. 
            </span>
            <br />
            Our new platform will be launching soon — stay tuned for <br />
            innovation, sustainability, and growth.
          </p>
        </div>
      </div>
    </div>
  );
}
