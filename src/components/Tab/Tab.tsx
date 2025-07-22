import Link from "next/link";
import { usePathname } from "next/navigation";

import PeopleSVG from "@/assets/icons/people.svg";
import PeopleOutlineSVG from "@/assets/icons/people-outline.svg";
import PersonAddSVG from "@/assets/icons/person-add.svg";
import PersonAddOutlineSVG from "@/assets/icons/person-add-outline.svg";
import BanSVG from "@/assets/icons/ban.svg";
import BanOutlineSVG from "@/assets/icons/ban-outline.svg";

import styles from "./Tab.module.scss";

interface Tab {
  label: string;
  value: string;
  icon?: "people" | "person-add" | "ban";
}

const icons = {
  people: { outline: PeopleOutlineSVG, fill: PeopleSVG },
  "person-add": { outline: PersonAddOutlineSVG, fill: PersonAddSVG },
  ban: { outline: BanOutlineSVG, fill: BanSVG },
};

export default function Tab({
  tab,
  currentTab,
}: {
  tab: Tab;
  currentTab: string;
}) {
  const pathname = usePathname();

  const Icon = tab.icon
    ? tab.value === currentTab
      ? icons[tab.icon].fill
      : icons[tab.icon].outline
    : undefined;

  const newUrl = pathname
    .split("/")
    .map((segment, index, array) =>
      index === array.length - 1 ? tab.value : segment,
    )
    .join("/");

  return (
    <Link
      href={newUrl}
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      className={`${styles.tab ?? ""} ${(tab.value === currentTab && styles["tab--selected"]) || ""}`}
    >
      {Icon && (
        <div className={styles["tab__icon-wrapper"]}>
          <Icon className={styles.tab__icon} />
        </div>
      )}

      {tab.label}
    </Link>
  );
}
