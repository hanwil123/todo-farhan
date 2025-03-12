import type React from "react"
import { Input } from "../atoms/input"
import { Label } from "../atoms/label"



interface FormFieldProps {
  id : string
  label: string
  type?: string
  placeholder?: string
  value: string;
  error?: string
  name: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function FormField({ label, type = "text", placeholder, error,value, name, onChange }: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <Label className="text-xl" htmlFor={name}>{label}</Label>
      <Input
        type={type}
        id={name}
        value={value}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        className={`border border-black rounded ${error ? "border-red-500" : "border-gray-300"} placeholder-shown:placeholder-black`}
        />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

