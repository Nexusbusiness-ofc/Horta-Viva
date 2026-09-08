import React from "react";
import { Trash2, Pencil } from "lucide-react";

export default function MyAnimalCard({ myAnimal, farmAnimal, onDelete, onEdit }) {
  const color = myAnimal.animal_color || "#ea580c";
  const feeding = farmAnimal?.feeding || farmAnimal?.feed_items;
  const care = farmAnimal?.care;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm">
      <div className="flex items-stretch">
        <div className="w-1.5 shrink-0" style={{ background: color }} />
        <div className="flex-1 p-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ backgroundColor: color + "15" }}
            >
              {myAnimal.animal_emoji || "🐾"}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-stone-800 truncate">{myAnimal.animal_name}</h3>
              <p className="text-xs text-stone-500 truncate">
                {myAnimal.quantity ? `${myAnimal.quantity} animal(ns)` : ""}
                {myAnimal.location ? ` · ${myAnimal.location}` : ""}
              </p>
            </div>
            <div className="flex gap-1 shrink-0">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
                  title="Editar"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => onDelete(myAnimal.id)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center text-stone-400 transition-colors"
                title="Remover"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {(feeding || care) && (
            <div className="mt-3 space-y-2">
              {feeding && (
                <div className="bg-orange-50 rounded-lg p-2.5">
                  <p className="text-xs font-semibold text-orange-700 mb-0.5">🍽️ Alimentação diária</p>
                  <p className="text-xs text-stone-600 leading-relaxed">{feeding}</p>
                </div>
              )}
              {care && (
                <div className="bg-amber-50 rounded-lg p-2.5">
                  <p className="text-xs font-semibold text-amber-700 mb-0.5">🩺 Cuidados</p>
                  <p className="text-xs text-stone-600 leading-relaxed">{care}</p>
                </div>
              )}
            </div>
          )}

          {myAnimal.notes && (
            <p className="mt-2 text-xs text-stone-500 leading-relaxed">📝 {myAnimal.notes}</p>
          )}
        </div>
      </div>
    </div>
  );
}