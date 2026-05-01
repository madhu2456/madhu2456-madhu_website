"use client";

import { Controller, useFormContext } from "react-hook-form";
import type { PortfolioContentSchema } from "@/lib/cms-schema";
import {
  AutoResizeTextarea,
  FormField,
  inputClass,
  parseLines,
  textareaClass,
  toLineText,
} from "./shared";

export function SiteSettingsEditor() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<PortfolioContentSchema>();

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="Site title"
          error={errors.siteSettings?.siteTitle?.message}
        >
          <input
            className={inputClass}
            {...register("siteSettings.siteTitle")}
          />
        </FormField>
        <FormField
          label="Twitter handle"
          error={errors.siteSettings?.twitterHandle?.message}
        >
          <input
            className={inputClass}
            {...register("siteSettings.twitterHandle")}
          />
        </FormField>
      </div>
      <FormField
        label="Site description"
        error={errors.siteSettings?.siteDescription?.message}
      >
        <Controller
          control={control}
          name="siteSettings.siteDescription"
          render={({ field }) => (
            <AutoResizeTextarea
              className={textareaClass}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </FormField>
      <FormField label="Site keywords" hint="One keyword per line.">
        <Controller
          control={control}
          name="siteSettings.siteKeywords"
          render={({ field }) => (
            <AutoResizeTextarea
              className={textareaClass}
              value={toLineText(field.value)}
              onChange={(val) => field.onChange(parseLines(val))}
            />
          )}
        />
      </FormField>
    </div>
  );
}
