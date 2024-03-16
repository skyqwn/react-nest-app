import React from "react";

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex items-stretch bg-slate-500">
      <div className="flex items-end flex-col flex-grow">
        <section className="bg-orange-500 w-[275px] py-2 h-dvh">
          <div className="fixed w-[275px] h-dvh"></div>
        </section>
      </div>
      <div className="flex items-start h-dvh flex-col flex-grow">
        <div className="bg-blue-400 h-full w-[990px] flex justify-between">
          <main className="w-[600px] bg-red-200">{children}</main>
          <section className="bg-green-300 h-full w-[350px]"></section>
        </div>
      </div>
    </div>
  );
};

export default Layout;
