"use client";

import Tab from "@/components/Tab/Tab";

import styles from "./Tabs.module.scss";

interface Tab {
  label: string;
  value: string;
  icon?: "people" | "person-add" | "ban";
}

export default function Tabs({
  currentTab,
  tabs,
}: {
  currentTab: string;
  tabs: [Tab, ...Tab[]];
}) {
  return (
    <div className={styles.tabs}>
      {tabs.map((tab) => (
        <Tab key={tab.value} tab={tab} currentTab={currentTab} />
      ))}
    </div>
  );
}
