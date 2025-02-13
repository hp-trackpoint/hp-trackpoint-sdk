import React from 'react';
import { useState } from "react";


export default function ErrorDemo() {
  const [count, setCount] = useState(0);

  const triggerError = () => {
    throw new Error("测试错误");
  };

  const triggerPromiseError = async () => {
    try {
      await Promise.reject(new Error("Promise 错误"));
    } catch (error) {
      console.error(error);
    }
  };

  const triggerAsyncError = async () => {
    const response = await fetch("https://non-exist-api.com");
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="container">
      <h2>错误监控演示</h2>
      <div className="demo-section">
        <button onClick={triggerError}>触发普通错误</button>
        <button onClick={triggerPromiseError}>触发 Promise 错误</button>
        <button onClick={triggerAsyncError}>触发异步错误</button>
        <button onClick={() => setCount(count + 1)}>状态更新 ({count})</button>
      </div>
    </div>
  );
}
