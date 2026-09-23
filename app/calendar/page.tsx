"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./page.module.scss";

type Recipe = {
  id: string;
  title: string;
  image?: string | null;
  calories?: number | null;
  protein?: number | null;
  servings: number;
};

type CalendarEntry = {
  id: string;
  date: string;
  servings: number;
  recipe: Recipe;
};

const monthNames = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
];
const weekDays = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"];

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getCalendarDays(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const days: (Date | null)[] = Array(startOffset).fill(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(new Date(month.getFullYear(), month.getMonth(), day));
  }
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

function getWeekDays(center: Date) {
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(center);
    day.setDate(center.getDate() + index - 3);
    return day;
  });
}

function formatDate(date: Date) {
  return date.toLocaleDateString("pl-PL", { day: "numeric", month: "long" });
}

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [focusDate, setFocusDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(dateKey(new Date()));
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [recipeId, setRecipeId] = useState("");
  const [servings, setServings] = useState("1");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const days = useMemo(
    () =>
      viewMode === "week"
        ? getWeekDays(focusDate)
        : getCalendarDays(
            new Date(focusDate.getFullYear(), focusDate.getMonth(), 1),
          ),
    [focusDate, viewMode],
  );
  const visibleDates = days.filter((day): day is Date => Boolean(day));
  const rangeStart = dateKey(visibleDates[0]);
  const rangeEnd = dateKey(visibleDates[visibleDates.length - 1]);
  const selectedEntries = entries.filter(
    (entry) => entry.date === selectedDate,
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [recipesResponse, calendarResponse] = await Promise.all([
          fetch("/api/recipes"),
          fetch(`/api/calendar?start=${rangeStart}&end=${rangeEnd}`),
        ]);
        const recipesData = await recipesResponse.json();
        const calendarData = await calendarResponse.json();
        if (!recipesResponse.ok || !calendarResponse.ok) {
          setError(calendarData.message || "Nie udało się wczytać kalendarza.");
          return;
        }
        setRecipes(Array.isArray(recipesData) ? recipesData : []);
        setEntries(Array.isArray(calendarData) ? calendarData : []);
      } catch {
        setError("Nie udało się połączyć z serwerem.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [rangeStart, rangeEnd]);

  const changePeriod = (offset: number) => {
    const next = new Date(focusDate);
    if (viewMode === "week") {
      next.setDate(next.getDate() + offset * 7);
    } else {
      next.setMonth(next.getMonth() + offset);
      next.setDate(1);
    }
    setFocusDate(next);
    setSelectedDate(
      dateKey(
        viewMode === "week"
          ? next
          : new Date(next.getFullYear(), next.getMonth(), 1),
      ),
    );
  };

  const switchView = (mode: "week" | "month") => {
    setViewMode(mode);
    setSelectedDate(
      dateKey(
        mode === "week"
          ? focusDate
          : new Date(focusDate.getFullYear(), focusDate.getMonth(), 1),
      ),
    );
  };

  const addEntry = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!recipeId) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          recipeId,
          servings: Number(servings),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Nie udało się dodać przepisu.");
        return;
      }
      setEntries((current) => [
        ...current.filter(
          (entry) =>
            entry.id !== data.id &&
            !(entry.date === data.date && entry.recipe.id === data.recipe.id),
        ),
        data,
      ]);
    } catch {
      setError("Nie udało się zapisać wpisu.");
    } finally {
      setSaving(false);
    }
  };

  const removeEntry = async (id: string) => {
    try {
      await fetch("/api/calendar", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setEntries((current) => current.filter((entry) => entry.id !== id));
    } catch {
      setError("Nie udało się usunąć wpisu.");
    }
  };

  const caloriesFor = (entry: CalendarEntry) =>
    Math.round(
      ((entry.recipe.calories || 0) / entry.recipe.servings) *
        entry.servings *
        10,
    ) / 10;

  const proteinFor = (entry: CalendarEntry) =>
    Math.round(
      ((entry.recipe.protein || 0) / entry.recipe.servings) *
        entry.servings *
        10,
    ) / 10;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <div>
            <Link href="/" className={styles.backLink}>
              ← Przepisy
            </Link>
            <h1>Kalendarz posiłków</h1>
            <p>Planuj przepisy na każdy dzień i kontroluj kalorie.</p>
          </div>
          <div className={styles.monthControls}>
            <button
              type="button"
              onClick={() => changePeriod(-1)}
              aria-label="Poprzedni zakres"
            >
              ‹
            </button>
            <strong>
              {viewMode === "week"
                ? `${formatDate(visibleDates[0])} - ${formatDate(visibleDates[6])}`
                : `${monthNames[focusDate.getMonth()]} ${focusDate.getFullYear()}`}
            </strong>
            <button
              type="button"
              onClick={() => changePeriod(1)}
              aria-label="Następny zakres"
            >
              ›
            </button>
          </div>
          <div className={styles.viewSwitch}>
            <button
              type="button"
              className={viewMode === "week" ? styles.activeView : ""}
              onClick={() => switchView("week")}
            >
              7 dni
            </button>
            <button
              type="button"
              className={viewMode === "month" ? styles.activeView : ""}
              onClick={() => switchView("month")}
            >
              Miesiąc
            </button>
          </div>
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <section className={styles.calendar} aria-label="Kalendarz">
          {weekDays.map((day) => (
            <div className={styles.weekDay} key={day}>
              {day}
            </div>
          ))}
          {days.map((day, index) => {
            if (!day)
              return <div className={styles.emptyDay} key={`empty-${index}`} />;
            const key = dateKey(day);
            const dayEntries = entries.filter((entry) => entry.date === key);
            const totalCalories = dayEntries.reduce(
              (sum, entry) => sum + caloriesFor(entry),
              0,
            );
            const totalProtein = dayEntries.reduce(
              (sum, entry) => sum + proteinFor(entry),
              0,
            );
            return (
              <div
                className={`${styles.day} ${selectedDate === key ? styles.selected : ""}`}
                key={key}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedDate(key)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ")
                    setSelectedDate(key);
                }}
              >
                <span className={styles.dayNumber}>{day.getDate()}</span>
                <span className={styles.dayRecipes}>
                  {dayEntries.slice(0, 3).map((entry) => (
                    <Link
                      href={`/${entry.recipe.id}`}
                      key={entry.id}
                      onClick={(event) => event.stopPropagation()}
                      title={`Otwórz ${entry.recipe.title}`}
                    >
                      <img
                        src={entry.recipe.image || "/placeholder.jpg"}
                        alt={entry.recipe.title}
                      />
                    </Link>
                  ))}
                </span>
                {dayEntries.length > 0 && (
                  <div className={styles.dayCalories}>
                    <span>{totalCalories.toFixed(1)} kcal</span>
                    <span>{totalProtein.toFixed(1)} g białka</span>
                  </div>
                )}
              </div>
            );
          })}
        </section>

        <section className={styles.planner}>
          <div className={styles.plannerHeader}>
            <div>
              <span>Wybrany dzień</span>
              <h2>{selectedDate}</h2>
            </div>
            <span className={styles.entryCount}>
              {selectedEntries.length} przepisów
            </span>
          </div>
          <form className={styles.addForm} onSubmit={addEntry}>
            <select
              value={recipeId}
              onChange={(event) => setRecipeId(event.target.value)}
              disabled={loading || saving}
            >
              <option value="">Wybierz przepis</option>
              {recipes.map((recipe) => (
                <option value={recipe.id} key={recipe.id}>
                  {recipe.title}
                </option>
              ))}
            </select>
            <select
              value={servings}
              onChange={(event) => setServings(event.target.value)}
              disabled={saving}
            >
              {Array.from({ length: 40 }, (_, index) => (index + 2) / 4).map(
                (value) => (
                  <option key={value} value={value}>
                    {value.toFixed(2)} porcji
                  </option>
                ),
              )}
            </select>
            <button type="submit" disabled={!recipeId || saving}>
              {saving ? "Dodawanie..." : "Dodaj przepis"}
            </button>
          </form>
          <div className={styles.entryList}>
            {selectedEntries.map((entry) => (
              <article className={styles.entry} key={entry.id}>
                <Link
                  href={`/${entry.recipe.id}`}
                  title={`Otwórz ${entry.recipe.title}`}
                >
                  <img
                    src={entry.recipe.image || "/placeholder.jpg"}
                    alt={entry.recipe.title}
                  />
                </Link>
                <div className={styles.entryContent}>
                  <Link
                    href={`/${entry.recipe.id}`}
                    className={styles.entryTitle}
                  >
                    {entry.recipe.title}
                  </Link>
                  <div className={styles.entryMeta}>
                    <span>{entry.servings.toFixed(2)} porcji</span>
                    <span>{caloriesFor(entry).toFixed(1)} kcal</span>
                    <span>{proteinFor(entry).toFixed(1)} g białka</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeEntry(entry.id)}
                  aria-label={`Usuń ${entry.recipe.title}`}
                >
                  ×
                </button>
              </article>
            ))}
            {!selectedEntries.length && (
              <p className={styles.emptyMessage}>
                Nie zaplanowano jeszcze przepisu na ten dzień.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
