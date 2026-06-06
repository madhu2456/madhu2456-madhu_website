"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import type { PortfolioContentSchema } from "@/lib/cms-schema";
import { FormField, inputClass } from "./shared";

export function SkillsEditor() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<PortfolioContentSchema>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() =>
            append({
              name: `Skill ${fields.length + 1}`,
              category: "",
              proficiency: "intermediate",
              yearsOfExperience: 1,
              updatedAt: new Date().toISOString(),
            })
          }
          className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
        >
          Add skill
        </button>
      </div>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="grid gap-3 rounded-lg border p-4 md:grid-cols-4"
        >
          <FormField label="Name" error={errors.skills?.[index]?.name?.message}>
            <input
              className={inputClass}
              {...register(`skills.${index}.name`)}
            />
          </FormField>
          <FormField
            label="Category"
            error={errors.skills?.[index]?.category?.message}
          >
            <input
              className={inputClass}
              {...register(`skills.${index}.category`)}
            />
          </FormField>
          <FormField
            label="Proficiency"
            error={errors.skills?.[index]?.proficiency?.message}
          >
            <input
              className={inputClass}
              {...register(`skills.${index}.proficiency`)}
            />
          </FormField>
          <FormField
            label="Years"
            error={errors.skills?.[index]?.yearsOfExperience?.message}
          >
            <input
              type="number"
              className={inputClass}
              {...register(`skills.${index}.yearsOfExperience`, {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
            />
          </FormField>
          <div className="md:col-span-4">
            <button
              type="button"
              onClick={() => remove(index)}
              className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
            >
              Remove skill
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
