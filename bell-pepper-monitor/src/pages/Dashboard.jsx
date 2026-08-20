import { Link } from "react-router-dom";
import {
  Thermometer, Droplets, FlaskConical, Atom, Leaf, ArrowRight, Zap,
  Sunrise, Sun, Sunset, Moon,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import ConditionCard from "../components/ConditionCard";
import SuggestionCard from "../components/SuggestionCard";
import { Card, StatusBadge } from "../components/ui";
import { LIVE_READINGS, statusFor, SUGGESTIONS } from "../data/mockData";
import { useAuth } from "../context/AuthContext";

const CONDITION_CARDS = [
  {
    icon: Thermometer,
    label: "Temperature",
    value: LIVE_READINGS.temperature,
    unit: "°C",
    status: statusFor("temperature", LIVE_READINGS.temperature),
  },
  {
    icon: Droplets,
    label: "Humidity",
    value: LIVE_READINGS.humidity,
    unit: "%",
    status: statusFor("humidity", LIVE_READINGS.humidity),
  },
  {
    icon: FlaskConical,
    label: "Nitrogen",
    value: LIVE_READINGS.nitrogen.value,
    unit: "ppm",
    status: LIVE_READINGS.nitrogen.status,
  },
  {
    icon: Atom,
    label: "Phosphorus",
    value: LIVE_READINGS.phosphorus.value,
    unit: "ppm",
    status: LIVE_READINGS.phosphorus.status,
  },
  {
    icon: Leaf,
    label: "Potassium",
    value: LIVE_READINGS.potassium.value,
    unit: "ppm",
    status: LIVE_READINGS.potassium.status,
  },
];

const getGreetingInfo = () => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return { text: "Good morning", Icon: Sunrise, color: "text-amber-500" };
  }
  if (hour < 17) {
    return { text: "Good afternoon", Icon: Sun, color: "text-amber-500" };
  }
  if (hour < 21) {
    return { text: "Good evening", Icon: Sunset, color: "text-orange-500" };
  }
  return { text: "Good evening", Icon: Moon, color: "text-indigo-400" };
};

export default function Dashboard() {
  const { user } = useAuth();
  const { text, Icon, color } = getGreetingInfo();
  const greeting = (
    <span className="inline-flex items-center gap-2">
      <span>{text}</span>
      <Icon className={`w-6 h-6 ${color}`} />
    </span>
  );

  return (
    <div className="space-y-6">
      <PageHeader title={greeting} subtitle="Bell Pepper Monitor" />

      {/* Plant Health Hero */}
      <Card className="bg-gradient-to-br from-green-600 to-green-700 border-0 p-6 text-white">
        <p className="text-sm font-medium text-green-100 mb-1">Plant Health</p>
        <h2 className="text-3xl font-semibold mb-2">Healthy</h2>
        <p className="text-green-100 text-sm leading-relaxed max-w-md mb-4">
          Your bell pepper plant is growing under good conditions.
        </p>
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold">
          Overall Condition: Good
        </span>
      </Card>

      {/* Current Conditions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Current Conditions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CONDITION_CARDS.map((c) => (
            <ConditionCard key={c.label} {...c} />
          ))}
        </div>
      </div>

      {/* Lower section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Suggestions — 2 cols */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">💡 What Your Plant Needs</h2>
          <div className="space-y-3">
            {SUGGESTIONS.map((s) => (
              <SuggestionCard key={s.id} {...s} />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            AI suggestions can be enabled via Settings.
          </p>
        </Card>

        {/* Right column */}
        <div className="space-y-4">
          {/* System Connection */}
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">System Connection</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>
                <StatusBadge status="Connected" />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Signal</span>
                <span className="text-gray-800 font-medium">Good</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last update</span>
                <span className="text-gray-800 font-medium">10s ago</span>
              </div>
            </div>
            <Link
              to="/communication"
              className="mt-4 flex items-center gap-1 text-xs text-green-600 hover:underline font-medium"
            >
              View Technical Details <ArrowRight size={12} />
            </Link>
          </Card>

          {/* Energy */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-gray-700">Energy</h2>
              <Zap size={16} className="text-green-600" />
            </div>
            <p className="text-xs text-gray-400 mb-3">Power Saving Active</p>
            <p className="text-3xl font-semibold text-gray-900 mb-1">30%</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Efficiency reference · measured using INA226 power monitoring.
            </p>
            <Link
              to="/power"
              className="mt-3 flex items-center gap-1 text-xs text-green-600 hover:underline font-medium"
            >
              View Power Details <ArrowRight size={12} />
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
