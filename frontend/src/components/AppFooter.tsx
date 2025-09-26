import React from "react";

const AppFooter: React.FC = () => {
  return (
    <footer className="bg-[oklch(from_var(--background)_l_c_h_/_80%)] border-t border-[var(--sidebar-border)] py-6 mt-16">
      <div className="max-w-[85rem] mx-auto px-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} SoSweet. All rights reserved. | <span className="text-[var(--primary)]">UI inspired by ReadymadeUI</span>
      </div>
    </footer>
  );
};

export default AppFooter;
