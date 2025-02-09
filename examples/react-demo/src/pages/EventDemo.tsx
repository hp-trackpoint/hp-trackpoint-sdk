import { useState } from "react";

export default function EventDemo() {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount((prev) => prev + 1);
  };

  return (
    <div className="container">
      <h2>事件监控演示</h2>
      <div className="demo-section">
        <button onClick={handleClick}>点击事件 ({clickCount})</button>
        <a href="https://example.com" target="_blank" rel="noopener noreferrer">
          外部链接跳转
        </a>
      </div>
    </div>
  );
}
