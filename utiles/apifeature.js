const qs = require("qs");
const { countDocuments, modelName } = require("../models/productmodel");

class Apifeature {
  constructor(mongoosequery, querystring) {
    this.querystring = querystring;
    this.mongoosequery = mongoosequery;
  }

  filter() {
    const queryStringObj = qs.parse(this.querystring);
    const excludefields = ["page", "limit", "sort", "fields", "keyword"];
    excludefields.forEach((field) => delete queryStringObj[field]);
    //1- Apply filteration using[gte,gt,lte,lt]
    let querystr = JSON.stringify(queryStringObj);
    querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.mongoosequery = this.mongoosequery.find(JSON.parse(querystr));
    return this;
  }
  
  sort() {
    if (this.querystring.sort) {
      const sortBy = this.querystring.sort.split(",").join(" ");
      this.mongoosequery = this.mongoosequery.sort(sortBy);
    } else {
      this.mongoosequery = this.mongoosequery.sort("-createAt");
    }
    return this;
  }
  
  limitFileds() {
    if (this.querystring.fields) {
      const fields = this.querystring.fields.split(",").join(" ");
      this.mongoosequery = this.mongoosequery.select(fields);
    } else {
      this.mongoosequery = this.mongoosequery.select("-__v");
    }
    return this;
  }
  
  search(modelName) {
    if (this.querystring.keyword) {
      let query = {};
      if (modelName === "product") {
        query.$or = [
          { title: { $regex: this.querystring.keyword, $options: "i" } },
          { description: { $regex: this.querystring.keyword, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.querystring.keyword, $options: "i" } };
      }

      this.mongoosequery = this.mongoosequery.find(query);
    }
    return this;
  }
  
  pagination(countDocument) {
    const page = this.querystring.page * 1 || 1;
    const limit = this.querystring.limit * 1 || 50;
    const skip = (page - 1) * limit;
    //pagination result
    const pagination = {};
    pagination.page = page;
    pagination.limit = limit;
    pagination.numberofpages = Math.ceil(countDocument / limit);
    const endindex = page * limit;
    if (endindex < countDocument) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.mongoosequery = this.mongoosequery.skip(skip).limit(limit);
    this.paginationResult = pagination;

    return this;
  }
}

module.exports = Apifeature;
