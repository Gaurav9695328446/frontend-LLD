import { useEffect, useRef, useState, useCallback } from "react";

export default function InfiniteScroll(props) {
  const { renderListItem, getData, listData } = props;
  const pageNumber = useRef(1);
  const [loading, setLoading] = useState(false);

  const observer = useRef(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    getData(pageNumber.current).finally(() => {
      setLoading(false);
    });
  }, [getData]);

  const lastElementOberver = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          pageNumber.current += 1;
          fetchData();
        }
      });
      if (node) observer.current.observe(node);
    },
    [fetchData, loading]
  );

  const renderList = useCallback(() => {
    return listData.map((item, index) => {
      if (index === listData.length - 1)
        return renderListItem(item, index, lastElementOberver);
      return renderListItem(item, index, null);
    });
  }, [listData, renderListItem, lastElementOberver]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {renderList()}
      {loading && "LOADING"}
    </>
  );
}
