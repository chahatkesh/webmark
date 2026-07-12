import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Monitor, Smartphone } from "lucide-react";
import { toast } from "react-toastify";
import { assets } from "../assets/assests";
import { Button } from "../components/ui/button";
import Loader from "../components/Loader";
import { useAuth } from "../hooks/useAuth";
import { apiRequest, buildApiUrl } from "../utils/apiClient";
import { setDeviceId } from "../utils/deviceId";

const DeviceIcon = ({ deviceType }) => {
  if (deviceType === "mobile") {
    return <Smartphone className="h-4 w-4" />;
  }
  return <Monitor className="h-4 w-4" />;
};

const AuthDevices = () => {
  const [searchParams] = useSearchParams();
  const pendingCode = searchParams.get("code");
  const navigate = useNavigate();
  const { fetchUserData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [payload, setPayload] = useState(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");

  useEffect(() => {
    if (!pendingCode) {
      toast.error("Missing sign-in request. Please try again.");
      navigate("/auth", { replace: true });
      return;
    }

    const loadPending = async () => {
      try {
        const response = await fetch(
          buildApiUrl(
            `/api/user/devices/pending?code=${encodeURIComponent(pendingCode)}`,
          ),
          { credentials: "include" },
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Could not load devices");
        }

        setPayload(data);
        if (data.newDevice?.deviceId) {
          setDeviceId(data.newDevice.deviceId);
        }
      } catch (error) {
        toast.error(error.message || "This sign-in request expired.");
        navigate("/auth", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadPending();
  }, [pendingCode, navigate]);

  const handleContinue = async () => {
    if (!selectedDeviceId || !pendingCode) return;

    setSubmitting(true);
    try {
      const data = await apiRequest("/api/user/devices/continue-login", {
        method: "POST",
        body: {
          code: pendingCode,
          revokeDeviceId: selectedDeviceId,
        },
        skipAuthRefresh: true,
      });

      if (data.newDevice?.deviceId) {
        setDeviceId(data.newDevice.deviceId);
      }

      if (data.requiresOnboarding) {
        navigate("/onboarding", { replace: true });
        return;
      }

      const ok = await fetchUserData();
      if (ok) {
        navigate("/user/dashboard", { replace: true });
        return;
      }

      navigate("/auth", { replace: true });
    } catch (error) {
      toast.error(error.data?.message || "Could not complete sign-in.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader type="spinner" size="lg" />
      </div>
    );
  }

  const newDevice = payload?.newDevice;
  const devices = payload?.devices || [];

  return (
    <div className="flex min-h-screen flex-col justify-center px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src={assets.logo_color}
          alt="Webmark"
        />
        <h1 className="mt-6 text-center text-2xl font-semibold tracking-tight text-gray-900">
          Choose a device to sign out
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Webmark allows up to 2 active sessions. Sign out one to continue on{" "}
          <span className="font-medium text-gray-700">
            {newDevice?.deviceName || "this device"}
          </span>
          .
        </p>

        <div className="mt-6 space-y-2">
          {devices.map((device) => {
            const selected = selectedDeviceId === device.deviceId;
            return (
              <button
                key={device.deviceId}
                type="button"
                onClick={() => setSelectedDeviceId(device.deviceId)}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                  selected
                    ? "border-blue-500 bg-blue-50/60"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div
                  className={`rounded-lg p-2 ${
                    selected
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-50 text-gray-500"
                  }`}
                >
                  <DeviceIcon deviceType={device.deviceType} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {device.deviceName || "Unknown device"}
                  </p>
                  <p className="text-xs capitalize text-gray-500">
                    {device.deviceType || "device"}
                    {device.lastActive
                      ? ` · active ${formatDistanceToNow(new Date(device.lastActive), { addSuffix: true })}`
                      : ""}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <Button
          type="button"
          disabled={!selectedDeviceId || submitting}
          onClick={handleContinue}
          className="mt-6 h-11 w-full bg-blue-500 text-white hover:bg-blue-600"
        >
          {submitting ? "Signing in…" : "Continue on this device"}
        </Button>

        <button
          type="button"
          onClick={() => navigate("/auth", { replace: true })}
          className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel and go back
        </button>
      </div>
    </div>
  );
};

export default AuthDevices;
