import { Monitor } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DevicesCard = ({ devices = [], loading }) => {
  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold">Devices</CardTitle>
          {!loading && devices.length > 0 && (
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
              {devices.length}
            </span>
          )}
        </div>
        <CardDescription>Sessions active in the last 30 days</CardDescription>
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
                  <Monitor
                    className={`h-4 w-4 ${
                      device.isCurrent ? "text-emerald-600" : "text-gray-500"
                    }`}
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
                  <p className="text-xs text-gray-500">
                    Active{" "}
                    {device.lastActive
                      ? formatDistanceToNow(new Date(device.lastActive), {
                          addSuffix: true,
                        })
                      : "recently"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default DevicesCard;
