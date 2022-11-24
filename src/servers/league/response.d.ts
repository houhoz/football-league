export type IResponseData<T> = {
  data: T
  success: boolean
  message?: string
  code: string
}
