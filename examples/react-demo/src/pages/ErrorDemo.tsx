import React, { useState } from "react";

export default function ErrorDemo() {
  const [count, setCount] = useState(0);

  // 触发 JS 运行时错误
  const triggerError = () => {
    // try{
    //   throw new Error("测试 JS 运行时错误");
    // }
    // catch{
    //   throw new Error("我是第二个错误");
    // }
    throw new Error("测试 JS 运行时错误");

  };

  // 触发资源加载错误（尝试加载一个不存在的图片）
  const triggerResourceError = () => {
    const img = document.createElement("img");
    img.src = "https://c-ssl.duitang.com/upads/blog/202206/08/202206080_a1bbd.jpg"; // 不存在的资源
    img.alt = "Broken Image";
    img.onerror = () => console.log("资源加载错误：图片加载失败");
    document.body.appendChild(img);
  };

  // 触发未捕获的 Promise 错误
  const triggerUnhandledPromiseError = () => {
    Promise.reject(new Error("未被处理的 Promise 错误"));
  };

  return (
    <div className="container">
      <h2>错误监控演示</h2>
      <div className="demo-section">
        <button onClick={triggerError}>触发 JS 运行时错误</button>
        <button onClick={triggerResourceError}>触发资源加载错误</button>
        <button onClick={triggerUnhandledPromiseError}>触发未捕获的 Promise 错误</button>
        <button onClick={() => setCount(count + 1)}>状态更新 ({count})</button>
      </div>
    </div>
  );
}
