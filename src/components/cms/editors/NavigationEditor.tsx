"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import type { PortfolioContentSchema } from "@/lib/cms-schema";
import { FormField, inputClass } from "./shared";

export function NavigationEditor() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<PortfolioContentSchema>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "navigationItems",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() =>
            append({
              title: `Item ${fields.length + 1}`,
              href: "#",
              icon: "IconCircle",
              order: fields.length + 1,
            })
          }
          className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
        >
          Add navigation item
        </button>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-3 rounded-lg border p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <FormField
              label="Title"
              error={errors.navigationItems?.[index]?.title?.message}
            >
              <input
                className={inputClass}
                {...register(`navigationItems.${index}.title`)}
              />
            </FormField>
            <FormField
              label="Href"
              error={errors.navigationItems?.[index]?.href?.message}
            >
              <input
                className={inputClass}
                {...register(`navigationItems.${index}.href`)}
              />
            </FormField>
            <FormField
              label="Icon name"
              error={errors.navigationItems?.[index]?.icon?.message}
            >
              <input
                className={inputClass}
                {...register(`navigationItems.${index}.icon`)}
              />
            </FormField>
            <FormField
              label="Order"
              error={errors.navigationItems?.[index]?.order?.message}
            >
              <input
                type="number"
                className={inputClass}
                {...register(`navigationItems.${index}.order`, {
                  valueAsNumber: true,
                })}
              />
            </FormField>
          </div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              {...register(`navigationItems.${index}.isExternal`)}
            />
            External link
          </label>
          <div>
            <button
              type="button"
              onClick={() => remove(index)}
              className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
            >
              Remove item
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
