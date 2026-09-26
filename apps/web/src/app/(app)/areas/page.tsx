import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createLifeArea, signOut } from "./actions";

export default async function AreasPage() {
  const supabase = await createClient();
  const { data: areas } = await supabase
    .from("life_areas")
    .select("id, name")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Мои области жизни</h1>
        <form action={signOut}>
          <button type="submit" className="text-sm underline">
            Выйти
          </button>
        </form>
      </div>

      <form action={createLifeArea} className="mb-8 flex gap-2">
        <input
          type="text"
          name="name"
          placeholder="Новая область, например «Здоровье»"
          required
          className="flex-1 rounded border px-3 py-2"
        />
        <button type="submit" className="rounded bg-black px-3 py-2 text-white">
          Добавить
        </button>
      </form>

      {!areas || areas.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Областей пока нет — добавь свою первую выше.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {areas.map((area) => (
            <li key={area.id}>
              <Link
                href={`/areas/${area.id}`}
                className="block rounded border px-3 py-2 hover:bg-neutral-50"
              >
                {area.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
