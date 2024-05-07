type DateTimeString =
  `${number}-${string}-${string} ${string}:${string}:${string}`

type NumberString = `${number}`

type SelectOption<T = unknown> = ({
  label: string
  value: string | number
} & T)[]
