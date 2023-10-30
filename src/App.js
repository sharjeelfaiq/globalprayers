import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [data, setData] = useState([]);
  const [timesArr, setTimesArr] = useState([]);
  const [slidingTimeArr, setSlidingTimeArr] = useState([]);
  const [index, setIndex] = useState(0);
  // const [displayTime, setDisplayTime] = useState(null);
  const [today, setToday] = useState("");
  const [islamicDate, setIslamicDate] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [second, setSecond] = useState("");
  const [meridian, setMeridian] = useState("");
  const [selectCity, setSelectCity] = useState(null);

  const city_names = [
    "Quetta",
    "Karachi",
    "Lahore",
    "Islamabad",
    "Multan",
    "Faisalabad",
    "Gujarat",
    "Rawalpindi",
    "Peshawar",
    "Hyderabad",
    "Bahawalpur"
  ];

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const country = "Pakistan";
        const city = selectCity === null ? "Quetta" : selectCity;
        const method = "1";
        const school = "1";
        const response = await fetch(
          `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${city}&country=${country}&method=${method}&school=${school}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAPI();

    setSelectCity(localStorage.getItem("city"))
  }, [selectCity]);

  useEffect(() => {
    if (data.data) {
      const date = new Date();
      const currentDate = date.getDate() - 1; //get the current date

      const timingsObj = data.data.map((item) => {
        return item.timings;
      });

      const datesObj = data.data.map((item) => {
        return item.date;
      });

      const dateInIslam = `${datesObj[currentDate].hijri.month.ar} ${datesObj[currentDate + 1].hijri.day
        } ,${datesObj[currentDate].hijri.year}`;

      setIslamicDate(dateInIslam);

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
    const h = setHour((date.getHours() % 12).toString().padStart(2, "0") === "00" ? "12" : (date.getHours() % 12).toString().padStart(2, "0"));
    setMinute(date.getMinutes().toString().padStart(2, "0"));
    setSecond(date.getSeconds().toString().padStart(2, "0"));
    setMeridian(h >= 12 ? "PM" : "AM");
  };

  useEffect(() => {
    setInterval(() => {
      getTime();
    }, 1000);
  }, []);

  const onCityChange = (e) => {
    setSelectCity(e.target.value);
    localStorage.setItem("city", e.target.value);
  }

  return (
    <>
      <div className="container w-75 table-responsive{-sm|-md|-lg|-xl} text-center clock-container">
        <h1 className="my-4 date-shadow" style={{ color: "white" }}>
          {islamicDate}
        </h1>
        <table className="table table-bordered rounded table-dark my-4 table-shadow">
          <thead>
            <tr>
              <th colSpan="3">
                <h4 className="m-1">{selectCity ? selectCity : "Quetta"} Prayer Timings</h4>
              </th>
            </tr>
            <tr>
              <th className="table-secondary">
                <h5 className="m-1">{today}</h5>
              </th>
              <th className="table-secondary" colSpan={2} style={{ width: "50%" }}>
                <h5 className="m-1">{hour}<span className="beat-effect time-element">:</span>{minute}<span className="beat-effect time-element">:</span>{second} {meridian}</h5>
              </th>
            </tr>
            <tr>
              <th scope="col">
                <h4>
                  <b>Namaz</b>
                </h4>
              </th>
              <th scope="col" colSpan={2}>
                <h4>
                  <b>Time</b>
                </h4>
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
              <td colSpan="3">
                <h4 className="slide-in m-1">{slidingTimeArr[index]}</h4>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <label htmlFor="city" style={{ color: "#fff", margin: "0px 0px 0px 80px" }}>Choose city:</label>
        <select id="city" onChange={onCityChange} style={{ margin: "0px 0px 0px 10px" }}>
          {city_names.map((city, index) => (
            <option value={city} key={index}>{city}</option>
          ))}
        </select>
      </div>
    </>
  );
};

export default App;
