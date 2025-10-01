import Link from "next/link";
import React from "react";

interface BreadcrumbLink {
  title?: string;
  link?: string;
}

interface BreadcrumbProps {
  pageTitle: string;
  links?: BreadcrumbLink[];
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle, links }) => {
  return (
    <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-3 mb-4 p-2">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 capitalize">
        {pageTitle}
      </h2>

      <nav className="md:text-right">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <li>
            <Link href="/" className="inline-flex items-center gap-1.5">
              Home
              <svg
                className="stroke-current"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>
          {links?.map((link: BreadcrumbLink, index: number) => (
            <li key={index}>
              <Link
                href={link?.link || ""}
                className="inline-flex items-center gap-1.5 capitalize"
              >
                {link?.title || ""}
                <svg
                  className="stroke-current"
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </li>
          ))}
          <li className="text-gray-800 dark:text-white/90 capitalize">
            {pageTitle}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
