import { useTranslation } from "react-i18next";
import { useAsmaUlHusna } from "../hooks/useAsmaUlHusna";

const AsmaUlHusna = () => {
  const { t } = useTranslation("prayers");
  const { asmaUlHusna, isLoading, error } = useAsmaUlHusna();

  if (isLoading) {
    return <p className="daily-name text-white text-center status-text">{t("status.loadingAsma")}</p>;
  }

  if (error) {
    return (
      <p className="daily-name text-white text-center status-text">
        {t("status.asmaUnavailable")}
      </p>
    );
  }

  return (
    <p className="daily-name text-white text-center">
      {asmaUlHusna.map(({ name, en: { meaning } }) => (
        <span key={name}>
          <strong>{name}:</strong> <small>{meaning}</small>
        </span>
      ))}
    </p>
  );
};

export default AsmaUlHusna;
