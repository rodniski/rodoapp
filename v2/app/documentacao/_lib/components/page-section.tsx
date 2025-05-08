import React, { ReactNode } from "react";

const PageSection = ({
  id,
  title,
  content,
}: {
  id: string;
  title: string;
  content: ReactNode;
}) => (
  <div className="py-6 flex flex-col gap-4">
    <div className="w-full">
      <h2 id={id} className="font-medium text-2xl font-sans">
        {title}
      </h2>
      <div className="mt-3 font-mono">{content}</div> 
    </div>
  </div>
);

export default PageSection;
