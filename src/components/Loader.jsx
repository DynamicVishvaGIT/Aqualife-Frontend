const Loader = () => (
  <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white">
    <div
      className="w-8 h-8 rounded-full border-2 border-gray-200 animate-spin"
      style={{ borderTopColor: "#0061C2" }}
    />
  </div>
);

export default Loader;
