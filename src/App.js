import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [data, setData] = useState([]); //initialize a state variable named data and setData function to update it
  const [timesArr, setTimesArr] = useState([]); //initialize a state variable named timesArr and setTimesArr function to update it
  const [slidingTimeArr, setSlidingTimeArr] = useState([]); //initialize a state variable named slidingTimeArr and setSlidingTimeArr function to update it
  const [index, setIndex] = useState(0); //initialize a state variable named index and setIndex function to update it. This variable will keep track of the current index of the array
  const [displayTime, setDisplayTime] = useState(null);
  const [today, setToday] = useState("");

  const fetchAPI = async () => {
    //function to fetch data from the API
    try {
      const year = 2023;
      const month = 4;
      const country = "Pakistan";
      const city = "Quetta";
      const method = "1";
      const response = await fetch(
        `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${city}&country=${country}&method=${method}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const json = await response.json();
      setData(json); //update the state variable named data with the response from the API
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAPI(); //call the fetchAPI function when the component mounts
  }, []);

  useEffect(() => {
    if (data.data) {
      //check if data has been fetched from the API
      const date = new Date();
      const currentDate = date.getDate() - 1; //get the current date

      const timingsObj = data.data.map((item) => {
        return item.timings;
      });

      const datesObj = data.data.map((item) => {
        return item.date;
      });

      setToday(datesObj[currentDate].readable);

      const entries = Object.entries(timingsObj[currentDate]);
      const copiedEntries = entries.filter((element, index) => {
        return ![1, 4, 7, 8, 9, 10].includes(index);
      });
      setTimesArr(copiedEntries); //update the state variable named timesArr with an array of prayer times for the current date

      const timingsArr = Object.entries(timingsObj[currentDate]).map(
        ([key, value]) => {
          const date = new Date(`January 1, 2022 ${value}`);
          const timeString = date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
          return `${key}: ${timeString}`;
        }
      );
      const filteredArr = timingsArr.filter((element, index) => {
        return ![7, 8, 9, 10].includes(index);
      });

      setSlidingTimeArr(filteredArr); //update the state variable named slidingTimeArr with an array of prayer times in 12-hour format for the current date
      const interval = setInterval(() => {
        setIndex((index) => (index + 1) % slidingTimeArr.length); //update the index every 10 seconds
      }, 10000);
      return () => clearInterval(interval); //clear the interval on unmount
    }
  }, [data, slidingTimeArr.length]);

  const getTime = () => {
    const date = new Date();
    const hours = (date.getHours() % 12).toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    // const seconds = date.getSeconds().toString().padStart(2, "0");
    const meridian = hours >= 12 ? "PM" : "AM";
    const currentTime = `${hours} : ${minutes} ${meridian}`;
    setDisplayTime(currentTime);
  };

  useEffect(() => {
    setInterval(() => {
      getTime();
    }, 1000);
  }, []);

  return (
    <>
      <div className="container w-75 table-responsive{-sm|-md|-lg|-xl} text-center clock-container">
        <table className="table table-bordered rounded table-dark my-5">
          <thead>
            <tr>
              <th colSpan="2">
                <h4 className="m-1">Quetta Prayer Timings</h4>
              </th>
            </tr>
            <tr>
              <th className="table-secondary">
                <h5 className="m-1">{today}</h5>
              </th>
              <th className="table-secondary" style={{ width: "50%" }}>
                <h5 className="m-1 beat-effect time-element">{displayTime}</h5>
              </th>
            </tr>
            <tr>
              <th scope="col">
                <h4>Namaz</h4>
              </th>
              <th scope="col">
                <h4>Time</h4>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.data &&
              timesArr.map(([key, value]) => {
                const date = new Date();
                const timeParts = value.split(":");
                date.setHours(parseInt(timeParts[0]));
                date.setMinutes(parseInt(timeParts[1]));

                let minutes = date.getMinutes();

                if (key === "Fajr") {
                  minutes = minutes + 60; // increment by 2 hours
                } else if (key === "Dhuhr") {
                  minutes = 120;
                } else if (key === "Asr") {
                  minutes = minutes + 60; // increment by 1 hour
                } else if (key === "Isha") {
                  minutes = (minutes + 15) % 60; // increment by 15 minutes
                }
                date.setMinutes(minutes);

                const formattedTime = date.toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                });
                return (
                  <tr>
                    <td>
                      <h5>{key}</h5>
                    </td>
                    <td>
                      <h5>{formattedTime}</h5>
                    </td>
                  </tr>
                );
              })}
            <tr className="table-active">
              <td colSpan="2">
                <h4 className="slide-in m-1">{slidingTimeArr[index]}</h4>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default App;
