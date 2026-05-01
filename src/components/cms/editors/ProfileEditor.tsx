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

export function ProfileEditor() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<PortfolioContentSchema>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "profile.stats",
  });

  const socialLinksKeys = [
    "github",
    "linkedin",
    "twitter",
    "website",
    "medium",
    "devto",
    "youtube",
    "stackoverflow",
  ] as const;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="First name"
          error={errors.profile?.firstName?.message}
        >
          <input className={inputClass} {...register("profile.firstName")} />
        </FormField>
        <FormField label="Last name" error={errors.profile?.lastName?.message}>
          <input className={inputClass} {...register("profile.lastName")} />
        </FormField>
        <FormField label="Headline" error={errors.profile?.headline?.message}>
          <input className={inputClass} {...register("profile.headline")} />
        </FormField>
        <FormField
          label="Headline static text"
          error={errors.profile?.headlineStaticText?.message}
        >
          <input
            className={inputClass}
            {...register("profile.headlineStaticText")}
          />
        </FormField>
        <FormField
          label="Animation duration (ms)"
          error={errors.profile?.headlineAnimationDuration?.message}
        >
          <input
            type="number"
            className={inputClass}
            {...register("profile.headlineAnimationDuration", {
              valueAsNumber: true,
            })}
          />
        </FormField>
        <FormField
          label="Years of experience"
          error={errors.profile?.yearsOfExperience?.message}
        >
          <input
            type="number"
            className={inputClass}
            {...register("profile.yearsOfExperience", { valueAsNumber: true })}
          />
        </FormField>
        <FormField label="Email" error={errors.profile?.email?.message}>
          <input
            type="email"
            className={inputClass}
            {...register("profile.email")}
          />
        </FormField>
        <FormField label="Phone" error={errors.profile?.phone?.message}>
          <input className={inputClass} {...register("profile.phone")} />
        </FormField>
        <FormField label="Location" error={errors.profile?.location?.message}>
          <input className={inputClass} {...register("profile.location")} />
        </FormField>
        <FormField
          label="Availability"
          error={errors.profile?.availability?.message}
        >
          <select className={inputClass} {...register("profile.availability")}>
            <option value="available">Available</option>
            <option value="open">Open</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </FormField>
      </div>

      <FormField label="Short bio" error={errors.profile?.shortBio?.message}>
        <Controller
          control={control}
          name="profile.shortBio"
          render={({ field }) => (
            <AutoResizeTextarea
              className={textareaClass}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </FormField>

      <FormField label="Headline animated words" hint="One item per line.">
        <Controller
          control={control}
          name="profile.headlineAnimatedWords"
          render={({ field }) => (
            <AutoResizeTextarea
              className={textareaClass}
              value={toLineText(field.value)}
              onChange={(val) => field.onChange(parseLines(val))}
            />
          )}
        />
      </FormField>

      <FormField label="Full bio paragraphs" hint="One paragraph per line.">
        <Controller
          control={control}
          name="profile.fullBioParagraphs"
          render={({ field }) => (
            <AutoResizeTextarea
              className={textareaClass}
              value={toLineText(field.value)}
              onChange={(val) => field.onChange(parseLines(val))}
            />
          )}
        />
      </FormField>

      <Controller
        control={control}
        name="profile.profileImage"
        render={({ field }) => (
          <ImageUploadField
            label="Profile image"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <div className="space-y-3 rounded-lg border p-4">
        <h3 className="font-semibold">Social links</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {socialLinksKeys.map((key) => (
            <FormField
              key={key}
              label={key}
              error={errors.profile?.socialLinks?.[key]?.message}
            >
              <input
                className={inputClass}
                {...register(`profile.socialLinks.${key}`)}
              />
            </FormField>
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Stats</h3>
          <button
            type="button"
            onClick={() => append({ label: "New Stat", value: "" })}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
          >
            Add stat
          </button>
        </div>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid gap-3 rounded-md border p-3 md:grid-cols-[1fr_1fr_auto]"
          >
            <FormField
              label="Label"
              error={errors.profile?.stats?.[index]?.label?.message}
            >
              <input
                className={inputClass}
                {...register(`profile.stats.${index}.label`)}
                placeholder="Label"
              />
            </FormField>
            <FormField
              label="Value"
              error={errors.profile?.stats?.[index]?.value?.message}
            >
              <input
                className={inputClass}
                {...register(`profile.stats.${index}.value`)}
                placeholder="Value"
              />
            </FormField>
            <div className="flex items-end pb-0.5">
              <button
                type="button"
                onClick={() => remove(index)}
                className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
