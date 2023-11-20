import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [data, setData] = useState([]);
  const [timesArr, setTimesArr] = useState([]);
  // const [slidingTimeArr, setSlidingTimeArr] = useState([]);
  const [index, setIndex] = useState(0);
  const [today, setToday] = useState("");
  const [islamicDate, setIslamicDate] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [second, setSecond] = useState("");
  const [meridian, setMeridian] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
    "Bahawalpur"
  ];

  const schools = ["0", "1"]

  const methods = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17"]

  useEffect(() => {
    (
      async () => {
        try {
          const date = new Date();
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const country = "Pakistan";
          const city = selectedCity === null ? "Quetta" : selectedCity;
          const method = selectedMethod === null ? "1" : selectedMethod;
          const school = selectedSchool === null ? "0" : selectedSchool;
          const response = await fetch(
            `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${city}&country=${country}&method=${method}&school=${school}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const json = await response.json();
          setData(json);
          setSelectedCity(localStorage.getItem("city"))
          setSelectedSchool(localStorage.getItem("school"))
          setSelectedMethod(localStorage.getItem("method"))
        } catch (error) {
          console.error(error);
        }
      })();
  }, [selectedCity, selectedMethod, selectedSchool]);

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

      const dateInIslam = `${datesObj[currentDate].hijri.month.en} ${datesObj[currentDate].hijri.day} ,${datesObj[currentDate].hijri.year}`;

      setIslamicDate(dateInIslam);

      setToday(datesObj[currentDate].readable);

      const entries = Object.entries(timingsObj[currentDate]);
      const copiedEntries = entries.filter((element, index) => {
        return ![4, 7, 8, 9, 10].includes(index);
      });
      setTimesArr(copiedEntries);
    }
  }, [data]);

  const getTime = () => {
    const date = new Date();
    const h = setHour((date.getHours() % 12).toString().padStart(2, "0") === "00" ? "12" : (date.getHours() % 12).toString().padStart(2, "0"));
    setMinute(date.getMinutes().toString().padStart(2, "0"));
    setSecond(date.getSeconds().toString().padStart(2, "0"));
    setMeridian(h >= 12 ? "PM" : "AM");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getTime();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const onCityChange = (e) => {
    setSelectedCity(e.target.value);
    localStorage.setItem("city", e.target.value);
  }

  const onSchoolChange = (e) => {
    setSelectedSchool(e.target.value);
    localStorage.setItem("school", e.target.value);
  }

  const onMethodChange = (e) => {
    setSelectedMethod(e.target.value);
    localStorage.setItem("method", e.target.value);
  }

  return (
    <>
      <div className="container w-75 table-responsive{-sm|-md|-lg|-xl} text-center clock-container">
        <h1 className="my-4 date-shadow" style={{ color: "white" }}>
          {selectedCity ? selectedCity : "Quetta"} Prayer Timings
        </h1>
        <table className="table table-bordered rounded table-dark my-4 table-shadow">
          <thead>
            <tr>
              <th colSpan="3">
                <p className={windowWidth < 550 ? `m-1 h6` : `m-1 h3`}>{islamicDate}</p>
              </th>
            </tr>
            <tr>
              <th className="table-secondary">
                <p className={windowWidth < 550 ? `m-1 h6` : `m-1 h5`}>{today}</p>
              </th>
              <th className="table-secondary" colSpan={2} style={{ width: "50%" }}>
                <p className={windowWidth < 550 ? `m-1 h6` : `m-1 h5`}>{hour}<span className="beat-effect time-element">:</span>{minute}<span className="beat-effect time-element">:</span>{second} {meridian}</p>
              </th>
            </tr>
            <tr>
              <th scope="col">
                <p className={windowWidth < 550 ? `h5` : `h4`}>
                  <b>Namaz</b>
                </p>
              </th>
              <th scope="col" colSpan={2}>
                <p className={windowWidth < 550 ? `h5` : `h4`}>
                  <b>Time</b>
                </p>
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
                      <p className={windowWidth < 550 ? `h6` : `h5`}>{key}</p>
                    </td>
                    <td>
                      <p className={windowWidth < 550 ? `h6` : `h5`}>{formattedTime}</p>
                    </td>
                  </tr>
                );
              })}
            <tr className="table-active">
              <td colSpan="2">
                {/* <p className={windowWidth < 550 ? `h5 slide-in m-1` : `h4 slide-in m-1`}>{slidingTimeArr[index]}</p> */}
                <p className={windowWidth < 550 ? `h5 slide-in m-1` : `h4 slide-in m-1`}>Next prayer in X minutes</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ margin: "0px 0px 0px 50px" }}>
        <div>
          <label htmlFor="city" style={{ fontSize:"14px", color: "#fff", margin: "2px 5px 2px 0px", display: "inline-block", width: "60px", textAlign: "right" }}>City:</label>
          <select id="city" onChange={onCityChange} style={{ fontSize: "14px"}} value={selectedCity}>
            {city_names.map((city, index) => (
              <option value={city} key={index}>{city}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="school" style={{ fontSize:"14px", color: "#fff", margin: "2px 5px 2px 0px", display: "inline-block", width: "60px", textAlign: "right" }}>School:</label>
          <select id="school" onChange={onSchoolChange} style={{ fontSize: "14px"}} value={selectedSchool}>
            {schools.map((school, index) => (
              <option value={school} key={index}>{school === "0" ? "Shafi" : "Hanafi"}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="method" style={{ fontSize:"14px", color: "#fff", margin: "2px 5px 2px 0px", display: "inline-block", width: "60px", textAlign: "right" }} className="font-sm">Method:</label>
          <select id="method" onChange={onMethodChange} style={{ fontSize: "14px"}} value={selectedMethod}>
            {methods.map((method, index) => {
              if (method === "0") {
                return (
                  <option value={method} key={index}>Shia Ithna-Ansari</option>
                )
              } else if (method === "1") {
                return (
                  <option value={method} key={index}>University of Islamic Sciences, Karachi</option>
                )
              } else if (method === "2") {
                return (
                  <option value={method} key={index}>Islamic Society of North America</option>
                )
              } else if (method === "3") {
                return (
                  <option value={method} key={index}>Muslim World League</option>
                )
              } else if (method === "4") {
                return (
                  <option value={method} key={index}>Umm al-Qura University, Makkah</option>
                )
              } else if (method === "5") {
                return (
                  <option value={method} key={index}>Egyptian General Authority of Survey</option>
                )
              } else if (method === "6") {
                return (
                  <option value={method} key={index}>Institute of Geophysics, University of Tehran</option>
                )
              } else if (method === "7") {
                return (
                  <option value={method} key={index}>Gulf Region</option>
                )
              } else if (method === "8") {
                return (
                  <option value={method} key={index}>Kuwait</option>
                )
              } else if (method === "9") {
                return (
                  <option value={method} key={index}>Qatar</option>
                )
              } else if (method === "10") {
                return (
                  <option value={method} key={index}>Majlis Ugama Islam Singapura, Singapore</option>
                )
              } else if (method === "11") {
                return (
                  <option value={method} key={index}>Union Organization islamic de France</option>
                )
              } else if (method === "12") {
                return (
                  <option value={method} key={index}>Diyanet İşleri Başkanlığı, Turkey</option>
                )
              } else if (method === "13") {
                return (
                  <option value={method} key={index}>Spiritual Administration of Muslims of Russia</option>
                )
              } else if (method === "14") {
                return (
                  <option value={method} key={index}>Ministry of Awqaf and Islamic Affairs, Kuwait</option>
                )
              } else if (method === "15") {
                return (
                  <option value={method} key={index}>Ministry of Religious Affairs and Wakfs, Algeria</option>
                )
              } else if (method === "16") {
                return (
                  <option value={method} key={index}>Ministry of Religious Affairs, Tunisia</option>
                )
              } else if (method === "17") {
                return (
                  <option value={method} key={index}>Ministry of Endowments and Islamic Affairs, Qatar</option>
                )
              }
            })}
          </select>
        </div>
      </div>
    </>
  );
};

export default App;
