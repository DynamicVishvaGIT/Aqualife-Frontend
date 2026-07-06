import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-100 transition"
    >
      <IoArrowBack size={22} />
      <span>Back</span>
    </button>
  );
}