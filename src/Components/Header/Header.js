import React, { useContext } from "react";
import { PrayersContext } from "../../context/prayersContext.js";

const Header = () => {
  const { today, islamicDate, handleSettingChange } = useContext(PrayersContext);
  const prayersTimeConfig = useContext(PrayersContext);
  const {
    settings,
    schools,
    methods,
    latitude_adjustment_options,
    mindnight_calculation_options,
  } = prayersTimeConfig;

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
          <li>
            <div className="dropdown-item">
              Method
              <select
                className="form-select mt-2 text-black"
                value={settings.method}
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
          <li>
            <div className="dropdown-item">
              City
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Enter city name"
                value={settings.city}
                onChange={handleSettingChange("city")}
              />
            </div>
          </li>
          <li>
            <div className="dropdown-item">
              Country
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Enter country name"
                value={settings.country}
                onChange={handleSettingChange("country")}
              />
            </div>
          </li>
          <li>
            <div className="dropdown-item">
              Juristic School (only affects Asr calculation)
              <select
                className="form-select mt-2 text-black"
                value={settings.school}
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
          <li>
            <div className="dropdown-item">
              Higher Latitude Adjustment:
              <select
                className="form-select mt-2 text-black"
                value={settings.latitudeAdjustment}
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
          <li>
            <div className="dropdown-item">
              Midnight Calculation Mode:
              <select
                className="form-select mt-2 text-black"
                value={settings.midnightCalculation}
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
