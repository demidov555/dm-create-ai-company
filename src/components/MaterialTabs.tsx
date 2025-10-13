import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface MaterialTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function MaterialTabs({ tabs, activeTab, onTabChange }: MaterialTabsProps) {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const activeTabElement = tabsRef.current[activeIndex];

    if (activeTabElement) {
      setIndicatorStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
      });
    }
  }, [activeTab, tabs]);

  return (
    <div className="relative border-b border-border bg-card">
      <div className="flex items-center gap-1 px-2">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => (tabsRef.current[index] = el)}
              onClick={() => onTabChange(tab.id)}
              className="relative px-6 py-4 flex items-center gap-2 transition-colors duration-200 hover:bg-secondary/50 rounded-t-lg group"
            >
              {/* Ripple effect container */}
              <motion.div
                className="absolute inset-0 rounded-t-lg overflow-hidden"
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-primary/5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.div>

              {/* Icon with animation */}
              <motion.div
                animate={{
                  scale: isActive ? 1.05 : 1,
                  color: isActive ? "var(--primary)" : "var(--muted-foreground)",
                }}
                transition={{ duration: 0.2 }}
                className="relative z-10"
              >
                <tab.icon className="h-4 w-4" />
              </motion.div>

              {/* Label with animation */}
              <motion.span
                animate={{
                  color: isActive ? "var(--primary)" : "var(--foreground)",
                }}
                transition={{ duration: 0.2 }}
                className="text-sm relative z-10"
              >
                {tab.label}
              </motion.span>

              {/* Hover indicator */}
              {!isActive && (
                <motion.div
                  className="absolute inset-0 bg-secondary/30 rounded-t-lg"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Animated indicator */}
      <motion.div
        className="absolute bottom-0 h-0.5 bg-primary"
        initial={false}
        animate={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
      />
    </div>
  );
}
