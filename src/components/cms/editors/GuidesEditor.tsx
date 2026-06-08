"use client";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import type { PortfolioContentSchema } from "@/lib/cms-schema";
import {
  AutoResizeTextarea,
  FormField,
  ImageUploadField,
  inputClass,
  textareaClass,
  parseLines,
  toLineText,
} from "./shared";

function QualityWarning({ message }: { message: string }) {
  return (
    <div className="text-amber-600 bg-amber-50 px-2 py-1 text-xs rounded border border-amber-200 mt-1">
      ⚠️ {message}
    </div>
  );
}

function GuideItemEditor({
  index,
  remove,
}: {
  index: number;
  remove: () => void;
}) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<any>();

  const guide = watch(`guides.${index}`);
  const isPublished = guide?.status === "published";
  const isBenchmarkResults = guide?.guideType === "benchmark-results";

  const {
    fields: citationFields,
    append: appendCitation,
    remove: removeCitation,
  } = useFieldArray({
    control,
    name: `guides.${index}.citations`,
  });

  const {
    fields: artifactFields,
    append: appendArtifact,
    remove: removeArtifact,
  } = useFieldArray({
    control,
    name: `guides.${index}.artifacts`,
  });

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control,
    name: `guides.${index}.faqs`,
  });

  const warnings = [];
  if (!guide?.citations || guide.citations.length === 0) {
    warnings.push("No citations provided.");
  }
  if (
    (!guide?.relatedServiceSlugs || guide.relatedServiceSlugs.length === 0) &&
    (!guide?.relatedProjectSlugs || guide.relatedProjectSlugs.length === 0)
  ) {
    warnings.push("Missing related service or project.");
  }
  if (guide?.coverImage && !guide.coverImageAlt) {
    warnings.push("Missing cover-image alt text.");
  }
  if (
    isBenchmarkResults &&
    !guide?.benchmarkDetails?.repositoryUrl &&
    !guide?.benchmarkDetails?.rawResultsUrl
  ) {
    warnings.push(
      "Benchmark-results guide missing reproducible artifacts (repositoryUrl or rawResultsUrl).",
    );
  }
  if (
    guide?.seoTitle &&
    (guide.seoTitle.length < 30 || guide.seoTitle.length > 60)
  ) {
    warnings.push(
      `SEO title is outside recommended range (30-60 chars). Currently: ${guide.seoTitle.length}`,
    );
  }
  if (
    guide?.seoDescription &&
    (guide.seoDescription.length < 120 || guide.seoDescription.length > 160)
  ) {
    warnings.push(
      `SEO description is outside recommended range (120-160 chars). Currently: ${guide.seoDescription.length}`,
    );
  }

  const errs = (errors.guides as any)?.[index];

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">
          {guide?.title || "Untitled Guide"}
        </h3>
        <span
          className={`px-2 py-1 text-xs rounded uppercase font-semibold ${isPublished ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
        >
          {guide?.status || "draft"}
        </span>
      </div>

      {warnings.length > 0 && (
        <div className="bg-amber-50/50 p-2 rounded border border-amber-100">
          <p className="text-xs font-semibold text-amber-800 mb-1">
            Quality Warnings (does not block drafts):
          </p>
          {warnings.map((w, i) => (
            <QualityWarning key={i} message={w} />
          ))}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <FormField label="Title" error={errs?.title?.message}>
          <input
            className={inputClass}
            {...register(`guides.${index}.title`)}
          />
        </FormField>
        <FormField label="Slug" error={errs?.slug?.message}>
          <input className={inputClass} {...register(`guides.${index}.slug`)} />
        </FormField>
        <FormField label="Type" error={errs?.guideType?.message}>
          <select
            className={inputClass}
            {...register(`guides.${index}.guideType`)}
          >
            <option value="guide">Guide</option>
            <option value="framework">Framework</option>
            <option value="benchmark-methodology">Benchmark Methodology</option>
            <option value="benchmark-results">Benchmark Results</option>
          </select>
        </FormField>
        <FormField label="Status" error={errs?.status?.message}>
          <select
            className={inputClass}
            {...register(`guides.${index}.status`)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </FormField>
        <FormField label="Published At" error={errs?.publishedAt?.message}>
          <input
            type="datetime-local"
            className={inputClass}
            {...register(`guides.${index}.publishedAt`)}
          />
        </FormField>
        <label className="inline-flex items-center gap-2 text-sm md:col-span-2">
          <input type="checkbox" {...register(`guides.${index}.featured`)} />
          Featured guide
        </label>
      </div>

      <FormField label="Summary" error={errs?.summary?.message}>
        <Controller
          control={control}
          name={`guides.${index}.summary`}
          render={({ field }) => (
            <AutoResizeTextarea
              className={textareaClass}
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />
      </FormField>

      <div className="grid gap-3 md:grid-cols-2">
        <FormField label="Primary Topic" error={errs?.primaryTopic?.message}>
          <input
            className={inputClass}
            {...register(`guides.${index}.primaryTopic`)}
          />
        </FormField>
        <FormField label="Supporting Topics (One per line)">
          <Controller
            control={control}
            name={`guides.${index}.supportingTopics`}
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

      <div className="grid gap-3 md:grid-cols-2">
        <FormField label="SEO Title" error={errs?.seoTitle?.message}>
          <input
            className={inputClass}
            {...register(`guides.${index}.seoTitle`)}
          />
        </FormField>
        <FormField
          label="SEO Description"
          error={errs?.seoDescription?.message}
        >
          <input
            className={inputClass}
            {...register(`guides.${index}.seoDescription`)}
          />
        </FormField>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Controller
          control={control}
          name={`guides.${index}.coverImage`}
          render={({ field: { value, onChange } }) => (
            <ImageUploadField
              label="Cover Image"
              value={value}
              onChange={onChange}
            />
          )}
        />
        <FormField label="Cover Image Alt" error={errs?.coverImageAlt?.message}>
          <input
            className={inputClass}
            {...register(`guides.${index}.coverImageAlt`)}
          />
        </FormField>
      </div>

      <FormField label="Body Markdown" error={errs?.bodyMarkdown?.message}>
        <Controller
          control={control}
          name={`guides.${index}.bodyMarkdown`}
          render={({ field }) => (
            <AutoResizeTextarea
              className={`${textareaClass} font-mono text-sm`}
              value={field.value ?? ""}
              onChange={field.onChange}
              placeholder="# Write your markdown here..."
            />
          )}
        />
      </FormField>

      <div className="grid gap-3 md:grid-cols-2">
        <FormField label="Target Queries (One per line)">
          <Controller
            control={control}
            name={`guides.${index}.targetQueries`}
            render={({ field }) => (
              <AutoResizeTextarea
                className={textareaClass}
                value={toLineText(field.value)}
                onChange={(val) => field.onChange(parseLines(val))}
              />
            )}
          />
        </FormField>
        <FormField label="Related Service Slugs (One per line)">
          <Controller
            control={control}
            name={`guides.${index}.relatedServiceSlugs`}
            render={({ field }) => (
              <AutoResizeTextarea
                className={textareaClass}
                value={toLineText(field.value)}
                onChange={(val) => field.onChange(parseLines(val))}
              />
            )}
          />
        </FormField>
        <FormField label="Related Project Slugs (One per line)">
          <Controller
            control={control}
            name={`guides.${index}.relatedProjectSlugs`}
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

      {isBenchmarkResults && (
        <div className="rounded-md border p-3">
          <h4 className="mb-3 font-medium text-sm">Benchmark Details</h4>
          <div className="grid gap-3 md:grid-cols-2">
            <FormField label="Methodology Summary">
              <input
                className={inputClass}
                {...register(
                  `guides.${index}.benchmarkDetails.methodologySummary`,
                )}
              />
            </FormField>
            <FormField label="Dataset Description">
              <input
                className={inputClass}
                {...register(
                  `guides.${index}.benchmarkDetails.datasetDescription`,
                )}
              />
            </FormField>
            <FormField label="Embedding Model">
              <input
                className={inputClass}
                {...register(`guides.${index}.benchmarkDetails.embeddingModel`)}
              />
            </FormField>
            <FormField label="Tested Systems (One per line)">
              <Controller
                control={control}
                name={`guides.${index}.benchmarkDetails.testedSystems`}
                render={({ field }) => (
                  <AutoResizeTextarea
                    className={textareaClass}
                    value={toLineText(field.value)}
                    onChange={(val) => field.onChange(parseLines(val))}
                  />
                )}
              />
            </FormField>
            <FormField label="Hardware Description">
              <input
                className={inputClass}
                {...register(
                  `guides.${index}.benchmarkDetails.hardwareDescription`,
                )}
              />
            </FormField>
            <FormField label="Repetitions">
              <input
                type="number"
                className={inputClass}
                {...register(`guides.${index}.benchmarkDetails.repetitions`, {
                  valueAsNumber: true,
                })}
              />
            </FormField>
            <FormField label="Repository URL">
              <input
                className={inputClass}
                {...register(`guides.${index}.benchmarkDetails.repositoryUrl`)}
              />
            </FormField>
            <FormField label="Raw Results URL">
              <input
                className={inputClass}
                {...register(`guides.${index}.benchmarkDetails.rawResultsUrl`)}
              />
            </FormField>
          </div>
        </div>
      )}

      {/* Citations */}
      <div className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm">Citations</h4>
          <button
            type="button"
            onClick={() => appendCitation({ title: "", url: "" })}
            className="text-xs px-2 py-1 border rounded"
          >
            Add Citation
          </button>
        </div>
        {citationFields.map((field, cIdx) => (
          <div
            key={field.id}
            className="grid grid-cols-1 md:grid-cols-5 gap-3 border-t pt-3"
          >
            <div className="md:col-span-2">
              <FormField
                label="Title"
                error={errs?.citations?.[cIdx]?.title?.message}
              >
                <input
                  className={inputClass}
                  {...register(`guides.${index}.citations.${cIdx}.title`)}
                />
              </FormField>
            </div>
            <div className="md:col-span-2">
              <FormField
                label="URL"
                error={errs?.citations?.[cIdx]?.url?.message}
              >
                <input
                  className={inputClass}
                  {...register(`guides.${index}.citations.${cIdx}.url`)}
                />
              </FormField>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => removeCitation(cIdx)}
                className="text-xs text-red-500 mb-2"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Artifacts */}
      <div className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm">Artifacts</h4>
          <button
            type="button"
            onClick={() =>
              appendArtifact({ title: "", type: "Repository", url: "" })
            }
            className="text-xs px-2 py-1 border rounded"
          >
            Add Artifact
          </button>
        </div>
        {artifactFields.map((field, aIdx) => (
          <div
            key={field.id}
            className="grid grid-cols-1 md:grid-cols-7 gap-3 border-t pt-3"
          >
            <div className="md:col-span-2">
              <FormField
                label="Title"
                error={errs?.artifacts?.[aIdx]?.title?.message}
              >
                <input
                  className={inputClass}
                  {...register(`guides.${index}.artifacts.${aIdx}.title`)}
                />
              </FormField>
            </div>
            <div className="md:col-span-2">
              <FormField
                label="Type"
                error={errs?.artifacts?.[aIdx]?.type?.message}
              >
                <select
                  className={inputClass}
                  {...register(`guides.${index}.artifacts.${aIdx}.type`)}
                >
                  <option value="Repository">Repository</option>
                  <option value="Dataset">Dataset</option>
                  <option value="Notebook">Notebook</option>
                  <option value="Model">Model</option>
                  <option value="Documentation">Documentation</option>
                  <option value="Tool">Tool</option>
                </select>
              </FormField>
            </div>
            <div className="md:col-span-2">
              <FormField
                label="URL"
                error={errs?.artifacts?.[aIdx]?.url?.message}
              >
                <input
                  className={inputClass}
                  {...register(`guides.${index}.artifacts.${aIdx}.url`)}
                />
              </FormField>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => removeArtifact(aIdx)}
                className="text-xs text-red-500 mb-2"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FAQs */}
      <div className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm">FAQs</h4>
          <button
            type="button"
            onClick={() => appendFaq({ question: "", answer: "" })}
            className="text-xs px-2 py-1 border rounded"
          >
            Add FAQ
          </button>
        </div>
        {faqFields.map((field, fIdx) => (
          <div key={field.id} className="grid gap-3 border-t pt-3">
            <FormField
              label="Question"
              error={errs?.faqs?.[fIdx]?.question?.message}
            >
              <input
                className={inputClass}
                {...register(`guides.${index}.faqs.${fIdx}.question`)}
              />
            </FormField>
            <FormField
              label="Answer"
              error={errs?.faqs?.[fIdx]?.answer?.message}
            >
              <textarea
                className={inputClass}
                rows={2}
                {...register(`guides.${index}.faqs.${fIdx}.answer`)}
              />
            </FormField>
            <button
              type="button"
              onClick={() => removeFaq(fIdx)}
              className="text-xs text-red-500 text-left"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={remove}
        className="rounded-md border border-red-200 text-red-600 px-3 py-2 text-sm hover:bg-red-50 mt-4"
      >
        Remove guide
      </button>
    </div>
  );
}

export function GuidesEditor() {
  const { control } = useFormContext<any>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "guides",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() =>
            append({
              title: `New Guide`,
              slug: `guide-${fields.length + 1}`,
              guideType: "guide",
              status: "draft",
              summary: "",
              seoTitle: "",
              seoDescription: "",
              bodyMarkdown: "",
              primaryTopic: "",
              citations: [],
              updatedAt: new Date().toISOString(),
            })
          }
          className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
        >
          Add Guide
        </button>
      </div>
      {fields.map((field, index) => (
        <GuideItemEditor
          key={field.id}
          index={index}
          remove={() => remove(index)}
        />
      ))}
    </div>
  );
}
