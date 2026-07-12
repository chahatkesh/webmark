import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiRequest } from "../../utils/apiClient";

const DeviceIcon = ({ deviceType, isCurrent }) => {
  const className = isCurrent ? "text-emerald-600" : "text-gray-500";
  if (deviceType === "mobile") {
    return <Smartphone className={`h-4 w-4 ${className}`} />;
  }
  return <Monitor className={`h-4 w-4 ${className}`} />;
};

const DevicesCard = ({ devices = [], maxDevices = 2, loading, onRevoked }) => {
  const [revokingId, setRevokingId] = useState(null);

  const handleRevoke = async (deviceId) => {
    setRevokingId(deviceId);
    try {
      await apiRequest("/api/user/devices/revoke", {
        method: "POST",
        body: { deviceId },
      });
      toast.success("Device signed out");
      onRevoked?.();
    } catch (error) {
      toast.error(error.data?.message || "Could not sign out device");
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold">Devices</CardTitle>
          {!loading && (
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
              {devices.length} / {maxDevices}
            </span>
          )}
        </div>
        <CardDescription>
          Up to 2 devices (one desktop, one mobile)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-lg bg-gray-100"
              />
            ))}
          </div>
        ) : devices.length === 0 ? (
          <p className="text-sm text-gray-500">
            Only this device is signed in right now.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {devices.map((device, index) => (
              <li
                key={device.deviceId || index}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div
                  className={`rounded-lg p-2 ${
                    device.isCurrent ? "bg-emerald-50" : "bg-gray-50"
                  }`}
                >
                  <DeviceIcon
                    deviceType={device.deviceType}
                    isCurrent={device.isCurrent}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {device.deviceName || "Unknown device"}
                    </p>
                    {device.isCurrent && (
                      <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-700">
                        This device
                      </span>
                    )}
                  </div>
                  <p className="text-xs capitalize text-gray-500">
                    {device.deviceType || "device"}
                    {device.lastActive
                      ? ` · active ${formatDistanceToNow(new Date(device.lastActive), { addSuffix: true })}`
                      : ""}
                  </p>
                </div>
                {!device.isCurrent && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={revokingId === device.deviceId}
                    onClick={() => handleRevoke(device.deviceId)}
                    className="h-8 shrink-0 px-2 text-xs text-gray-600 hover:text-red-600"
                  >
                    {revokingId === device.deviceId
                      ? "Signing out…"
                      : "Sign out"}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default DevicesCard;
