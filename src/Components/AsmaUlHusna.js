import { useCallback, useEffect, useState } from "react";
import { getData } from "../api";

const AsmaUlHusna = () => {
  const [asmaUlHusna, setAsmaUlHusna] = useState([]);

  const fetchAsmaUlHusna = useCallback(async () => {
    const data = await getData.asmaUlHusma();
    setAsmaUlHusna(data);
  }, []);

  useEffect(() => {
    fetchAsmaUlHusna();
  }, [fetchAsmaUlHusna]);


  return (
    <p className="text-white text-center">
      {asmaUlHusna.map((item) => (
        <span key={item.name}>
          <strong>{item.name}:</strong> <small>{item.en.meaning}</small>
        </span>
      ))}
    </p>
  );
};

export default AsmaUlHusna;
