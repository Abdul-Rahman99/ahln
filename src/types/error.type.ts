type Error = {
  status?: number;
  name?: string;
  message?: string;
  stack?: string;
  code? : number ;
  keyValue? : number ;
}

export default Error;
