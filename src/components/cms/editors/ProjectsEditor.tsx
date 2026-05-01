"use client";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import type { PortfolioContentSchema } from "@/lib/cms-schema";
import {
  AutoResizeTextarea,
  FormField,
  ImageUploadField,
  inputClass,
  parseCitations,
  parseImpactMetrics,
  parseTechnologies,
  textareaClass,
  toCitationLines,
  toImpactMetricLines,
  toTechnologyLines,
} from "./shared";

export function ProjectsEditor() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<PortfolioContentSchema>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() =>
            append({
              title: `Project ${fields.length + 1}`,
              slug: `project-${fields.length + 1}`,
              order: fields.length + 1,
              updatedAt: new Date().toISOString(),
            })
          }
          className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
        >
          Add project
        </button>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4 rounded-lg border p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <FormField
              label="Title"
              error={errors.projects?.[index]?.title?.message}
            >
              <input
                className={inputClass}
                {...register(`projects.${index}.title`)}
              />
            </FormField>
            <FormField
              label="Slug"
              error={errors.projects?.[index]?.slug?.message}
            >
              <input
                className={inputClass}
                {...register(`projects.${index}.slug`)}
              />
            </FormField>
            <FormField
              label="Category"
              error={errors.projects?.[index]?.category?.message}
            >
              <input
                className={inputClass}
                {...register(`projects.${index}.category`)}
              />
            </FormField>
            <FormField
              label="Order"
              error={errors.projects?.[index]?.order?.message}
            >
              <input
                type="number"
                className={inputClass}
                {...register(`projects.${index}.order`, {
                  valueAsNumber: true,
                })}
              />
            </FormField>
            <FormField
              label="Live URL"
              error={errors.projects?.[index]?.liveUrl?.message}
            >
              <input
                className={inputClass}
                {...register(`projects.${index}.liveUrl`)}
              />
            </FormField>
            <FormField
              label="GitHub URL"
              error={errors.projects?.[index]?.githubUrl?.message}
            >
              <input
                className={inputClass}
                {...register(`projects.${index}.githubUrl`)}
              />
            </FormField>
            <FormField
              label="Cover image alt"
              error={errors.projects?.[index]?.coverImageAlt?.message}
            >
              <input
                className={inputClass}
                {...register(`projects.${index}.coverImageAlt`)}
              />
            </FormField>
          </div>

          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              {...register(`projects.${index}.featured`)}
            />
            Featured project
          </label>

          <Controller
            control={control}
            name={`projects.${index}.coverImage`}
            render={({ field: { value, onChange } }) => (
              <ImageUploadField
                label="Cover image"
                value={value}
                onChange={onChange}
              />
            )}
          />

          <FormField
            label="Tagline"
            error={errors.projects?.[index]?.tagline?.message}
          >
            <Controller
              control={control}
              name={`projects.${index}.tagline`}
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
            label="Impact summary"
            error={errors.projects?.[index]?.impactSummary?.message}
          >
            <Controller
              control={control}
              name={`projects.${index}.impactSummary`}
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
            label="Problem statement"
            error={errors.projects?.[index]?.problemStatement?.message}
          >
            <Controller
              control={control}
              name={`projects.${index}.problemStatement`}
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
            label="Solution approach"
            error={errors.projects?.[index]?.solutionApproach?.message}
          >
            <Controller
              control={control}
              name={`projects.${index}.solutionApproach`}
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
            label="Technologies"
            hint="One per line as name|category|color."
          >
            <Controller
              control={control}
              name={`projects.${index}.technologies`}
              render={({ field }) => (
                <AutoResizeTextarea
                  className={textareaClass}
                  value={toTechnologyLines(field.value)}
                  onChange={(val) => field.onChange(parseTechnologies(val))}
                />
              )}
            />
          </FormField>

          <FormField label="Impact metrics" hint="One per line as label|value.">
            <Controller
              control={control}
              name={`projects.${index}.impactMetrics`}
              render={({ field }) => (
                <AutoResizeTextarea
                  className={textareaClass}
                  value={toImpactMetricLines(field.value)}
                  onChange={(val) => field.onChange(parseImpactMetrics(val))}
                />
              )}
            />
          </FormField>

          <FormField label="Citations" hint="One per line as label|url.">
            <Controller
              control={control}
              name={`projects.${index}.citations`}
              render={({ field }) => (
                <AutoResizeTextarea
                  className={textareaClass}
                  value={toCitationLines(field.value)}
                  onChange={(val) => field.onChange(parseCitations(val))}
                />
              )}
            />
          </FormField>

          <button
            type="button"
            onClick={() => remove(index)}
            className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
          >
            Remove project
          </button>
        </div>
      ))}
    </div>
  );
}
