// features/shared/components/documentacao/Section.tsx
import React from "react";

const PageSection = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => (
  <div className="py-6 flex flex-col gap-4">
    <div className="w-full">
      <h2 className="font-medium text-2xl font-sans">{title}</h2>
      <p className="font-mono mt-3">{content}</p>
    </div>
  </div>
);

export default PageSection;
