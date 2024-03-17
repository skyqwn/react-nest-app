import React from "react";

const Container = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="w-full h-full px-2 sm:px-4 md:px-8 lg:px-12 xl:px-16 mt-16">
      {children}
    </div>
  );
};

export default Container;
