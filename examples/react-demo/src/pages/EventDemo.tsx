import { useState } from "react";
import { transportData } from "../../../../packages/core/src/lib/exportMethods";

export default function EventDemo() {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount((prev) => prev + 1);
    console.log("通用参数测试", window.__webTracing__?.baseInfo);
    transportData();
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
