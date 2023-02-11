export interface RequestedDataItem {
  prop?: "textContent" | "src" | "title"
  selector: string
  name: string
  formatValue?: (val: string) => string
}

export type ResponseDataItem = { [key: string]: string | number }
