"use client";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import type { PortfolioContentSchema } from "@/lib/cms-schema";
import {
  AutoResizeTextarea,
  FormField,
  ImageUploadField,
  inputClass,
  parseTechnologies,
  textareaClass,
  toTechnologyLines,
} from "./shared";

export function CertificationsEditor() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<PortfolioContentSchema>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "certifications",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() =>
            append({
              name: `Certification ${fields.length + 1}`,
              order: fields.length + 1,
              updatedAt: new Date().toISOString(),
            })
          }
          className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
        >
          Add certification
        </button>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4 rounded-lg border p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <FormField
              label="Name"
              error={errors.certifications?.[index]?.name?.message}
            >
              <input
                className={inputClass}
                {...register(`certifications.${index}.name`)}
              />
            </FormField>
            <FormField
              label="Issuer"
              error={errors.certifications?.[index]?.issuer?.message}
            >
              <input
                className={inputClass}
                {...register(`certifications.${index}.issuer`)}
              />
            </FormField>
            <FormField
              label="Issue date"
              error={errors.certifications?.[index]?.issueDate?.message}
            >
              <input
                type="date"
                className={inputClass}
                {...register(`certifications.${index}.issueDate`)}
              />
            </FormField>
            <FormField
              label="Expiry date"
              error={errors.certifications?.[index]?.expiryDate?.message}
            >
              <input
                type="date"
                className={inputClass}
                {...register(`certifications.${index}.expiryDate`)}
              />
            </FormField>
            <FormField
              label="Credential ID"
              error={errors.certifications?.[index]?.credentialId?.message}
            >
              <input
                className={inputClass}
                {...register(`certifications.${index}.credentialId`)}
              />
            </FormField>
            <FormField
              label="Credential URL"
              error={errors.certifications?.[index]?.credentialUrl?.message}
            >
              <input
                className={inputClass}
                {...register(`certifications.${index}.credentialUrl`)}
              />
            </FormField>
            <FormField
              label="Order"
              error={errors.certifications?.[index]?.order?.message}
            >
              <input
                type="number"
                className={inputClass}
                {...register(`certifications.${index}.order`, {
                  valueAsNumber: true,
                })}
              />
            </FormField>
          </div>

          <Controller
            control={control}
            name={`certifications.${index}.logo`}
            render={({ field: { value, onChange } }) => (
              <ImageUploadField
                label="Certificate logo"
                value={value}
                onChange={onChange}
              />
            )}
          />

          <FormField
            label="Description"
            error={errors.certifications?.[index]?.description?.message}
          >
            <Controller
              control={control}
              name={`certifications.${index}.description`}
              render={({ field }) => (
                <AutoResizeTextarea
                  className={textareaClass}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            />
          </FormField>

          <FormField label="Skills" hint="One per line as name|category|color.">
            <Controller
              control={control}
              name={`certifications.${index}.skills`}
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
            Remove certification
          </button>
        </div>
      ))}
    </div>
  );
}
