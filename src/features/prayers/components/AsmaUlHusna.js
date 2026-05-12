import { useTranslation } from "react-i18next";
import { useAsmaUlHusna } from "../hooks/useAsmaUlHusna";

const AsmaUlHusna = () => {
  const { t } = useTranslation("prayers");
  const { asmaUlHusna, isLoading, error } = useAsmaUlHusna();

  if (isLoading) {
    return <p className="daily-name status-text">{t("status.loadingAsma")}</p>;
  }

  if (error) {
    return (
      <p className="daily-name status-text">
        {t("status.asmaUnavailable")}
      </p>
    );
  }

  return (
    <section className="daily-name" aria-label="Asma ul Husna">
      {asmaUlHusna.map(({ name, en: { meaning } }) => (
        <div className="asma-card" key={name}>
          <strong className="asma-arabic">{name}</strong>
          <span className="asma-meaning">{meaning}</span>
          <span className="asma-divider" aria-hidden="true" />
          <small className="asma-quote">"{meaning}"</small>
        </div>
      ))}
    </section>
  );
};

export default AsmaUlHusna;
