import { useState, useEffect } from "react";

type SlideToggleProps = {
  enabled?: boolean;
  setEnable?: (value: boolean) => void;
};

const SlideToggle = ({ enabled = false, setEnable }: SlideToggleProps) => {
  const [on, setOn] = useState(enabled);

  // Sync internal state with external enabled prop
  useEffect(() => {
    setOn(enabled);
  }, [enabled]);

  const handleClick = () => {
    setOn((previous) => {
      const next = !previous;
      if (setEnable) setEnable(next);
      return next;
    });
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: 40,
        height: 20,
        borderRadius: 30,
        background: on ? "#3C83F6" : "#ccc",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        padding: 3,
        position: "relative",
        transition: "background 0.3s"
      }}
    >
      <div
        style={{
          height: 16,
          width: 16,
          borderRadius: "50%",
          background: "#fff",
          transform: `translateX(${on ? 18 : 0}px)`,
          transition: "transform 0.3s"
        }}
      />
    </div>
  );
};

export default SlideToggle;