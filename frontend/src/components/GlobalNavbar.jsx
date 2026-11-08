import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationAsRead,
} from "../api/provider";
import { useTheme } from "../context/ThemeContext";

export default function GlobalNavbar() {
  const role = localStorage.getItem("role");

  const { theme, toggleTheme } =
    useTheme();

  const [notifications, setNotifications] =
    useState([]);

  const [showNotifications, setShowNotifications] =
    useState(false);

  useEffect(() => {
    if (role !== "provider") return;

    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res =
        await getNotifications();

      setNotifications(
        res.data || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleNotificationClick =
    async (id) => {
      try {
        await markNotificationAsRead(
          id
        );

        setNotifications((prev) =>
          prev.filter(
            (notification) =>
              notification.id !== id
          )
        );
      } catch (error) {
        console.error(error);
      }
    };

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.is_read
    ).length;

  return (
    <div
      className="
        w-full
        bg-white
        dark:bg-slate-800
        dark:text-white
        shadow
        p-4
        flex
        justify-between
        items-center
      "
    >
      <h1 className="text-2xl font-bold capitalize">
        {role} Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="
            border
            px-3
            py-2
            rounded
            dark:border-slate-600
          "
        >
          {theme === "dark"
            ? "☀️"
            : "🌙"}
        </button>

        <div className="relative">
          <button
            className="text-2xl"
            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }
          >
            🔔
          </button>

          {unreadCount > 0 && (
            <span
              className="
                absolute
                -top-2
                -right-2
                bg-red-600
                text-white
                text-xs
                px-2
                py-1
                rounded-full
              "
            >
              {unreadCount}
            </span>
          )}

          {showNotifications && (
            <div
              className="
                absolute
                right-0
                mt-3
                w-96
                bg-white
                dark:bg-slate-800
                dark:text-white
                border
                dark:border-slate-700
                shadow-lg
                rounded-lg
                z-50
                max-h-96
                overflow-y-auto
              "
            >
              <div className="p-3 border-b dark:border-slate-700 font-bold">
                🔔 Notifiche
              </div>

              {notifications.length === 0 ? (
                <div className="p-4 text-gray-500">
                  Nessuna notifica
                </div>
              ) : (
                notifications.map(
                  (notification) => (
                    <div
                      key={notification.id}
                      onClick={() =>
                        handleNotificationClick(
                          notification.id
                        )
                      }
                      className="
                        p-4
                        border-b
                        dark:border-slate-700
                        hover:bg-gray-50
                        dark:hover:bg-slate-700
                        cursor-pointer
                      "
                    >
                      <p className="font-semibold">
                        {notification.title}
                      </p>

                      <p
                        className="
                          text-sm
                          text-gray-600
                          dark:text-gray-300
                          mt-1
                        "
                      >
                        {
                          notification.message
                        }
                      </p>
                    </div>
                  )
                )
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href =
              "/login";
          }}
          className="
            bg-red-600
            text-white
            px-4
            py-2
            rounded
          "
        >
          Logout
        </button>
      </div>
    </div>
  );
}