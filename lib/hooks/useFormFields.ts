import { ChangeEvent, HtmlHTMLAttributes, useState } from "react";

export function useFormFiles<T>(
  initialValues: T
): [T, (event: ChangeEvent) => void, () => void] {
  const [values, setValues] = useState<T>(initialValues);

  const handelChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValues((preValue) => ({
      ...preValue,
      [event.target.name]: event.target.value,
    }));
  };

  const resetFormFields = () => setValues(initialValues);

  return [values, handelChange, resetFormFields];
}
