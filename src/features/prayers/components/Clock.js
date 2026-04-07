import { useCurrentTime } from "../../../shared/hooks/useCurrentTime";

const Clock = () => {
  const currentTime = useCurrentTime(1000);

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return <h3 className="text-white">{formattedTime}</h3>;
};

export default Clock;
