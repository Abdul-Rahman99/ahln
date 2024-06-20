export type Error = {
  status?: number;
  name?: string;
  message?: string;
  stack?: string;
  code?: number;
  keyValue?: number;
};
const defaultExport = Error;
export default defaultExport;
