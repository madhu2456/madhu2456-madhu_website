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

export function ServicesEditor() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<PortfolioContentSchema>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() =>
            append({
              title: `Service ${fields.length + 1}`,
              slug: `service-${fields.length + 1}`,
              order: fields.length + 1,
              updatedAt: new Date().toISOString(),
            })
          }
          className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
        >
          Add service
        </button>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4 rounded-lg border p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <FormField
              label="Title"
              error={errors.services?.[index]?.title?.message}
            >
              <input
                className={inputClass}
                {...register(`services.${index}.title`)}
              />
            </FormField>
            <FormField
              label="Slug"
              error={errors.services?.[index]?.slug?.message}
            >
              <input
                className={inputClass}
                {...register(`services.${index}.slug`)}
              />
            </FormField>
            <FormField
              label="Timeline"
              error={errors.services?.[index]?.timeline?.message}
            >
              <input
                className={inputClass}
                {...register(`services.${index}.timeline`)}
              />
            </FormField>
            <FormField
              label="Order"
              error={errors.services?.[index]?.order?.message}
            >
              <input
                type="number"
                className={inputClass}
                {...register(`services.${index}.order`, {
                  valueAsNumber: true,
                })}
              />
            </FormField>
          </div>

          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              {...register(`services.${index}.featured`)}
            />
            Featured service
          </label>

          <Controller
            control={control}
            name={`services.${index}.icon`}
            render={({ field: { value, onChange } }) => (
              <ImageUploadField
                label="Service icon"
                value={value}
                onChange={onChange}
              />
            )}
          />

          <FormField
            label="Short description"
            error={errors.services?.[index]?.shortDescription?.message}
          >
            <Controller
              control={control}
              name={`services.${index}.shortDescription`}
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
            label="Full description"
            error={errors.services?.[index]?.fullDescription?.message}
          >
            <Controller
              control={control}
              name={`services.${index}.fullDescription`}
              render={({ field }) => (
                <AutoResizeTextarea
                  className={textareaClass}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            />
          </FormField>

          <FormField label="Features" hint="One feature per line.">
            <Controller
              control={control}
              name={`services.${index}.features`}
              render={({ field }) => (
                <AutoResizeTextarea
                  className={textareaClass}
                  value={toLineText(field.value)}
                  onChange={(val) => field.onChange(parseLines(val))}
                />
              )}
            />
          </FormField>

          <FormField label="Deliverables" hint="One deliverable per line.">
            <Controller
              control={control}
              name={`services.${index}.deliverables`}
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
              name={`services.${index}.technologies`}
              render={({ field }) => (
                <AutoResizeTextarea
                  className={textareaClass}
                  value={toTechnologyLines(field.value)}
                  onChange={(val) => field.onChange(parseTechnologies(val))}
                />
              )}
            />
          </FormField>

          <div className="rounded-md border p-3">
            <h4 className="mb-3 font-medium">Pricing</h4>
            <div className="grid gap-3 md:grid-cols-3">
              <FormField
                label="Starting price"
                error={
                  errors.services?.[index]?.pricing?.startingPrice?.message
                }
              >
                <input
                  type="number"
                  className={inputClass}
                  {...register(`services.${index}.pricing.startingPrice`, {
                    valueAsNumber: true,
                  })}
                />
              </FormField>
              <FormField
                label="Price type"
                error={errors.services?.[index]?.pricing?.priceType?.message}
              >
                <select
                  className={inputClass}
                  {...register(`services.${index}.pricing.priceType`)}
                >
                  <option value="">Not set</option>
                  <option value="hourly">Hourly</option>
                  <option value="project">Project</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom</option>
                </select>
              </FormField>
              <FormField
                label="Pricing note"
                error={errors.services?.[index]?.pricing?.description?.message}
              >
                <input
                  className={inputClass}
                  {...register(`services.${index}.pricing.description`)}
                />
              </FormField>
            </div>
          </div>

          <button
            type="button"
            onClick={() => remove(index)}
            className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
          >
            Remove service
          </button>
        </div>
      ))}
    </div>
  );
}
