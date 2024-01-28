import { useCallback, useState } from "react";
import "./App.css";
import InfiniteScroll from "./infinte-scroll";

function App() {
  const [data, setData] = useState([]);

  const renderItem = useCallback(
    ({ title }, key, ref) => (
      <div ref={ref} key={key}>
        {title}
      </div>
    ),
    []
  );

  const getData = useCallback((pageNumber) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/albums/${pageNumber}/photos`
        );

        const data = await response.json();
        setData((prevData) => [...prevData, ...data]);
        resolve(); // Resolve after successful data update
      } catch (e) {
        console.error(e);
        reject(e); // Reject with the error object
      }
    });
  }, []);

  return (
    <InfiniteScroll
      renderListItem={renderItem}
      getData={getData}
      listData={data}
    />
  );
}

export default App;
