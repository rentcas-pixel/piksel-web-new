'use client';

function isPdfUrl(url: string) {
  return url.split(/[#?]/)[0].toLowerCase().endsWith('.pdf');
}

export interface ClipSpecDiagramModalProps {
  open: boolean;
  onClose: () => void;
  /** Ekrano pavadinimas modalo antraštei */
  title: string;
  /** Viešas paveikslo ar PDF URL */
  imageUrl: string;
  /** Papildoma eilutė po antrašte (pvz. rezoliucija) */
  subtitle?: string;
}

/**
 * Techninės schemos peržiūra (variantas D): modalas nuo Info mygtuko prie ekrano pavadinimo.
 */
export function ClipSpecDiagramModal({ open, onClose, title, imageUrl, subtitle }: ClipSpecDiagramModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="clip-spec-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-4 border border-gray-200 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start gap-4 mb-3">
          <div>
            <h3 id="clip-spec-modal-title" className="font-semibold text-gray-900">
              {title}
            </h3>
            {subtitle ? <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-gray-900 shrink-0 px-2 py-1 rounded hover:bg-gray-100"
          >
            Uždaryti
          </button>
        </div>

        {isPdfUrl(imageUrl) ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Schema pateikta PDF formatu.</p>
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[#1329d4] underline text-sm font-medium"
            >
              Atidaryti PDF naujame skirtuke
            </a>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={`${title}: techninė schema`}
            className="w-full h-auto rounded border border-gray-100"
          />
        )}

        <p className="text-xs text-gray-500 mt-3">
          <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-[#1329d4] underline">
            Atidaryti failą naujame skirtuke
          </a>
        </p>
      </div>
    </div>
  );
}
