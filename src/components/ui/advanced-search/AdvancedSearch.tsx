/* eslint-disable react-hooks/rules-of-hooks */
import { Button } from "../button";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { Separator } from "../separator";
import { AnimatePresence, motion } from "motion/react";
import {
  AdvancedSearchProvider,
  useAdvancedSearchContext,
} from "./context/advanced-search-context";
import {
  AdvancedSearchEmptyMessageProps,
  AdvancedSearchInputProps,
} from "./types/advanced-search";
import { ForwardedRef, forwardRef } from "react";
import {
  GroupedVirtuoso,
  GroupedVirtuosoHandle,
  GroupedVirtuosoProps,
} from "react-virtuoso";

const AdvancedSearch = () => {};

AdvancedSearch.Root = AdvancedSearchProvider;

AdvancedSearch.Input = forwardRef(
  (
    { className, ...rest }: AdvancedSearchInputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const { handleInputFocus, handleDropdownShow, onValueChange, value } =
      useAdvancedSearchContext();

    return (
      <>
        <input
          type="text"
          ref={ref}
          value={value}
          className={clsx("flex-1 border-none outline-none", className)}
          onChange={(e) => onValueChange(e.target.value)}
          onFocus={() => {
            handleInputFocus(true);
            handleDropdownShow(true);
          }}
          {...rest}
        />
        <Button
          variant={"ghost"}
          className="size-8 rounded-full"
          onClick={() => onValueChange("")}
        >
          <Icon icon={"material-symbols:close-rounded"} fontSize={20} />
        </Button>
        <Separator
          orientation="vertical"
          style={{ height: "60%", marginLeft: "3px" }}
        />
        <Button
          variant={"ghost"}
          className="size-8 rounded-full p-1 ml-1"
          onClick={() => handleDropdownShow((pre) => !pre)}
        >
          <Icon icon={"mingcute:down-line"} fontSize={25} />
        </Button>
      </>
    );
  },
);

AdvancedSearch.GroupedContent = forwardRef(
  <ItemData, Context>(
    props: GroupedVirtuosoProps<ItemData, Context>,
    ref: ForwardedRef<GroupedVirtuosoHandle>,
  ) => (
    <ContentWrapper>
      <GroupedVirtuoso
        ref={ref}
        style={{ height: "100%", width: "100%" }}
        {...props}
      />
    </ContentWrapper>
  ),
);

AdvancedSearch.EmptyMessage = forwardRef(
  (
    props: AdvancedSearchEmptyMessageProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => (
    <ContentWrapper>
      <div
        ref={ref}
        className="flex items-center justify-center h-full w-full text-gray-500 dark:text-gray-400"
        {...props}
      >
        {props.children || "No results found"}
      </div>
    </ContentWrapper>
  ),
);

const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
  const { showDropdown } = useAdvancedSearchContext();

  return (
    <AnimatePresence>
      {showDropdown ? (
        <motion.div
          className={clsx(
            "absolute top-full left-0 right-0",
            "h-72 w-full overflow-auto bg-white/30 backdrop-blur-md border border-gray-200 dark:border-gray-400 rounded-md shadow-lg mt-2 pl-4 py-4 pr-1 z-10",
          )}
          initial={{ opacity: 0, translateY: 10, scale: 0.95 }}
          animate={{ opacity: 1, translateY: 0, scale: 1 }}
          exit={{ opacity: 0, translateY: 10, scale: 0.95 }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default AdvancedSearch;
