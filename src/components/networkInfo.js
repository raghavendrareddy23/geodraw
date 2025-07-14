import React, { useEffect, useState } from "react";
import {
  SignalIcon,
  WifiIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const NetworkInfo = () => {
  const [network, setNetwork] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateNetworkInfo = () => {
      if ("connection" in navigator) {
        const connection =
          navigator.connection ||
          navigator.mozConnection ||
          navigator.webkitConnection;

        setNetwork({
          type: connection.effectiveType,
          downlink: connection.downlink,
          downlinkMax: connection.downlinkMax,
          rtt: connection.rtt,
          saveData: connection.saveData,
        });
      }
    };

    updateNetworkInfo();

    if ("connection" in navigator) {
      navigator.connection.addEventListener("change", updateNetworkInfo);
    }

    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));

    return () => {
      if ("connection" in navigator) {
        navigator.connection.removeEventListener("change", updateNetworkInfo);
      }
      window.removeEventListener("online", () => setIsOnline(true));
      window.removeEventListener("offline", () => setIsOnline(false));
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full p-6 flex flex-col gap-3 bg-gradient-to-br from-blue-100 to-white">
      <div className="flex items-center gap-2 mb-2">
        <SignalIcon className="h-6 w-6 text-green-600" />
        <h2 className="text-xl font-bold text-gray-800">Network Info</h2>
        <span
          className={`ml-auto px-2 py-1 text-xs rounded-full ${
            isOnline ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {isOnline ? "Online" : "Offline "}
        </span>
      </div>

      {network ? (
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <WifiIcon className="h-5 w-5 text-blue-500" />
            <span className="font-medium w-24">Type:</span>
            <span className="capitalize">{network.type}</span>
          </div>

          <div className="flex items-center gap-2">
            <ArrowTrendingDownIcon className="h-5 w-5 text-indigo-500" />
            <span className="font-medium w-24">Downlink:</span>
            <span>{network.downlink} Mbps</span>
          </div>

          {network.downlinkMax && (
            <div className="flex items-center gap-2">
              <ArrowTrendingUpIcon className="h-5 w-5 text-indigo-500" />
              <span className="font-medium w-24">Max Speed:</span>
              <span>{network.downlinkMax} Mbps</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-orange-500" />
            <span className="font-medium w-24">RTT:</span>
            <span>{network.rtt} ms</span>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="h-5 w-5 text-purple-500" />
            <span className="font-medium w-24">Data Saver:</span>
            <span>{network.saveData ? "Enabled " : "Disabled"}</span>
          </div>

          {network.downlink < 1 || network.rtt > 300 || network.type.includes("2g") ? (
            <div className="text-red-600 font-semibold text-center mt-4">
              Slow or unstable connection
            </div>
          ) : (
            <div className="text-green-600 font-semibold text-center mt-4">
               Good network performance
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500 mt-4">Network info not available</p>
      )}
    </div>
  );
};

export default NetworkInfo;
