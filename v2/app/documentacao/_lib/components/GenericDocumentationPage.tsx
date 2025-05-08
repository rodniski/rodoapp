import React, { ReactNode } from 'react';
import { Button, ScrollArea } from "ui";
import Image from "next/image";
import PageHeader from './page-header';
import PageSection from './page-section';

export interface ContentItem {
  type: 'text' | 'image' | 'video' | 'button' | 'iframe'; 
  content: string | ReactNode;
  props?: Record<string, any>;
}

export interface Section {
  id: string;
  title: string;
  content: string | ReactNode;
  additionalContent?: ContentItem[];
}

export interface GenericDocumentationPageProps {
  title: string;
  group: string;
  date: string;
  description: React.ReactNode;
  headerButton?: {
    text: string;
    onClick: () => void;
  };
  sections: Section[];
  footerButton?: {
    text: string;
    onClick: () => void;
  };
}

const GenericDocumentationPage: React.FC<GenericDocumentationPageProps> = ({
  title,
  group,
  date,
  description,
  headerButton,
  sections,
  footerButton,
}) => {
  return (
    <ScrollArea className="h-full w-full flex flex-col items-center justify-center">
      <div className="max-w-4xl h-full w-full">
        <PageHeader
          title={title}
          group={group}
          date={date}
          description={description}
        />
        
        {headerButton && (
          <Button
            variant="outline"
            className="mb-3"
            onClick={headerButton.onClick}
          >
            {headerButton.text}
          </Button>
        )}

        {sections.map((section) => (
          <React.Fragment key={section.id}>
            <PageSection
              id={section.id}
              title={section.title}
              content={section.content}
            />
            {section.additionalContent && section.additionalContent.map((item, index) => {
              switch (item.type) {
                case 'image':
                  return (
                    <div
                      key={index}
                      className="flex justify-center items-center my-3"
                    >
                      <Image
                        src={item.content as string}
                        alt={item.props?.alt || ""}
                        width={item.props?.width || 400}
                        height={item.props?.height || 300}
                        className={item.props?.className || ""}
                      />
                    </div>
                  );
                case 'video':
                  return (
                    <div
                      key={index}
                      className="flex justify-center items-center my-3"
                    >
                      <video
                        src={item.content as string}
                        className={item.props?.className || "w-[700px] h-auto"}
                        controls
                        muted
                      />
                    </div>
                  );
                case 'iframe': // Novo caso para o tipo iframe
                  return (
                    <div
                      key={index}
                      className="flex justify-center items-center my-3"
                    >
                      <iframe
                        src={item.content as string}
                        className={item.props?.className || "w-full h-[400px]"}
                        allow={item.props?.allow || "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}
                        allowFullScreen={item.props?.allowFullScreen || true}
                      />
                    </div>
                  );
                case 'button':
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className={item.props?.className || "my-3"}
                      onClick={item.props?.onClick}
                    >
                      {item.content}
                    </Button>
                  );
                default:
                  return null;
              }
            })}
          </React.Fragment>
        ))}

        {footerButton && (
          <Button
            variant="outline"
            className="mb-10"
            onClick={footerButton.onClick}
          >
            {footerButton.text}
          </Button>
        )}
      </div>
    </ScrollArea>
  );
};

export default GenericDocumentationPage;
