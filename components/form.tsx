import { useState } from "react";

type FieldProps = {
  name: string;
  label: string;
  type: string;
  pattern?: string;
  description?: string;
  placeholder?: string;
  required: boolean;
};

const validate = (input: string, pattern?: string): boolean => {
  const regexPattern: RegExp = new RegExp(pattern || '.*');
  console.log(pattern);
  return regexPattern.test(input);
};

export const Field = ({
  name,
  label,
  type,
  pattern,
  description,
  placeholder,
  required,
}: FieldProps) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<boolean>(false);

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const email = event.target.value;
    const result = validate(email, pattern);
    setError(!result);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <div className="flex-1 mb-3">
      <label
        className="block text-sm font-medium leading-6 text-gray-900"
        htmlFor={name}
      >
        {label}
        {required && <span className="text-red-600"> *</span>}
        {description && (
          <p
            className="text-sm text-gray-600 font-normal"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
        <input
          className="peer mt-2 block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type={type}
          pattern={pattern || "*"}
          id={name}
          name={name}
          placeholder={placeholder || ""}
          required={required}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-describedby={name + "-error"}
        />
        <span
          id={name + "-error"}
          className="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block"
        >
          Please enter a valid {label}を正しく入力してください
        </span>
        {error && (
          <span
            id={name + "-error"}
            className="mt-2 text-sm text-red-500"
          >
            Input doesn&apos;t match pattern. 入力内容をご確認ください。
          </span>
        )}
      </label>
    </div>
  );
};

const isEmailDisallowed = (email: string): boolean => {
  const disallowedDomains = ["icloud.com", "g.chuo-u.ac.jp", "m.chuo-u.ac.jp"];
  const domain = email.split("@")[1];
  return disallowedDomains.some(disallowed => domain === disallowed);
};

const validateForPrivateEmail = (input: string, pattern?: string): boolean => {
  const regexPattern: RegExp = new RegExp(pattern || '.*');
  const matchesBasicPattern = regexPattern.test(input);
  
  if (!matchesBasicPattern) return false;

  // Check for disallowed domains
  if (isEmailDisallowed(input)) return false;

  return true;
};

export const FieldForPrivateEmail = ({
  name,
  label,
  type,
  pattern,
  description,
  placeholder,
  required,
}: FieldProps) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<boolean>(false);

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const email = event.target.value;
    const result = validateForPrivateEmail(email, pattern);
    setError(!result);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <div className="flex-1 mb-3">
      <label
        className="block text-sm font-medium leading-6 text-gray-900"
        htmlFor={name}
      >
        {label}
        {required && <span className="text-red-600"> *</span>}
        {description && (
          <p
            className="text-sm text-gray-600 font-normal"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
        <input
          className="peer mt-2 block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type={type}
          pattern={pattern || "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"} // Basic email regex
          id={name}
          name={name}
          placeholder={placeholder || ""}
          required={required}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-describedby={name + "-error"}
        />
        <span
          id={name + "-error"}
          className="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block"
        >
          Please enter a valid {label}を正しく入力してください
        </span>
        {error && (
          <span
            id={name + "-error"}
            className="mt-2 text-sm text-red-500"
          >
            Input doesn&apos;t match the required format. 入力内容をご確認ください。
          </span>
        )}
      </label>
    </div>
  );
};