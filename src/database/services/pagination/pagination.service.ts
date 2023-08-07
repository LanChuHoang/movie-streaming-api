import {
  AnyExpression,
  Expression,
  FilterQuery,
  Model,
  PipelineStage,
} from "mongoose";

interface Project {
  $project: {
    [field: string]: AnyExpression | Expression | Project["$project"];
  };
}

export interface PaginationOptions {
  filter?: FilterQuery<any>;
  sort?: Record<string, 1 | -1 | Expression.Meta>;
  page: number;
  limit: number;
  projection?: {
    [field: string]: AnyExpression | Expression | Project["$project"];
  };
}

export class PaginationService<MediaType> {
  constructor(protected readonly model: Model<MediaType>) {}

  async pagination({
    filter,
    sort,
    page,
    limit,
    projection,
  }: PaginationOptions) {
    const mainPipeline: PipelineStage[] = [
      { $skip: limit * (page - 1) },
      { $limit: limit },
    ];
    if (sort) mainPipeline.unshift({ $sort: sort });
    if (projection) mainPipeline.push({ $project: projection });
    const metadataPipeline: PipelineStage[] = [{ $count: "total_documents" }];
    const combinedPipeline: PipelineStage[] = [
      {
        $facet: {
          docs: mainPipeline as any,
          meta: metadataPipeline as any,
        },
      },
      { $unwind: "$meta" },
    ];
    if (filter) combinedPipeline.unshift({ $match: filter });

    const [result] = await this.model.aggregate(combinedPipeline);
    const totalDocs = result?.meta.total_documents || 0;
    const output = {
      docs: result?.docs || [],
      page: page,
      pageSize: limit,
      totalPages: Math.ceil(totalDocs / limit),
      totalDocuments: totalDocs,
    };
    return output;
  }
}
