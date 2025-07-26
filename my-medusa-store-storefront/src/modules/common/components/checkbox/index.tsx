import { Checkbox, Label } from "@medusajs/ui"
import React from "react"

type CheckboxProps = {
  checked?: boolean
  onChange?: () => void
  label: string
  name?: string
  'data-testid'?: string
}

const CheckboxWithLabel: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  name,
  'data-testid': dataTestId
}) => {
  // Ensure checked is always a boolean to prevent controlled/uncontrolled warning
  const isChecked = Boolean(checked)
  
  return (
    <div className="flex items-center space-x-2 ">
      <Checkbox
        className="text-base-regular flex items-center gap-x-2"
        id="checkbox"
        role="checkbox"
        type="button"
        checked={isChecked}
        aria-checked={isChecked}
        onClick={onChange}
        name={name}
        data-testid={dataTestId}
      />
      <Label
        htmlFor="checkbox"
        className="!transform-none !txt-medium"
        size="large"
      >
        {label}
      </Label>
    </div>
  )
}

export default CheckboxWithLabel
