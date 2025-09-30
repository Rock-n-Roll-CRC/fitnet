"use client";

import type { Tables } from "@/types/database";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import NotificationsMenu from "@/components/NotificationsMenu/NotificationsMenu";
import NotificationsActions from "@/components/NotificationsActions/NotificationsActions";

import ArrowBackOutlineSVG from "@/assets/icons/arrow-back-outline.svg";
import ChevronDownOutlineSVG from "@/assets/icons/chevron-down-outline.svg";
import ChevronUpOutlineSVG from "@/assets/icons/chevron-up-outline.svg";
import OptionsOutlineSVG from "@/assets/icons/options-outline.svg";

import styles from "./NotificationsHeader.module.scss";

export default function NotificationsHeader({
  profile,
  filters,
}: {
  profile: Tables<"profiles">;
  filters: {
    status: "all" | "unread" | "read";
    types: ("requests" | "messages" | "reviews")[];
    startDate?: string;
    endDate?: string;
  };
}) {
  const readonlySearchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [types, setTypes] = useState(filters.types);

  const statusFilterRef = useRef<HTMLDivElement>(null);
  const typesFilterRef = useRef<HTMLDivElement>(null);

  function handleToggleStatusFilter() {
    setIsStatusFilterOpen((isStatusFilterOpen) => !isStatusFilterOpen);
  }

  function handleToggleTypeFilter() {
    setIsTypeFilterOpen((isTypeFilterOpen) => !isTypeFilterOpen);
  }

  function handleSelectFilter(filter: {
    name: string;
    value: string | string[];
  }) {
    setIsStatusFilterOpen(false);

    const searchParams = new URLSearchParams(readonlySearchParams);

    searchParams.delete(filter.name);

    if (Array.isArray(filter.value)) {
      filter.value.forEach((value) => {
        searchParams.append(filter.name, value);
      });
    } else {
      searchParams.set(filter.name, filter.value);
    }

    router.replace(`${pathname}/?${searchParams.toString()}`);
  }

  useEffect(() => {
    handleSelectFilter({ name: "types", value: types });
  }, [types]);

  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (!statusFilterRef.current?.contains(event.target as Node)) {
        setIsStatusFilterOpen(false);
      }
      if (!typesFilterRef.current?.contains(event.target as Node)) {
        setIsTypeFilterOpen(false);
      }
    }

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <header className={styles["notifications-header"]}>
      <div className={styles["notifications-header__top-container"]}>
        <Link href="/search" className={styles["notifications-header__button"]}>
          <ArrowBackOutlineSVG
            className={styles["notifications-header__icon"]}
          />
        </Link>

        <h1 className={styles["notifications-header__heading"]}>
          Notifications
        </h1>

        <NotificationsMenu />
        <NotificationsActions />
      </div>

      <div className={styles["notifications-header__bottom-container"]}>
        <div
          ref={statusFilterRef}
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          className={`${styles["notifications-header__filter-container"] ?? ""} ${(isStatusFilterOpen && styles["notifications-header__filter-container--visible"]) || ""}`}
        >
          <div
            onClick={handleToggleStatusFilter}
            className={styles["notifications-header__filter-display"]}
          >
            <span className={styles["notifications-header__filter-label"]}>
              {filters.status
                .split("")
                .map((char, index) => (index === 0 ? char.toUpperCase() : char))
                .join("")}
            </span>

            {isStatusFilterOpen ? (
              <ChevronUpOutlineSVG
                className={styles["notifications-header__filter-icon"]}
              />
            ) : (
              <ChevronDownOutlineSVG
                className={styles["notifications-header__filter-icon"]}
              />
            )}
          </div>

          <div className={styles["notifications-header__filter-body"]}>
            <ul className={styles["notifications-header__filter-list"]}>
              <li>
                <button
                  onClick={() => {
                    handleSelectFilter({ name: "status", value: "all" });
                  }}
                  className={styles["notifications-header__filter-button"]}
                >
                  All
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleSelectFilter({ name: "status", value: "unread" });
                  }}
                  className={styles["notifications-header__filter-button"]}
                >
                  Unread
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleSelectFilter({ name: "status", value: "read" });
                  }}
                  className={styles["notifications-header__filter-button"]}
                >
                  Read
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div
          ref={typesFilterRef}
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          className={`${styles["notifications-header__filter-container"] ?? ""} ${(isTypeFilterOpen && styles["notifications-header__filter-container--visible"]) || ""}`}
        >
          <div
            onClick={handleToggleTypeFilter}
            className={styles["notifications-header__filter-display"]}
          >
            <span className={styles["notifications-header__filter-label"]}>
              Filter
            </span>

            <OptionsOutlineSVG
              className={styles["notifications-header__filter-icon"]}
            />
          </div>

          <div className={styles["notifications-header__filter-body"]}>
            <ul className={styles["notifications-header__filter-list"]}>
              <li>
                <div
                  className={
                    styles["notifications-header__filter-input-wrapper"]
                  }
                >
                  <input
                    type="checkbox"
                    name="type-requests"
                    id="type-requests"
                    checked={types.includes("requests")}
                    onChange={(event) => {
                      setTypes((types) =>
                        event.target.checked
                          ? [...types, "requests"]
                          : types.filter((type) => type !== "requests"),
                      );
                    }}
                    className={styles["notifications-header__filter-input"]}
                  />
                  <label
                    htmlFor="type-requests"
                    className={styles["notifications-header__filter-label"]}
                  >
                    Requests
                  </label>
                </div>
              </li>
              <li>
                <div
                  className={
                    styles["notifications-header__filter-input-wrapper"]
                  }
                >
                  <input
                    type="checkbox"
                    name="type-messages"
                    id="type-messages"
                    checked={types.includes("messages")}
                    onChange={(event) => {
                      setTypes((types) =>
                        event.target.checked
                          ? [...types, "messages"]
                          : types.filter((type) => type !== "messages"),
                      );
                    }}
                    className={styles["notifications-header__filter-input"]}
                  />
                  <label
                    htmlFor="type-messages"
                    className={styles["notifications-header__filter-label"]}
                  >
                    Messages
                  </label>
                </div>
              </li>
              {profile.role === "coach" && (
                <li>
                  <div
                    className={
                      styles["notifications-header__filter-input-wrapper"]
                    }
                  >
                    <input
                      type="checkbox"
                      name="type-reviews"
                      id="type-reviews"
                      checked={types.includes("reviews")}
                      onChange={(event) => {
                        setTypes((types) =>
                          event.target.checked
                            ? [...types, "reviews"]
                            : types.filter((type) => type !== "reviews"),
                        );
                      }}
                      className={styles["notifications-header__filter-input"]}
                    />
                    <label
                      htmlFor="type-reviews"
                      className={styles["notifications-header__filter-label"]}
                    >
                      Reviews
                    </label>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
