export enum AttributeType {
  Class = 'class',
  Id = 'id',
}

export type Hotkey = {
  attribute: AttributeType
  value: string
  description: string
  key: string
  selected?: boolean
}

export type Site = {
  host: string
  hotkeys: Hotkey[]
}

export type State = {
  sites: Site[]
}

export type Rule = chrome.events.Rule
