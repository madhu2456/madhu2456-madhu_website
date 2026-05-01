"use client";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import type { PortfolioContentSchema } from "@/lib/cms-schema";
import {
  AutoResizeTextarea,
  FormField,
  ImageUploadField,
  inputClass,
  parseLines,
  parseTechnologies,
  textareaClass,
  toLineText,
  toTechnologyLines,
} from "./shared";

export function ExperiencesEditor() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<PortfolioContentSchema>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() =>
            append({
              company: `Company ${fields.length + 1}`,
              position: "Role",
              startDate: new Date().toISOString().slice(0, 10),
              order: fields.length + 1,
              updatedAt: new Date().toISOString(),
            })
          }
          className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
        >
          Add experience
        </button>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4 rounded-lg border p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <FormField
              label="Company"
              error={errors.experiences?.[index]?.company?.message}
            >
              <input
                className={inputClass}
                {...register(`experiences.${index}.company`)}
              />
            </FormField>
            <FormField
              label="Position"
              error={errors.experiences?.[index]?.position?.message}
            >
              <input
                className={inputClass}
                {...register(`experiences.${index}.position`)}
              />
            </FormField>
            <FormField
              label="Employment type"
              error={errors.experiences?.[index]?.employmentType?.message}
            >
              <input
                className={inputClass}
                {...register(`experiences.${index}.employmentType`)}
              />
            </FormField>
            <FormField
              label="Location"
              error={errors.experiences?.[index]?.location?.message}
            >
              <input
                className={inputClass}
                {...register(`experiences.${index}.location`)}
              />
            </FormField>
            <FormField
              label="Start date"
              error={errors.experiences?.[index]?.startDate?.message}
            >
              <input
                type="date"
                className={inputClass}
                {...register(`experiences.${index}.startDate`)}
              />
            </FormField>
            <FormField
              label="End date"
              error={errors.experiences?.[index]?.endDate?.message}
            >
              <input
                type="date"
                className={inputClass}
                {...register(`experiences.${index}.endDate`)}
              />
            </FormField>
            <FormField
              label="Company website"
              error={errors.experiences?.[index]?.companyWebsite?.message}
            >
              <input
                className={inputClass}
                {...register(`experiences.${index}.companyWebsite`)}
              />
            </FormField>
            <FormField
              label="Order"
              error={errors.experiences?.[index]?.order?.message}
            >
              <input
                type="number"
                className={inputClass}
                {...register(`experiences.${index}.order`, {
                  valueAsNumber: true,
                })}
              />
            </FormField>
          </div>

          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              {...register(`experiences.${index}.current`)}
            />
            Current role
          </label>

          <Controller
            control={control}
            name={`experiences.${index}.companyLogo`}
            render={({ field: { value, onChange } }) => (
              <ImageUploadField
                label="Company logo"
                value={value}
                onChange={onChange}
              />
            )}
          />

          <FormField
            label="Description"
            error={errors.experiences?.[index]?.description?.message}
          >
            <Controller
              control={control}
              name={`experiences.${index}.description`}
              render={({ field }) => (
                <AutoResizeTextarea
                  className={textareaClass}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            />
          </FormField>

          <FormField
            label="Responsibilities"
            hint="One responsibility per line."
          >
            <Controller
              control={control}
              name={`experiences.${index}.responsibilities`}
              render={({ field }) => (
                <AutoResizeTextarea
                  className={textareaClass}
                  value={toLineText(field.value)}
                  onChange={(val) => field.onChange(parseLines(val))}
                />
              )}
            />
          </FormField>

          <FormField label="Achievements" hint="One achievement per line.">
            <Controller
              control={control}
              name={`experiences.${index}.achievements`}
              render={({ field }) => (
                <AutoResizeTextarea
                  className={textareaClass}
                  value={toLineText(field.value)}
                  onChange={(val) => field.onChange(parseLines(val))}
                />
              )}
            />
          </FormField>

          <FormField
            label="Technologies"
            hint="One per line as name|category|color."
          >
            <Controller
              control={control}
              name={`experiences.${index}.technologies`}
              render={({ field }) => (
                <AutoResizeTextarea
                  className={textareaClass}
                  value={toTechnologyLines(field.value)}
                  onChange={(val) => field.onChange(parseTechnologies(val))}
                />
              )}
            />
          </FormField>

          <button
            type="button"
            onClick={() => remove(index)}
            className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
          >
            Remove experience
          </button>
        </div>
      ))}
    </div>
  );
}
