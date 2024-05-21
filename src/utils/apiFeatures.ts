// interface MongooseQuery {
//   find(arg: any): MongooseQuery;
//   sort(arg: any): MongooseQuery;
//   select(arg: any): MongooseQuery;
//   skip(arg: number): MongooseQuery;
//   limit(arg: number): MongooseQuery;
// }

// interface QueryString {
//   page?: number;
//   sort?: string;
//   limit?: number;
//   fields?: string;
//   keyword?: string;
// }

// interface PaginationResult {
//   currentPage: number;
//   limit: number;
//   numberOfPages: number;
//   next?: number;
//   prev?: number;
// }

// class ApiFeatures {
//   public mongooseQuery: MongooseQuery;
//   private queryString: QueryString;
//   public paginationResult: PaginationResult | undefined;

//   constructor(mongooseQuery: MongooseQuery, queryString: QueryString) {
//     this.mongooseQuery = mongooseQuery;
//     this.queryString = queryString;
//   }

//   filter(): ApiFeatures {
//     const queryStringObj = { ...this.queryString };
//     const excludesFields = ["page", "sort", "limit", "fields"];
//     excludesFields.forEach((field) => delete queryStringObj[field]);
//     let queryStr = JSON.stringify(queryStringObj);
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//     this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
//     return this;
//   }

//   sort(): ApiFeatures {
//     if (this.queryString.sort) {
//       const sortBy = this.queryString.sort.split(",").join(" ");
//       this.mongooseQuery = this.mongooseQuery.sort(sortBy);
//     } else {
//       this.mongooseQuery = this.mongooseQuery.sort("-createAt");
//     }
//     return this;
//   }

//   limitFields(): ApiFeatures {
//     if (this.queryString.fields) {
//       const fields = this.queryString.fields.split(",").join(" ");
//       this.mongooseQuery = this.mongooseQuery.select(fields);
//     } else {
//       this.mongooseQuery = this.mongooseQuery.select("-__v");
//     }
//     return this;
//   }

//   search(modelName: string): ApiFeatures {
//     if (this.queryString.keyword) {
//       let query: any = {};
//       if (modelName === "Contact") {
//         query.$or = [
//           { title: { $regex: this.queryString.keyword, $options: "i" } },
//           { description: { $regex: this.queryString.keyword, $options: "i" } },
//         ];
//       } else {
//         query = { name: { $regex: this.queryString.keyword, $options: "i" } };
//       }
//       this.mongooseQuery = this.mongooseQuery.find(query);
//     }
//     return this;
//   }

//   paginate(countDocuments: number): ApiFeatures {
//     const page = this.queryString.page * 1 || 1;
//     const limit = this.queryString.limit * 1 || 50;
//     const skip = (page - 1) * limit;
//     const endIndex = page * limit;

//     const pagination: PaginationResult = {
//       currentPage: page,
//       limit: limit,
//       numberOfPages: Math.ceil(countDocuments / limit),
//     };

//     if (endIndex < countDocuments) {
//       pagination.next = page + 1;
//     }
//     if (skip > 0) {
//       pagination.prev = page - 1;
//     }

//     this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
//     this.paginationResult = pagination;
//     return this;
//   }
// }

// export default ApiFeatures;
