import { Query } from "mongoose";
export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, any>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, any>) {
    this.modelQuery = modelQuery;
    this.query = { ...query };
  }

  public filter(): this {
    const filterQuery = { ...this.query };
    // *Remove other query parameters that are not filters
    delete filterQuery.searchTerm;
    delete filterQuery.sort;
    delete filterQuery.order;
    delete filterQuery.page;
    delete filterQuery.limit;
    delete filterQuery.fields;

    if (Object.keys(filterQuery).length > 0) {
      this.modelQuery = this.modelQuery.find(filterQuery);
    }
    return this;
  }

  // *Method to apply search based on the query parameters
  public search(searchableFields?: string[]): this {
    const searchTerm = this.query.searchTerm?.trim() || "";
    if (searchTerm && searchableFields) {
      const searchQuery = {
        $or: searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
      };
      this.modelQuery = this.modelQuery.find(searchQuery);
    }
    return this;
  }

  // *Method to apply sorting based on the query parameters
  public sort(): this {
    const sortField = this.query.sort || "createdAt";
    const sortOrder = this.query.order || "desc";
    const sortQuery = sortOrder === "asc" ? sortField : `-${sortField}`;
    this.modelQuery = this.modelQuery.sort(sortQuery);
    return this;
  }

  // *Method to apply fields based on the query parameters
  public fields(): this {
    const fields = this.query.fields;
    if (fields) {
      const fieldArray = fields.split(",").join(" ");
      this.modelQuery = this.modelQuery.select(fieldArray);
    }
    return this;
  }

  // *Method to apply pagination based on the query parameters
  public paginate(): this {
    const page = Math.max(parseInt(this.query.page) || 1, 1);
    const limit = Math.max(parseInt(this.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  // *Method to execute the query and return the results
  public build(): Query<T[], T> {
    return this.modelQuery;
  }

  // *Method to get metadata about the query
  public async getMetadata(): Promise<{
    totalDocs: number;
    filteredDocs: number;
    limit: number;
    currentPage: number;
    totalPages: number;
  }> {
    const filterQuery = this.modelQuery.model.find(this.modelQuery.getFilter());
    const filteredDocuments = await filterQuery.countDocuments();

    const totalQuery = this.modelQuery.model.find();
    const totalDocuments = await totalQuery.countDocuments();

    const page = Math.max(parseInt(this.query.page) || 1, 1);
    const limit = Math.max(parseInt(this.query.limit) || 10, 1);
    const totalPages = Math.ceil(filteredDocuments / limit);

    return {
      totalDocs: totalDocuments,
      filteredDocs: filteredDocuments,
      limit: limit,
      currentPage: page,
      totalPages: totalPages,
    };
  }
}
