import { ExcelApi } from '@/api/v1/excel'
import { State, Effect } from 'rx-state'
import { Injectable } from 'vue-service-app'
import { then } from '@/operators'
import { MessageService } from '@/services/message.service'

@Injectable()
export class ExportService {
  loading$ = new State({})
  constructor(
    private excelApi: ExcelApi,
    private messageService: MessageService
  ) {}
  @Effect()
  export(path: string, params: any) {
    console.log(params)
    return this.excelApi.export(path, params)
  }
}
