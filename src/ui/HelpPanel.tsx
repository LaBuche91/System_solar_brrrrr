import { useState } from 'react'

export function HelpPanel() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute bottom-4 right-4 bg-black bg-opacity-80 text-white p-2 rounded-full hover:bg-opacity-100 transition-all"
        title="Aide"
      >
        <span className="text-lg">?</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg max-w-xs">
          <h3 className="text-sm font-bold mb-2">Contrôles</h3>
          <div className="text-xs space-y-1">
            <div><strong>Clic sur planète:</strong> Autofocus</div>
            <div><strong>Clic dans l'espace:</strong> Vue générale</div>
            <div><strong>Molette:</strong> Zoom</div>
            <div><strong>Clic droit + glisser:</strong> Rotation</div>
            <div><strong>Clic milieu + glisser:</strong> Panoramique</div>
          </div>

          <h4 className="text-sm font-bold mt-3 mb-2">Raccourcis clavier</h4>
          <div className="text-xs space-y-1">
            <div><strong>0:</strong> Vue générale</div>
            <div><strong>S:</strong> Soleil</div>
            <div><strong>1-8:</strong> Planètes (Mercure → Neptune)</div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="mt-3 text-xs bg-blue-600 px-2 py-1 rounded hover:bg-blue-700"
          >
            Fermer
          </button>
        </div>
      )}
    </>
  )
}