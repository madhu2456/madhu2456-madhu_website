"use client";

import { useState } from "react";
import {
  Controller,
  type FieldErrors,
  type FieldValues,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import {
  AutoResizeTextarea,
  FormField,
  inputClass,
  parseLines,
  textareaClass,
  toLineText,
} from "./shared";

const readPath = (value: unknown, path: string[]): unknown => {
  return path.reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[segment];
  }, value);
};

const errorMessage = (
  errors: FieldErrors<FieldValues>,
  path: string,
): string | undefined => {
  const message = readPath(errors, path.split("."));
  return typeof message === "string" ? message : undefined;
};

function SeoEditor({ prefix }: { prefix: string }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="grid gap-3 rounded-lg border p-4 bg-muted/20 md:grid-cols-2">
      <div className="md:col-span-2">
        <h4 className="font-semibold text-sm mb-2">SEO Settings</h4>
      </div>
      <FormField
        label="Title"
        error={errorMessage(errors, `${prefix}.seo.title.message`)}
      >
        <input className={inputClass} {...register(`${prefix}.seo.title`)} />
      </FormField>
      <FormField
        label="Canonical Path"
        error={errorMessage(errors, `${prefix}.seo.canonicalPath.message`)}
      >
        <input
          className={inputClass}
          {...register(`${prefix}.seo.canonicalPath`)}
        />
      </FormField>
      <div className="md:col-span-2">
        <FormField
          label="Description"
          error={errorMessage(errors, `${prefix}.seo.description.message`)}
        >
          <textarea
            className={inputClass}
            rows={2}
            {...register(`${prefix}.seo.description`)}
          />
        </FormField>
      </div>
    </div>
  );
}

function HeroEditor({ prefix }: { prefix: string }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="grid gap-3 rounded-lg border p-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <h4 className="font-semibold text-sm mb-2">Hero Section</h4>
      </div>
      <FormField
        label="Hero Title"
        error={errorMessage(errors, `${prefix}.heroTitle.message`)}
      >
        <input className={inputClass} {...register(`${prefix}.heroTitle`)} />
      </FormField>
      <FormField
        label="Eyebrow"
        error={errorMessage(errors, `${prefix}.eyebrow.message`)}
      >
        <input className={inputClass} {...register(`${prefix}.eyebrow`)} />
      </FormField>
      <div className="md:col-span-2">
        <FormField
          label="Subtitle"
          error={errorMessage(errors, `${prefix}.heroSubtitle.message`)}
        >
          <input
            className={inputClass}
            {...register(`${prefix}.heroSubtitle`)}
          />
        </FormField>
      </div>
      <div className="md:col-span-2">
        <FormField
          label="Intro Paragraphs (One per line)"
          error={errorMessage(errors, `${prefix}.introParagraphs.message`)}
        >
          <Controller
            control={control}
            name={`${prefix}.introParagraphs`}
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
    </div>
  );
}

