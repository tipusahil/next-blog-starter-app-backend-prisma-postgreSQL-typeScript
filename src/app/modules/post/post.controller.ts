import { NextFunction, Request, Response } from "express";
import { postServices } from "./post.service";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  try {
    const result = await postServices.createPost(payload);

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Post creation failed!",
      error: error,
    });
    next();
  }
};

// ------------2.update Post--
const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const payload = req.body;
  try {
    const result = await postServices.updatePost(Number(id), payload);

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Post updateding failed!",
      error: error,
    });
    next();
  }
};

// ------------3. getAllPosts --
const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query;
  // const page = Number(query.page) || 1;
  // const limit = Number(query.limit) || 10;

  try {
    const result = await postServices.getAllPosts(
      query as Record<string, string>
    );

    res.status(200).json({
      success: true,
      message: "all Posts retrieved successfully",
      data: {
        meta: result.meta,
        data: result.data,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "all Posts retrieving failed!",
      error: error,
    });
    next();
  }
};

// ---------4. getPostById ---
const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await postServices.getPostById(Number(req.params.id));

    res.status(200).json({
      success: true,
      message: "Post retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Post retrieving failed!",
      error: error,
    });
    next();
  }
};

// ---------4. deletePost ---
const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await postServices.deletePost(Number(req.params.id));

    res.status(200).json({
      success: true,
      message: "Post delete successfully",
      data: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Post delation failed!",
      error: error,
    });
    next();
  }
};


// ------------5. getBlogStat --
const getBlogStat = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const result = await postServices.getBlogStat();

    res.status(200).json({
      success: true,
      message: "Blog stats retrived successfully",
      data : result,
      // data: {
      //   meta: result.meta,
      //   data: result.data,
      // },
    });
  } catch (error : any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "all Posts retrieving failed!",
      error: error,
    });
    next();
  }
};


//  -------

// ---------------
export const postControllers = {
  createPost,
  updatePost,
  getAllPosts,
  getPostById,
  deletePost,
  getBlogStat
};
