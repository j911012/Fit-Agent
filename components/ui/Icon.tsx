import type { LucideProps } from "lucide-react";
import {
  ArrowRight,
  ArrowUp,
  Bell,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Dumbbell,
  Flame,
  History,
  Home,
  Mic,
  Pencil,
  Plus,
  Send,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  User,
  X,
  Zap,
} from "lucide-react";

export type IconName =
  | "home"
  | "dumbbell"
  | "sparkle"
  | "user"
  | "plus"
  | "flame"
  | "chart"
  | "chevR"
  | "chevD"
  | "bell"
  | "check"
  | "arrowUp"
  | "arrowR"
  | "close"
  | "edit"
  | "cal"
  | "settings"
  | "target"
  | "history"
  | "mic"
  | "send"
  | "trophy"
  | "bolt";

type IconComponent = React.ComponentType<LucideProps>;

const iconMap: Record<IconName, IconComponent> = {
  home: Home,
  dumbbell: Dumbbell,
  sparkle: Sparkles,
  user: User,
  plus: Plus,
  flame: Flame,
  chart: TrendingUp,
  chevR: ChevronRight,
  chevD: ChevronDown,
  bell: Bell,
  check: Check,
  arrowUp: ArrowUp,
  arrowR: ArrowRight,
  close: X,
  edit: Pencil,
  cal: Calendar,
  settings: Settings,
  target: Target,
  history: History,
  mic: Mic,
  send: Send,
  trophy: Trophy,
  bolt: Zap,
};

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
  // WF の sw（strokeWidth）相当
  sw?: number;
};

export default function Icon({
  name,
  size = 24,
  color,
  className,
  sw = 2,
}: IconProps) {
  const LucideIcon = iconMap[name];
  return (
    <LucideIcon
      size={size}
      color={color}
      className={className}
      strokeWidth={sw}
    />
  );
}