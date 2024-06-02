import React from "react";

function Stepbox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-dark-text text-white text-[0.85rem] text-nowrap font-semibold rounded-full py-1 px-3 flex justify-center items-center"
    >
      <p>{children}</p>
    </div>
  );
}

export default Stepbox;
