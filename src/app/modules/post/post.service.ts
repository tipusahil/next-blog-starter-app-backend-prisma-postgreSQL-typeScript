import { PostModel, Prisma } from "../../../../generated/prisma"; // prisma/client theke import hocce
// import { Prisma, postModel } from '@prisma/client';

import { prisma } from "../../config/db.config";

// -------------------
const userDataForResponse = {
  id: true,
  name: true,
  email: true,
  password: false, // password bad diye baki data dibe.
  role: true,
  phone: true,
  picture: true,
  status: true,
  isVerified: true,
  createdAt: true,
  updatedAt: true,
  posts: {
    // select use na korle include ta use kore then onno table/collection theke data ante hbe,nise dewa ase kivabe.
    select: { title: true },
  },
};

// ---
const PostDataForResponse = {
  id: true,
  title: true,
  content: true,
  thumbnail: true,
  isFeatured: true,
  tags: true,
  view: true,
  createdAt: true,
  updatedAt: true,
  authorId: true,
  author: {
    // select: userDataForResponse,
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};
// -------------------

// ----1. create Post--
const createPost = async (
  payload: Prisma.PostModelCreateInput
): Promise<PostModel> => {
  console.log("create Post func", "payload:", payload);
  const result = await prisma.postModel.create({
    data: payload,
    include: {
      author: {
        select: {
          // select use na kore include use korle , include er vitore evabe select use kora jai, but include er baire select use korle include use korar drkr hoina,karon select er modde include er kaj gulo kora jai,
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  return result;
};

// ----2. update Post--
const updatePost = async (
  id: number,
  payload: Prisma.PostModelUpdateInput
): Promise<Partial<PostModel>> => {
  // const updatePost = async (id : number,payload: Prisma.PostModelUpdateInput) => {
  console.log("update Post func", payload);
  const result = await prisma.postModel.update({
    where: { id: id },
    data: payload,
    select: PostDataForResponse,
  });
  return result;
};

// -----3. get All Posts ---
const getAllPosts = async (query: Record<string, string>) => {
  // ---------
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const search = (query.search as string) || "";
  const isFeatured = query.isFeatured ? query.isFeatured === "true" : undefined;
  const tags = query.tags ? (query.tags as string).split(",") : [];

  // ✅ REST API convention (GitHub, Stripe ইত্যাদি সবাই ব্যবহার করে)
  // Example: ?sort=-createdAt  => createdAt desc
  const sort = query.sort || "-createdAt";
  const sortFieldRest = sort.startsWith("-") ? sort.slice(1) : sort;
  const sortOrderRest = sort.startsWith("-") ? "desc" : "asc";

  // ✅ GraphQL style convention (explicit params)
  // Example: ?sortBy=title&sortOrder=asc
  const sortBy = query.sortBy || undefined;
  const sortOrderGql = query.sortOrder === "asc" ? "asc" : "desc";

  const skip = (page - 1) * limit;
  // --------

  const searchInMultipleFields: any = {
    AND: [
      search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { content: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},

      isFeatured !== undefined ? { isFeatured } : {},
      tags && tags.length > 0 && { tags: { hasEvery: tags } },
    ].filter(Boolean),
  };

  // ----
  const data = await prisma.postModel.findMany({
    skip,
    take: limit,
    where: searchInMultipleFields,

    // orderBy: { [sortFieldRest]: sortOrderRest },
    orderBy: sortBy
      ? { [sortBy]: sortOrderGql } // 👉 GraphQL style (sortBy + sortOrder)
      : { [sortFieldRest]: sortOrderRest }, // 👉 REST API style (sort=-field)

    select: PostDataForResponse,
  });

  const total = await prisma.postModel.count({
    where: searchInMultipleFields,
  });

  const metaData = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    // meta তে কোন sort ইউজ হয়েছে সেটা রাখা useful
    sortUsed: sortBy
      ? `${sortBy}:${sortOrderGql}`
      : `${sortFieldRest}:${sortOrderRest}`,
  };

  return {
    data,
    meta: metaData,
  };
};

// ------4. getPostById---

const getPostById = async (id: number) => {
  const result = await prisma.$transaction(async (tx) => {
    const postViewUpdate = await tx.postModel.update({
      where: { id },
      data: {
        view: { increment: 1 },
      },
    });

    return await tx.postModel.findUnique({
      where: {
        id: id,
      },
      select: PostDataForResponse,
    });
  });

  return result;
};

// --------5. deletePost ---
const deletePost = async (id: number) => {
  const result = await prisma.postModel.delete({
    where: {
      id: id,
    },
  });

  return result;
};

// -----6. getBlogStat ---
const getBlogStat = async () => {
  const blogStats = await prisma.$transaction(async (tx) => {
    const aggregates = await tx.postModel.aggregate({
      _count: true,
      _sum: { view: true },
      _avg: { view: true },
      _max: { view: true },
      _min: { view: true },
    });
    // ------------
    const featuredCount = await tx.postModel.count({
      where: {
        isFeatured: true,
      },
    });
    // ----------------
    const topFeaturedAndViewedPost = await tx.postModel.findFirst({
      where: { isFeatured: true },
      orderBy: { view: "desc" },
    });
    // ------------

    const daysArray = [3,5,7, 10, 15, 20, 30];
const postsCountsByDays: Record<string, number> = {};
// Record<string, number> eta mane holo (postsCountsByDays) ei object er key gulo string hbe, ar key er values gulo number hobe.
    for (const days of daysArray) {
      const XDate = new Date();
      XDate.setDate(XDate.getDate() - days);
      // ---
      const Xcount = await tx.postModel.count({
        where: {
          createdAt: {
            gte: XDate,
          },
        },
      });

      postsCountsByDays[`last${days}Days`] = Xcount;
    }

    // const last7DaysPostsCount = await tx.postModel.count({
    //   where: {
    //     createdAt: {
    //       gte: lastWeek,
    //     },
    //   },
    // });
    // ------------
    // return aggregates;
    return {
      stats: {
        totalPosts: aggregates._count ?? 0,
        totalViews: aggregates._sum.view ?? 0,
        avgViews: aggregates._avg.view ?? 0,
        minimumViews: aggregates._min.view ?? 0,
        maximumViews: aggregates._max.view ?? 0,
        postsCountsByDays, // 👉 { last7Days: X, last10Days: Y, ... }
        totalFeaturedPost: featuredCount,
        topPost: topFeaturedAndViewedPost,
        // featuredCounts : featuredCount,
      },
      //  last7DaysPostsCount,
      // featured: {
      //   totalFeaturedPost: featuredCount,
      //   topPost : topFeaturedAndViewedPost,
      // },
    };
  });

  return blogStats;
};

// ---------------
export const postServices = {
  createPost,
  updatePost,
  getAllPosts,
  getPostById,
  deletePost,
  getBlogStat,
};
