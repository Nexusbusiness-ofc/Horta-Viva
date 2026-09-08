// Motor de tarefas diárias da quinta.
// Combina plantações (rega), animais da quinta (alimentação/cuidados)
// e podas sazonais para gerar a lista do que fazer hoje.

const WATER_FREQ = {
  "Abundante": 1,
  "Moderada": 2,
  "Pouca": 3,
};

function daysSince(dateStr) {
  if (!dateStr) return 0;
  const start = new Date(dateStr + "T00:00:00");
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((today - start) / 86400000));
}

export function computeDailyTasks({ plantings, plants, myAnimals, farmAnimals, podas }) {
  const tasks = { rega: [], animais: [], podas: [] };
  const plantByName = {};
  (plants || []).forEach(p => { plantByName[p.name] = p; });
  const faById = {};
  (farmAnimals || []).forEach(a => { faById[a.id] = a; });
  const currentMonth = new Date().getMonth() + 1;

  // Rega — frequência conforme necessidades de água da planta
  (plantings || []).forEach(pl => {
    if (pl.status === "Colhida") return;
    const plant = plantByName[pl.plant_name];
    const water = plant?.water_requirements || "Moderada";
    const freq = WATER_FREQ[water] || 2;
    const dayIdx = daysSince(pl.planted_date);
    if (dayIdx % freq === 0) {
      tasks.rega.push({
        id: `rega-${pl.id}`,
        title: `Regar ${pl.plant_name}`,
        detail: `Rega ${water.toLowerCase()}${pl.location ? ` · ${pl.location}` : ""}`,
        emoji: pl.plant_emoji || "🌱",
        color: pl.plant_color || "#84cc16",
      });
    }
  });

  // Animais — tarefas diárias de alimentação e cuidados
  (myAnimals || []).forEach(ma => {
    const fa = ma.animal_id ? faById[ma.animal_id] : null;
    const feeding = fa?.feeding || fa?.feed_items || "";
    const care = fa?.care || "";
    const meta = [
      ma.quantity ? `${ma.quantity} animal(ns)` : "",
      ma.location || "",
    ].filter(Boolean).join(" · ");
    tasks.animais.push({
      id: `anim-${ma.id}`,
      title: `Alimentar e cuidar de ${ma.animal_name}`,
      detail: meta,
      how: feeding,
      care,
      emoji: ma.animal_emoji || "🐾",
      color: ma.animal_color || "#ea580c",
    });
  });

  // Podas — lembrete sazonal (durante os meses de poda)
  (podas || []).forEach(po => {
    if ((po.when_months || []).includes(currentMonth)) {
      tasks.podas.push({
        id: `poda-${po.id}`,
        title: `Podar ${po.name}`,
        detail: po.when_info || "Época de poda",
        how: po.how,
        emoji: po.emoji || "✂️",
        color: po.color || "#16a34a",
      });
    }
  });

  return tasks;
}

export function countTasks(tasks) {
  return tasks.rega.length + tasks.animais.length + tasks.podas.length;
}