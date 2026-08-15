'use client'

import { useEffect, useState } from 'react'
import type { NumberInputProps } from 'sanity'
import { set, unset } from 'sanity'
import { decimalToMinor } from '@/commerce/money'

export function MoneyInput(props: NumberInputProps) {
  const [display, setDisplay] = useState(
    props.value === undefined ? '' : (props.value / 100).toFixed(2),
  )
  const [error, setError] = useState('')
  useEffect(() => {
    queueMicrotask(() =>
      setDisplay(
        props.value === undefined ? '' : (props.value / 100).toFixed(2),
      ),
    )
  }, [props.value])
  return (
    <div className="money-input">
      <label
        className={
          error ? 'money-input-control has-error' : 'money-input-control'
        }
      >
        <span>£</span>
        <input
          aria-label={props.schemaType.title}
          aria-describedby={error ? 'money-input-error' : undefined}
          inputMode="decimal"
          name={props.schemaType.name}
          autoComplete="off"
          spellCheck={false}
          value={display}
          placeholder="0.00"
          onChange={(event) => {
            const value = event.target.value
            setDisplay(value)
            try {
              setError('')
              props.onChange(
                value === '' ? unset() : set(decimalToMinor(value)),
              )
            } catch (cause) {
              setError(
                cause instanceof Error ? cause.message : 'Invalid amount',
              )
            }
          }}
        />
      </label>
      {error && <small id="money-input-error">{error}</small>}
    </div>
  )
}
