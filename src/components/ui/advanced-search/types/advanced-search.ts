import { HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

export type AdvancedSearchProps = {
  value: string;
  onValueChange: (value: string) => void;
  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "value">;

export type AdvancedSearchInputProps = object &
  InputHTMLAttributes<HTMLInputElement>;

export type AdvancedSearchEmptyMessageProps = object &
  HTMLAttributes<HTMLDivElement>;
