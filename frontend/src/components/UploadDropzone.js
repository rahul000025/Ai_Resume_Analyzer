import { useCallback, useState } from 'react';

function UploadDropzone({ onFileSelected }) {
  const [dragActive, setDragActive] = useState(false);

  const handleFile = useCallback(
    (file) => {
      if (file) {
        onFileSelected(file);
      }
    },
    [onFileSelected]
  );

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFile(event.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDragEnter={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragActive(false);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={`glass-card rounded-3xl border-2 border-dashed p-10 text-center transition ${
        dragActive ? 'border-sky-400 bg-slate-900/90' : 'border-slate-700 bg-slate-950/50'
      }`}
    >
      <p className="text-xl font-semibold text-slate-100">Drag & drop your resume here</p>
      <p className="mt-3 text-sm text-slate-300">Supports PDF and DOCX formats.</p>
      <label className="mt-8 inline-flex cursor-pointer rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500">
        Browse files
        <input
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => handleFile(e.target.files && e.target.files[0])}
        />
      </label>
    </div>
  );
}

export default UploadDropzone;
