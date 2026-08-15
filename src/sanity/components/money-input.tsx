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
    <div style={{ display: 'grid', gap: 6 }}>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          border: error ? '1px solid #d63f24' : '1px solid #cad1d5',
          borderRadius: 3,
          background: 'white',
        }}
      >
        <span
          style={{ padding: '10px 12px', borderRight: '1px solid #cad1d5' }}
        >
          £
        </span>
        <input
          aria-label={props.schemaType.title}
          inputMode="decimal"
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
          style={{
            border: 0,
            outline: 0,
            padding: 11,
            font: 'inherit',
            width: '100%',
          }}
        />
      </label>
      {error && <small style={{ color: '#d63f24' }}>{error}</small>}
    </div>
  )
}