function HomeEditor() {
  const { register, control } = useFormContext();
  const prefix = "pageContent.home";

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control,
    name: `${prefix}.faqItems`,
  });

  return (
    <div className="space-y-6">
      <SeoEditor prefix={prefix} />
      <HeroEditor prefix={prefix} />

      <div className="grid gap-3 rounded-lg border p-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <h4 className="font-semibold text-sm mb-2">Home Specific</h4>
        </div>
        <FormField label="Availability Text">
          <input
            className={inputClass}
            {...register(`${prefix}.heroAvailabilityText`)}
          />
        </FormField>
        <FormField label="Worked At Label">
          <input
            className={inputClass}
            {...register(`${prefix}.workedAtLabel`)}
          />
        </FormField>
        <div className="md:col-span-2">
          <FormField label="Direct Answer Title">
            <input
              className={inputClass}
              {...register(`${prefix}.directAnswer.title`)}
            />
          </FormField>
        </div>
        <div className="md:col-span-2">
          <FormField label="Direct Answer Paragraphs (One per line)">
            <Controller
              control={control}
              name={`${prefix}.directAnswer.paragraphs`}
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
      </div>

      <div className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm">FAQ Items</h4>
          <button
            type="button"
            onClick={() => appendFaq({ question: "", answer: "" })}
            className="text-xs px-2 py-1 border rounded"
          >
            Add FAQ
          </button>
        </div>
        {faqFields.map((field, index) => (
          <div key={field.id} className="grid gap-3 border-t pt-3">
            <FormField label={`Question ${index + 1}`}>
              <input
                className={inputClass}
                {...register(`${prefix}.faqItems.${index}.question`)}
              />
            </FormField>
            <FormField label={`Answer ${index + 1}`}>
              <textarea
                className={inputClass}
                rows={2}
                {...register(`${prefix}.faqItems.${index}.answer`)}
              />
            </FormField>
            <button
              type="button"
              onClick={() => removeFaq(index)}
              className="text-xs text-red-500 text-left"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CredentialsEditor() {
  const { register, control } = useFormContext();
  const prefix = "pageContent.credentials";

  const {
    fields: proofFields,
    append: appendProof,
    remove: removeProof,
  } = useFieldArray({ control, name: `${prefix}.proofLinks` });
  const {
    fields: awardsFields,
    append: appendAward,
    remove: removeAward,
  } = useFieldArray({ control, name: `${prefix}.awards` });
  const {
    fields: profileFields,
    append: appendProfile,
    remove: removeProfile,
  } = useFieldArray({ control, name: `${prefix}.externalProfiles` });

  return (
    <div className="space-y-6">
      <SeoEditor prefix={prefix} />
      <HeroEditor prefix={prefix} />

      <div className="grid gap-3 rounded-lg border p-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <h4 className="font-semibold text-sm mb-2">Resume Callout</h4>
        </div>
        <FormField label="Title">
          <input
            className={inputClass}
            {...register(`${prefix}.resumeCallout.title`)}
          />
        </FormField>
        <FormField label="Href">
          <input
            className={inputClass}
            {...register(`${prefix}.resumeCallout.href`)}
          />
        </FormField>
        <div className="md:col-span-2">
          <FormField label="Description">
            <input
              className={inputClass}
              {...register(`${prefix}.resumeCallout.description`)}
            />
          </FormField>
        </div>
      </div>

      <div className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm">Proof Links</h4>
          <button
            type="button"
            onClick={() =>
              appendProof({
                type: "Credential",
                proof: "",
                linkText: "",
                linkUrl: "",
              })
            }
            className="text-xs px-2 py-1 border rounded"
          >
            Add Proof Link
          </button>
        </div>
        {proofFields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t pt-3"
          >
            <FormField label="Type">
              <select
                className={inputClass}
                {...register(`${prefix}.proofLinks.${index}.type`)}
              >
                <option value="Credential">Credential</option>
                <option value="Award">Award</option>
                <option value="Project">Project</option>
                <option value="Profile">Profile</option>
              </select>
            </FormField>
            <FormField label="Proof Text">
              <input
                className={inputClass}
                {...register(`${prefix}.proofLinks.${index}.proof`)}
              />
            </FormField>
            <FormField label="Link Text">
              <input
                className={inputClass}
                {...register(`${prefix}.proofLinks.${index}.linkText`)}
              />
            </FormField>
            <FormField label="Link URL">
              <input
                className={inputClass}
                {...register(`${prefix}.proofLinks.${index}.linkUrl`)}
              />
            </FormField>
            <div className="col-span-2 md:col-span-4">
              <button
                type="button"
                onClick={() => removeProof(index)}
                className="text-xs text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm">Awards</h4>
          <button
            type="button"
            onClick={() =>
              appendAward({ title: "", organization: "", description: "" })
            }
            className="text-xs px-2 py-1 border rounded"
          >
            Add Award
          </button>
        </div>
        {awardsFields.map((field, index) => (
          <div key={field.id} className="grid gap-3 border-t pt-3">
            <FormField label="Title">
              <input
                className={inputClass}
                {...register(`${prefix}.awards.${index}.title`)}
              />
            </FormField>
            <FormField label="Organization">
              <input
                className={inputClass}
                {...register(`${prefix}.awards.${index}.organization`)}
              />
            </FormField>
            <FormField label="Description">
              <textarea
                className={inputClass}
                rows={2}
                {...register(`${prefix}.awards.${index}.description`)}
              />
            </FormField>
            <button
              type="button"
              onClick={() => removeAward(index)}
              className="text-xs text-red-500 text-left"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm">External Profiles</h4>
          <button
            type="button"
            onClick={() =>
              appendProfile({ name: "", url: "", description: "" })
            }
            className="text-xs px-2 py-1 border rounded"
          >
            Add Profile
          </button>
        </div>
        {profileFields.map((field, index) => (
          <div key={field.id} className="grid gap-3 border-t pt-3">
            <FormField label="Name">
              <input
                className={inputClass}
                {...register(`${prefix}.externalProfiles.${index}.name`)}
              />
            </FormField>
            <FormField label="URL">
              <input
                className={inputClass}
                {...register(`${prefix}.externalProfiles.${index}.url`)}
              />
            </FormField>
            <FormField label="Description">
              <textarea
                className={inputClass}
                rows={2}
                {...register(`${prefix}.externalProfiles.${index}.description`)}
              />
            </FormField>
            <button
              type="button"
              onClick={() => removeProfile(index)}
              className="text-xs text-red-500 text-left"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactEditor() {
  const prefix = "pageContent.contact";
  const { register, control } = useFormContext();

  return (
    <div className="space-y-6">
      <SeoEditor prefix={prefix} />
      <HeroEditor prefix={prefix} />
      <div className="grid gap-3 rounded-lg border p-4">
        <h4 className="font-semibold text-sm mb-2">Contact Specific</h4>
        <FormField label="Best Fit Areas (One per line)">
          <Controller
            control={control}
            name={`${prefix}.bestFitAreas`}
            render={({ field }) => (
              <AutoResizeTextarea
                className={textareaClass}
                value={toLineText(field.value)}
                onChange={(val) => field.onChange(parseLines(val))}
              />
            )}
          />
        </FormField>
        <FormField label="Response Time Text">
          <input
            className={inputClass}
            {...register(`${prefix}.responseTimeText`)}
          />
        </FormField>
      </div>
    </div>
  );
}

export function PageContentEditor() {
  const [activeTab, setActiveTab] = useState<
    | "home"
    | "profile"
    | "servicesIndex"
    | "caseStudiesIndex"
    | "guidesIndex"
    | "credentials"
    | "contact"
  >("home");

  const tabs = [
    { id: "home", label: "Home" },
    { id: "profile", label: "Profile" },
    { id: "servicesIndex", label: "Services" },
    { id: "caseStudiesIndex", label: "Case Studies" },
    { id: "guidesIndex", label: "Guides" },
    { id: "credentials", label: "Credentials" },
    { id: "contact", label: "Contact" },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm rounded-t-lg border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary font-bold text-foreground bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in duration-200">
        {activeTab === "home" && <HomeEditor />}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <SeoEditor prefix="pageContent.profile" />
            <HeroEditor prefix="pageContent.profile" />
            {/* Core Stack Groups could be managed here if needed */}
          </div>
        )}
        {activeTab === "servicesIndex" && (
          <div className="space-y-6">
            <SeoEditor prefix="pageContent.servicesIndex" />
            <HeroEditor prefix="pageContent.servicesIndex" />
          </div>
        )}
        {activeTab === "caseStudiesIndex" && (
          <div className="space-y-6">
            <SeoEditor prefix="pageContent.caseStudiesIndex" />
            <HeroEditor prefix="pageContent.caseStudiesIndex" />
          </div>
        )}
        {activeTab === "guidesIndex" && (
          <div className="space-y-6">
            <SeoEditor prefix="pageContent.guidesIndex" />
            <HeroEditor prefix="pageContent.guidesIndex" />
          </div>
        )}
        {activeTab === "credentials" && <CredentialsEditor />}
        {activeTab === "contact" && <ContactEditor />}
      </div>
    </div>
  );
}
