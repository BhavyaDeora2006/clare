const Loader = ({ size = 28 }) => {
  return (
    <div className="flex items-center justify-center">
      <div
        style={{ width: size, height: size }}
        className="
        border-[3px]
        border-[#8a9a7b]/30
        border-t-[#8a9a7b]

        rounded-full
        animate-spin
      "
      />
    </div>
  );
};

export default Loader;