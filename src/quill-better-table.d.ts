// quill-better-table.d.ts
declare module 'quill-better-table' {
    import Quill from 'quill';

    class TableModule extends Quill.Module {
      static register(): void;
      insertTable(rows: number, columns: number): void;
    }

    export default TableModule;
  }
