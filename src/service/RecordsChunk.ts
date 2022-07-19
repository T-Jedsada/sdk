import { ImportSession } from '../importer/ImportSession'
import { ERecordStatus, FlatfileRecord } from './FlatfileRecord'

export class RecordsChunk {
  constructor(
    private session: ImportSession,
    public readonly records: FlatfileRecord[],
    private meta: {
      status: ERecordStatus
      skip: number
      totalRecords: number
      limit: number
    }
  ) {}

  public get recordIds(): number[] {
    return this.records.map((r) => r.recordId)
  }

  /**
   * Get the next chunk of data based on the current chunk
   */
  public async getNextChunk(): Promise<RecordsChunk | null> {
    if (this.meta.skip >= this.meta.totalRecords) {
      return null
    }
    return this.session.api.getRecordsByStatus(this.session, this.meta.status, 0, this.meta.limit)
  }

  /**
   * How many chunks are there to process in total
   */
  public get totalChunks(): number {
    return Math.ceil(this.meta.totalRecords / this.meta.limit)
  }

  /**
   * Which chunk is this? (0 indexed)
   */
  public get currentChunkIndex(): number {
    return Math.floor(this.meta.skip / this.meta.limit)
  }
}
