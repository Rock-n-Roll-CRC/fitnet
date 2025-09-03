"use client";

import { useSelectedLayoutSegment } from "next/navigation";

import Tab from "@/components/Tab/Tab";

import styles from "./Tabs.module.scss";

interface Tab {
  label: string;
  value: string;
  icon?: "people" | "person-add" | "ban";
}

export default function Tabs({ tabs }: { tabs: [Tab, ...Tab[]] }) {
  const currentTab = useSelectedLayoutSegment() ?? "friends";

  return (
    <div className={styles.tabs}>
      {tabs.map((tab) => (
        <Tab key={tab.value} tab={tab} currentTab={currentTab} />
      ))}
    </div>
  );
}
