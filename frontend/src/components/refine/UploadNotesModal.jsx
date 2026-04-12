import React, { useState } from "react";
import { uploadNotes } from "../../services/refineService";

const UploadNotesModal = ({ deckId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const handleUpload = async (file) => {
    try {
      setLoading(true);

      const data = await uploadNotes(file, deckId);

      // 🔥 important: send data back to parent
      onSuccess(data.quiz);

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/10 backdrop-blur-[3px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="
        relative z-10 w-full max-w-xl
        rounded-2xl p-8
        bg-white/80 backdrop-blur-[3px]
        border border-[#e7e5e4]/50
        shadow-[0_20px_60px_rgba(0,0,0,0.12)]
      ">

        <h2 className="text-2xl font-serif mb-2 text-center">
          Upload your notes
        </h2>

        <p className="text-sm text-[#78716c] text-center mb-6">
          CLARE will generate a quiz from your document.
        </p>

        {/* Drop Zone */}
        <label
          className="
            flex flex-col items-center justify-center
            w-full h-40 rounded-xl
            border border-dashed border-[#d6d3d1]
            bg-white/50 cursor-pointer
            hover:bg-white/70 transition
          "
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {!file ? (
            <>
              <p className="text-sm text-[#78716c]">
                Click or drag a PDF here
              </p>
            </>
          ) : (
            <p className="text-sm text-[#57534e]">
              {file.name}
            </p>
          )}
        </label>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-8">

  {/* CANCEL */}
  <button
    onClick={onClose}
    disabled={loading}
    className={`
      px-5 py-2 rounded-lg text-sm font-medium

      bg-gradient-to-r from-[#e7e5e4] to-[#d6d3d1]
      text-[#57534e]

      shadow-[0_4px_12px_rgba(0,0,0,0.08)]

      ${
        loading
          ? "opacity-50 cursor-not-allowed"
          : "hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:translate-y-[-1px]"
      }

      transition-all duration-300
    `}
  >
    Cancel
  </button>

  {/* CREATE QUIZ */}
  <button
    onClick={() => handleUpload(file)}
    disabled={!file || loading}
    className={`
      px-6 py-2 rounded-lg text-sm font-medium text-white

      ${
        loading
          ? "bg-[#a8a29e] !cursor-wait"
          : file
          ? `
            bg-gradient-to-r from-[#8a9a7b] to-[#9baf8a]

            shadow-[0_8px_20px_rgba(138,154,123,0.25)]
            hover:shadow-[0_12px_30px_rgba(138,154,123,0.35)]

            hover:translate-y-[-1px]
          `
          : "bg-[#d6d3d1] text-[#a8a29e] !cursor-not-allowed"
      }

      active:translate-y-[0px]
      transition-all duration-300
    `}
  >
    {loading ? (
      <span className="flex items-center gap-2">
        <span className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
        Generating ...
      </span>
    ) : (
      "Generate Quiz"
    )}
  </button>

</div>

      </div>
    </div>
  );
};

export default UploadNotesModal;