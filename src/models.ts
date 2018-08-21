export enum AttributeType {
  Class = 'class',
  Id = 'id',
}

export type Hotkey = {
  attribute: AttributeType
  value: string
  description: string
  key: string
}

export type Site = {
  host: string
  hotkeys: Hotkey[]
}

export type State = {
  sites: Site[]
}
