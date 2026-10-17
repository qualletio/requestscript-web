import { icons, type IconName } from '@/lib/icons';

export function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d={icons[name]} fill="currentColor" />
    </svg>
  );
}
