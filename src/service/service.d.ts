interface ResponseDefault {
  id: number
  uuid: string
  created_at: DateTimeString | null
  updated_at: DateTimeString | null
}

interface Response<T> {
  code: number
  message: string
  data: T extends undefined ? T : T & ResponseDefault
}

type Service<T = undefined> = Promise<Response<T>>
