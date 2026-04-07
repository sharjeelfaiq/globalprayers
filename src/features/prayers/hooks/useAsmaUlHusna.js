import { useEffect, useState } from "react";
import { getData } from "../api/api";

export const useAsmaUlHusna = () => {
  const [asmaUlHusna, setAsmaUlHusna] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchAsmaUlHusna = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await getData.asmaUlHusma();

        if (isMounted) {
          setAsmaUlHusna(Array.isArray(data) ? data : [data].filter(Boolean));
        }
      } catch (fetchError) {
        if (isMounted) {
          setAsmaUlHusna([]);
          setError(fetchError.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAsmaUlHusna();

    return () => {
      isMounted = false;
    };
  }, []);

  return { asmaUlHusna, isLoading, error };
};
