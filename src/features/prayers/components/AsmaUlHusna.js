import { useAsmaUlHusna } from "../hooks/useAsmaUlHusna";

const AsmaUlHusna = () => {
  const { asmaUlHusna, isLoading, error } = useAsmaUlHusna();

  if (isLoading) {
    return <p className="text-white text-center status-text">Loading Asma ul Husna...</p>;
  }

  if (error) {
    return (
      <p className="text-white text-center status-text">
        Unable to load Asma ul Husna right now.
      </p>
    );
  }

  return (
    <p className="text-white text-center">
      {asmaUlHusna.map(({ name, en: { meaning } }) => (
        <span key={name}>
          <strong>{name}:</strong> <small>{meaning}</small>
        </span>
      ))}
    </p>
  );
};

export default AsmaUlHusna;
