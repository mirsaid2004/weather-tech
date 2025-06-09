import clsx from "clsx";
import {
  createContext,
  Dispatch,
  ForwardedRef,
  forwardRef,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { mergeRefs } from "@/utils/merge-refs";
import { AdvancedSearchProps } from "../types/advanced-search";

type AdvancedSearchContextType = {
  isInputFocused: boolean;
  handleInputFocus: Dispatch<SetStateAction<boolean>>;
  showDropdown: boolean;
  handleDropdownShow: Dispatch<SetStateAction<boolean>>;
  value: string;
  onValueChange: (value: string) => void;
};

const AdvancedSearchContext = createContext<AdvancedSearchContextType | null>(
  null,
);

export const AdvancedSearchProvider = forwardRef(
  (
    { children, value, onValueChange, className, ...rest }: AdvancedSearchProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsInputFocused(false);
        setShowDropdown(false);
      }
    };

    useEffect(() => {
      if (showDropdown) {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }
    }, [showDropdown]);

    const handleInputFocus = (
      value: boolean | ((value: boolean) => boolean),
    ) => {
      if (typeof value === "function") {
        value = value(isInputFocused);
      }
      setIsInputFocused(value);
    };

    const handleDropdownShow = (
      value: boolean | ((value: boolean) => boolean),
    ) => {
      if (typeof value === "function") {
        value = value(showDropdown);
      }
      setShowDropdown(value);
    };

    return (
      <AdvancedSearchContext.Provider
        value={{
          isInputFocused,
          handleInputFocus,
          showDropdown,
          handleDropdownShow,
          value,
          onValueChange,
        }}
      >
        <div
          ref={mergeRefs(searchContainerRef, ref)}
          className={clsx(
            "relative flex items-center border border-input h-12 w-full rounded-md placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 bg-white px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            {
              "border-ring ring-ring/50 ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive":
                isInputFocused,
            },
            className,
          )}
          onBlur={() => setIsInputFocused(false)}
          {...rest}
        >
          {children}
        </div>
      </AdvancedSearchContext.Provider>
    );
  },
);

export function useAdvancedSearchContext() {
  const context = useContext(AdvancedSearchContext);

  if (!context) {
    throw new Error(
      "useAdvancedSearchContext must be used within an AdvancedSearchProvider",
    );
  }

  return context;
}
