import { Router } from "express";
import { postControllers } from "./post.controller";







const PostRoutes : Router = Router();

PostRoutes.get("/stats", postControllers.getBlogStat)

PostRoutes.post("/create",postControllers.createPost);
PostRoutes.get("/",postControllers.getAllPosts);// get er gula upore raka valo
PostRoutes.get("/:id",postControllers.getPostById);
PostRoutes.patch("/update/:id",postControllers.updatePost);
PostRoutes.delete("/delete/:id",postControllers.deletePost)

// ------------
export default PostRoutes;