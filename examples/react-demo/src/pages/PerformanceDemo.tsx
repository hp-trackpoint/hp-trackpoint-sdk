import { useEffect, useState } from "react";

export default function PerformanceDemo() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    console.log("");
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos/1"
      );
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadImage = () => {
    const img = new Image();
    img.src = "https://picsum.photos/200/300";
  };

  return (
    <div className="container">
      <h2>性能监控演示</h2>
      <div className="demo-section">
        <button onClick={loadData}>加载 API 数据</button>
        <button onClick={loadImage}>加载图片资源</button>
        {loading && <p>加载中...</p>}
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </div>
    </div>
  );
}
