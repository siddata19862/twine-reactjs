import { useEffect, useState } from "react";

export default function FileManager() {
  const [currentPath, setCurrentPath] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const home = window.fsApi.getHomeDir();
    openDir(home);
  }, []);

  function openDir(dir) {
    const data = window.fsApi.readDir(dir);
    setCurrentPath(dir);
    setItems(data);
  }

  return (
    <div>
      <div style={{ fontWeight: "bold", marginBottom: 8 }}>
        {currentPath}
      </div>

      {items.map((item) => (
        <div
          key={item.path}
          onDoubleClick={() => item.isDir && openDir(item.path)}
          style={{
            cursor: item.isDir ? "pointer" : "default",
            padding: "4px 8px"
          }}
        >
          {item.isDir ? "📂" : "📄"} {item.name}
        </div>
      ))}
    </div>
  );
}