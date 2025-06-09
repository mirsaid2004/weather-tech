import React, { HTMLAttributes, useMemo } from "react";

type LoopProps<T> = {
  list: Array<T> | undefined;
  component: (item: T, index: number, array: T[]) => React.ReactNode;
  withWrapper?: boolean;
  fallback?: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>;

function Loop<T>({
  list,
  component,
  withWrapper = true,
  fallback,
  ...rest
}: LoopProps<T>) {
  const renderList = useMemo(() => list?.map(component), [list, component]);
  const renderResult = renderList?.length ? renderList : fallback;
  return withWrapper ? <div {...rest}>{renderResult}</div> : renderResult;
}

export default Loop;
