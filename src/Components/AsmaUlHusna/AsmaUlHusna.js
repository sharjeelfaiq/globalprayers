import { useEffect, useState } from "react";
import { getData } from "../../api/api";

const AsmaUlHusna = () => {
  const [asmaUlHusna, setAsmaUlHusna] = useState([]);

  useEffect(() => {
    const fetchAsmaUlHusna = async () => {
      const data = await getData.asmaUlHusma();
      setAsmaUlHusna(data);
    };

    fetchAsmaUlHusna();
  }, []); // Empty dependency array ensures this runs only once

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
