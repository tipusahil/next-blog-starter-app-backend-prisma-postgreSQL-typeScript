// import { PrismaClient, Prisma } from "@prisma/client";

// const prisma = new PrismaClient();

// export const excludeFieldForDeleteFromQuery = ["searchTerm", "sort", "fields", "page", "limit"];
// export const searchAbleFieldsConstant = ["name", "email", "title", "description", "slug", "location"];

// type PrismaModelDelegates = {
//   user: typeof prisma.userModel;
//   post: typeof prisma.postModel;
// };

// // মডেল-নির্দিষ্ট টাইপ ম্যাপিং
// type WhereInput<T extends keyof PrismaModelDelegates> = T extends "user"
//   ? Prisma.UserModelWhereInput
//   : Prisma.PostModelWhereInput;

// type FindManyArgs<T extends keyof PrismaModelDelegates> = T extends "user"
//   ? Prisma.UserModelFindManyArgs
//   : Prisma.PostModelFindManyArgs;

// type CountArgs<T extends keyof PrismaModelDelegates> = T extends "user"
//   ? Prisma.UserModelCountArgs
//   : Prisma.PostModelCountArgs;

// type SelectType<T extends keyof PrismaModelDelegates> = T extends "user"
//   ? Prisma.UserModelSelect
//   : Prisma.PostModelSelect;

// export class PrismaQueryBuilder<T extends keyof PrismaModelDelegates> {
//   private readonly modelDelegate: PrismaModelDelegates[T];
//   private readonly query: Record<string, string>;

//   private where: WhereInput<T> = {};
//   private orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" };
//   private select: SelectType<T> | undefined;
//   private skip = 0;
//   private take = 10;

//   constructor(modelDelegate: PrismaModelDelegates[T], query: Record<string, string>) {
//     this.modelDelegate = modelDelegate;
//     this.query = query;
//   }

//   filter(): this {
//     const filter: Record<string, any> = { ...this.query };
//     for (const field of excludeFieldForDeleteFromQuery) {
//       delete filter[field];
//     }
//     this.where = { ...this.where, ...filter };
//     return this;
//   }

//   search(searchAbleFields: string[]): this {
//     const rawTerm = this.query.searchTerm || "";
//     const searchTerm = rawTerm.trim();
//     if (searchTerm.length < 2) return this;

//     const words = searchTerm.split(/\s+/);
//     this.where = {
//       ...this.where,
//       OR: searchAbleFields.flatMap((field) =>
//         words.map((word) => ({
//           [field]: { contains: word, mode: "insensitive" },
//         }))
//       ),
//     } as WhereInput<T>;
//     return this;
//   }

//   sort(): this {
//     const sort = this.query.sort || "-createdAt";
//     this.orderBy = sort.startsWith("-")
//       ? { [sort.slice(1)]: "desc" }
//       : { [sort]: "asc" };
//     return this;
//   }

//   fields(): this {
//     if (this.query.fields) {
//       const fields = this.query.fields.split(",");
//       this.select = Object.fromEntries(fields.map((f) => [f, true])) as SelectType<T>;
//     }
//     return this;
//   }

//   paginate(): this {
//     const page = Number(this.query.page) || 1;
//     const limit = Number(this.query.limit) || 10;
//     this.skip = (page - 1) * limit;
//     this.take = limit;
//     return this;
//   }

//   async build() {
//     const args: FindManyArgs<T> = {
//       where: this.where,
//       orderBy: this.orderBy,
//       skip: this.skip,
//       take: this.take,
//       select: this.select,
//     };

//     return await this.modelDelegate.findMany(args);
//   }

//   async getMeta() {
//     const args: CountArgs<T> = {
//       where: this.where,
//     };

//     const totalDocuments = await this.modelDelegate.count(args);
//     const page = Number(this.query.page) || 1;
//     const limit = Number(this.query.limit) || 10;
//     return {
//       page,
//       limit,
//       totalPage: Math.ceil(totalDocuments / limit),
//       total: totalDocuments,
//     };
//   }
// }