import React from 'react';
import { Link } from "react-router-dom";


export default function Home() {
  return (
    <div className="container">
      <h1>Tracking SDK Demo</h1>
      <nav>
        <ul>
          <li>
            <Link to="/error">错误监控演示</Link>
          </li>
          <li>
            <Link to="/performance">性能监控演示</Link>
          </li>
          <li>
            <Link to="/event">事件监控演示</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
