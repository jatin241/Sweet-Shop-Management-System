import React from "react";

const Placeholder: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] bg-[oklch(from_var(--background)_l_c_h_/_50%)] rounded-lg m-8">
      <h2 className="text-4xl font-bold text-[var(--primary)] mb-4">{title}</h2>
      <p className="text-lg text-gray-400">This page is under construction.</p>
    </div>
  );
};

export default Placeholder;
