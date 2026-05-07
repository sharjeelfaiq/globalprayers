import { useTranslation } from "react-i18next";
import { useCurrentTime } from "../../../shared/hooks/useCurrentTime";

const Clock = () => {
  const { i18n } = useTranslation();
  const currentTime = useCurrentTime(1000);
  const locale = i18n.resolvedLanguage || i18n.language || "en-US";

  const formattedTime = currentTime.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return <h3 className="dashboard-clock text-white">{formattedTime}</h3>;
};

export default Clock;
