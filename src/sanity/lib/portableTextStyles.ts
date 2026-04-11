import { createElement, type ReactNode } from "react";

type BlockStyleComponentProps = {
  children?: ReactNode;
};

const blockquoteStyleComponent = ({ children }: BlockStyleComponentProps) =>
  createElement(
    "blockquote",
    {
      style: {
        borderLeft: "3px solid var(--card-border-color, #d4d4d8)",
        margin: "0.5rem 0",
        paddingLeft: "0.75rem",
        fontStyle: "italic",
      },
    },
    children,
  );

export const portableTextStyles = [
  { title: "Normal", value: "normal" },
  { title: "H1", value: "h1" },
  { title: "H2", value: "h2" },
  { title: "H3", value: "h3" },
  { title: "H4", value: "h4" },
  {
    title: "Quote",
    value: "blockquote",
    component: blockquoteStyleComponent,
  },
];
