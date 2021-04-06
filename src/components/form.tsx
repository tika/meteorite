import { ZodObject } from "zod";
import { Infer } from "zod/lib/src/types/base";
import React, { ChangeEventHandler, FocusEventHandler, useState } from "react";
import toast from "react-hot-toast";

export interface FormFieldProps {
  onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  name: string;
  disabled: boolean;
  error?: string;
}

interface FormProps<
  T extends ZodObject<any, any>,
  HiddenFields extends keyof Infer<T>
> {
  schema: T;
  buttonText?: string;
  submit(body: Infer<T>, clear: () => void): Promise<unknown>;
  hiddenFields?: { [K in HiddenFields]: Infer<T["shape"][K]> };
  components: {
    [K in Exclude<keyof Infer<T>, HiddenFields>]: (
      props: FormFieldProps
    ) => JSX.Element;
  };
}

export function Form<T extends ZodObject<any, any>, H extends keyof Infer<T>>(
  props: FormProps<T, H>
) {
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        const data = props.schema.safeParse({
          ...Object.fromEntries(formData.entries()),
          ...props.hiddenFields,
        });

        if ("error" in data) {
          const errorEntries = data.error.errors.map((error) => {
            return [error.path[0], error.message] as const;
          });

          setErrors(Object.fromEntries(errorEntries));
        } else {
          setErrors({});
          setLoading(true);

          const promise = props.submit(data.data, () => {
            (e.target as HTMLFormElement).reset();
          });

          await toast
            .promise(promise, {
              success: "Success",
              loading: "Loading",
              error: (e) => e.message || "Something went wrong...",
            })
            .catch(() => null)
            .finally(() => setLoading(false));
        }
      }}
      className="flex flex-col items-center"
    >
      {Object.entries(props.schema.shape).map((entry, index) => {
        const [key] = entry;

        const error = errors[key];

        const componentProps: FormFieldProps = {
          name: key,
          disabled: loading,
          onChange: (e) => {
            const result = props.schema.shape[key].safeParse(e.target.value);

            if (error && !result.error) {
              setErrors({ ...errors, [key]: undefined });
            }
          },
          onBlur: (e) => {
            const result = props.schema.shape[key].safeParse(e.target.value);

            if (result.error && e.target.value.trim() !== "") {
              setErrors({ ...errors, [key]: result.error.errors[0].message });
            } else if (e.target.value.trim() === "") {
              setErrors({ ...errors, [key]: undefined });
            }
          },
          error: error,
        };

        const component =
          props.components[key as keyof typeof props.components];

        if (!component) {
          return null;
        }

        return component(componentProps);
      })}

      <button
        disabled={loading}
        className="inline-flex gap-1 items-center justify-center px-8 py-2 border border-transparent shadow-sm text-base font-medium rounded-full text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {props.buttonText ?? "Submit"}
      </button>
    </form>
  );
}
