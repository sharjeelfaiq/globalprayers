import React, { useContext } from "react";
import { PrayersContext } from "../../context/prayersContext.js";

const Header = () => {
  const {
    today,
    islamicDate,
    handleSettingChange,
    settings: {
      method,
      city,
      country,
      school,
      latitudeAdjustment,
      midnightCalculation,
    },
    methods,
    schools,
    latitude_adjustment_options,
    mindnight_calculation_options,
  } = useContext(PrayersContext);

  // Define a consistent className for form elements
  const formClass = "form-select mt-2 text-black";

  return (
    <div className="d-flex justify-content-between container-fluid">
      <h6
        className="text-white text-start"
        style={{ fontFamily: "Roboto Mono, monospace" }}
      >
        {today}
        <br />
        {islamicDate}
      </h6>

      <div>
        <button
          className="btn text-white"
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="fas fa-cog"></i>
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          {/* Method */}
          <li>
            <div className="dropdown-item">
              Method
              <select
                className={formClass}
                value={method}
                onChange={handleSettingChange("method")}
              >
                {methods.map((method, index) => (
                  <option key={index} value={index}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </li>

          {/* City */}
          <li>
            <div className="dropdown-item">
              City
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Enter city name"
                value={city}
                onChange={handleSettingChange("city")}
              />
            </div>
          </li>

          {/* Country */}
          <li>
            <div className="dropdown-item">
              Country
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Enter country name"
                value={country}
                onChange={handleSettingChange("country")}
              />
            </div>
          </li>

          {/* Juristic School */}
          <li>
            <div className="dropdown-item">
              Juristic School (only affects Asr calculation)
              <select
                className={formClass}
                value={school}
                onChange={handleSettingChange("school")}
              >
                {schools.map((school, index) => (
                  <option key={index} value={index}>
                    {school}
                  </option>
                ))}
              </select>
            </div>
          </li>

          {/* Latitude Adjustment */}
          <li>
            <div className="dropdown-item">
              Higher Latitude Adjustment
              <select
                className={formClass}
                value={latitudeAdjustment}
                onChange={handleSettingChange("latitudeAdjustment")}
              >
                {latitude_adjustment_options.map((option, index) => (
                  <option key={index} value={index}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </li>

          {/* Midnight Calculation */}
          <li>
            <div className="dropdown-item">
              Midnight Calculation Mode
              <select
                className={formClass}
                value={midnightCalculation}
                onChange={handleSettingChange("midnightCalculation")}
              >
                {mindnight_calculation_options.map((option, index) => (
                  <option key={index} value={index}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
