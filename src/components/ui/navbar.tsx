import { useTheme } from "@/hooks/useTheme";
import { Button } from "./button";
import { Icon } from "@iconify/react";
import SettingsPanel from "../SettingsPanel";

function Navbar() {
  const { isDark, setTheme } = useTheme();

  return (
    <div className="flex justify-center items-center bg-white/30 backdrop-blur-sm border-b border-gray-200 dark:border-gray-400 sticky top-0 left-0 right-0 z-50">
      <nav className="flex items-center justify-between w-full max-w-[800px] p-3">
        <div className="text-2xl font-bold ">Weather Tech</div>
        <ul className="flex space-x-4">
          <li>
            <Button
              variant={"outline"}
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="size-10 rounded-full"
            >
              <Icon
                icon={
                  isDark
                    ? "tdesign:mode-dark"
                    : "material-symbols-light:light-mode"
                }
                fontSize={20}
              />
            </Button>
          </li>
          <li>
            <SettingsPanel />
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
