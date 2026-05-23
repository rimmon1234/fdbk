import React from "react";

type LinkifyTextProps = {
  text?: string | null;
  className?: string;
};

const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;

function normalizeUrl(value: string) {
  return value.startsWith("http") ? value : `https://${value}`;
}

export default function LinkifyText({ text, className }: LinkifyTextProps) {
  if (!text) return null;

  const parts = text.split(urlRegex).filter((part) => part !== undefined && part !== "");

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (urlRegex.test(part)) {
          const href = normalizeUrl(part);
          return (
            <a
              key={`${part}-${index}`}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              {part}
            </a>
          );
        }
        return <React.Fragment key={`text-${index}`}>{part}</React.Fragment>;
      })}
    </span>
  );
}
