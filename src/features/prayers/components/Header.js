import { usePrayerData, usePrayerMeta, usePrayerSettings } from "../context/hooks";

const Header = () => {
  const { error } = usePrayerData();
  const { today, islamicDate } = usePrayerMeta();
  const {
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
  } = usePrayerSettings();

  const formClass = "form-select mt-2 text-black";

  return (
    <div className="d-flex justify-content-between container-fluid">
      <h6 className="text-white text-start">
        {error ? "Date unavailable" : today || "Loading date..."}
        <br />
        {error ? "Unable to load Hijri date" : islamicDate || "Loading Hijri date..."}
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
                className={formClass}
                value={method}
                onChange={handleSettingChange("method")}
              >
                {methods.map((methodLabel, index) => (
                  <option key={methodLabel} value={index}>
                    {methodLabel}
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
                value={city}
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
                value={country}
                onChange={handleSettingChange("country")}
              />
            </div>
          </li>

          <li>
            <div className="dropdown-item">
              Juristic School (only affects Asr calculation)
              <select
                className={formClass}
                value={school}
                onChange={handleSettingChange("school")}
              >
                {schools.map((schoolLabel, index) => (
                  <option key={schoolLabel} value={index}>
                    {schoolLabel}
                  </option>
                ))}
              </select>
            </div>
          </li>

          <li>
            <div className="dropdown-item">
              Higher Latitude Adjustment
              <select
                className={formClass}
                value={latitudeAdjustment}
                onChange={handleSettingChange("latitudeAdjustment")}
              >
                {latitude_adjustment_options.map((option, index) => (
                  <option key={option} value={index}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </li>

          <li>
            <div className="dropdown-item">
              Midnight Calculation Mode
              <select
                className={formClass}
                value={midnightCalculation}
                onChange={handleSettingChange("midnightCalculation")}
              >
                {mindnight_calculation_options.map((option, index) => (
                  <option key={option} value={index}>
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
