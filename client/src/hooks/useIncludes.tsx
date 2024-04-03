import React, { useMemo } from "react";

const useIncludes = (array: string[], targetId: string) => {
  const isLike = useMemo(() => {
    return array.includes(targetId) ? true : false;
  }, [array]);

  return isLike;
};

export default useIncludes;
