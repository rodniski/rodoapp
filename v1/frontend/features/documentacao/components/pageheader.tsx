// features/shared/components/documentacao/Header.tsx
import React from "react";
import { Badge } from "ui";

const PageHeader = ({
  title,
  date,
  description,
}: {
  title: string;
  date: string;
  description: React.ReactNode; 
}) => (
  <div id="header" className="flex flex-col gap-2 pb-6">
    <div className="flex gap-2 items-start justify-start">
      <Badge variant={"secondary"} className="h-fit w-fit">
        TI
      </Badge>
      <p>{date}</p>
    </div>
    <h1 className="py-3">{title}</h1>
    <span className="font-mono">{description}</span>
  </div>
);

export default PageHeader;
