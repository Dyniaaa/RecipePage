"use client";

import { useState } from "react";
import styles from "./StepsSection.module.scss";

interface Step {
  id: string;
  text: string;
}

export default function StepsSection({
  steps,
  setSteps,
  error,
  disabled = false,
}: {
  steps: Step[];
  setSteps: React.Dispatch<React.SetStateAction<Step[]>>;
  error?: string;
  disabled?: boolean;
}) {
  const handleAddStep = () => {
    const newId = Date.now().toString();
    setSteps([...steps, { id: newId, text: "" }]);
  };

  const handleRemoveStep = (id: string) => {
    if (steps.length > 1) {
      setSteps(steps.filter((step) => step.id !== id));
    }
  };

  const handleStepChange = (id: string, text: string) => {
    setSteps(steps.map((step) => (step.id === id ? { ...step, text } : step)));
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Instrukcje</h2>

      <div className={styles.stepsContainer}>
        {steps.map((step, index) => (
          <div className={styles.stepRow} key={step.id}>
            <div className={styles.stepNumber}>{index + 1}</div>
            <textarea
              className={`${styles.textarea} ${error && !step.text.trim() ? styles.inputError : ""}`}
              placeholder={`Opisz krok ${index + 1}...`}
              value={step.text}
              onChange={(e) => handleStepChange(step.id, e.target.value)}
            />
            {steps.length > 1 && (
              <button
                className={styles.removeButton}
                type="button"
                onClick={() => handleRemoveStep(step.id)}
                disabled={disabled}
                title="Usuń krok"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {error && <p className={styles.error} role="alert">{error}</p>}

      <button
        className={styles.addButton}
        type="button"
        onClick={handleAddStep}
        disabled={disabled}
      >
        <span className={styles.plus}>+</span> Dodaj Krok
      </button>
    </section>
  );
}
