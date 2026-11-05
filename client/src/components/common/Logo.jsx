import { APP_NAME } from '../../constants/config.js';

export default function Logo() {
  return (
    <span className="flex items-center gap-2 text-lg font-semibold text-slate-900">
      <img src="/favicon.svg" alt="" className="size-8" />
      {APP_NAME}
    </span>
  );
}
