"use client";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import type { PortfolioContentSchema } from "@/lib/cms-schema";
import {
  AutoResizeTextarea,
  FormField,
  ImageUploadField,
  inputClass,
  parseLines,
  textareaClass,
  toLineText,
} from "./shared";

export function EducationEditor() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<PortfolioContentSchema>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() =>
            append({
              institution: `Institution ${fields.length + 1}`,
              degree: "Degree",
              startDate: new Date().toISOString().slice(0, 10),
              order: fields.length + 1,
              updatedAt: new Date().toISOString(),
            })
          }
          className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
        >
          Add education
        </button>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4 rounded-lg border p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <FormField
              label="Institution"
              error={errors.education?.[index]?.institution?.message}
            >
              <input
                className={inputClass}
                {...register(`education.${index}.institution`)}
              />
            </FormField>
            <FormField
              label="Degree"
              error={errors.education?.[index]?.degree?.message}
            >
              <input
                className={inputClass}
                {...register(`education.${index}.degree`)}
              />
            </FormField>
            <FormField
              label="Field of study"
              error={errors.education?.[index]?.fieldOfStudy?.message}
            >
              <input
                className={inputClass}
                {...register(`education.${index}.fieldOfStudy`)}
              />
            </FormField>
            <FormField
              label="GPA"
              error={errors.education?.[index]?.gpa?.message}
            >
              <input
                className={inputClass}
                {...register(`education.${index}.gpa`)}
              />
            </FormField>
            <FormField
              label="Start date"
              error={errors.education?.[index]?.startDate?.message}
            >
              <input
                type="date"
                className={inputClass}
                {...register(`education.${index}.startDate`)}
              />
            </FormField>
            <FormField
              label="End date"
              error={errors.education?.[index]?.endDate?.message}
            >
              <input
                type="date"
                className={inputClass}
                {...register(`education.${index}.endDate`)}
              />
            </FormField>
            <FormField
              label="Website"
              error={errors.education?.[index]?.website?.message}
            >
              <input
                className={inputClass}
                {...register(`education.${index}.website`)}
              />
            </FormField>
            <FormField
              label="Order"
              error={errors.education?.[index]?.order?.message}
            >
              <input
                type="number"
                className={inputClass}
                {...register(`education.${index}.order`, {
                  valueAsNumber: true,
                })}
              />
            </FormField>
          </div>

          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              {...register(`education.${index}.current`)}
            />
            Current education
          </label>

          <Controller
            control={control}
            name={`education.${index}.logo`}
            render={({ field: { value, onChange } }) => (
              <ImageUploadField
                label="Institution logo"
                value={value}
                onChange={onChange}
              />
            )}
          />

          <FormField
            label="Description"
            error={errors.education?.[index]?.description?.message}
          >
            <Controller
              control={control}
              name={`education.${index}.description`}
              render={({ field }) => (
                <AutoResizeTextarea
                  className={textareaClass}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            />
          </FormField>

          <FormField label="Achievements" hint="One achievement per line.">
            <Controller
              control={control}
              name={`education.${index}.achievements`}
              render={({ field }) => (
                <AutoResizeTextarea
                  className={textareaClass}
                  value={toLineText(field.value)}
                  onChange={(val) => field.onChange(parseLines(val))}
                />
              )}
            />
          </FormField>

          <button
            type="button"
            onClick={() => remove(index)}
            className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
          >
            Remove education
          </button>
        </div>
      ))}
    </div>
  );
}
