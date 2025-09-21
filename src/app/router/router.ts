import { Router } from "express";
import UserRoutes from "../modules/user/user.routes";
import PostRoutes from "../modules/post/post.routes";
import AuthRoutes from "../modules/auth/auth.routes";


const router : Router = Router();

const modulesRoutes = [
    {
        path:"/user",
        route : UserRoutes,
    },
    {
        path:"/post",
        route : PostRoutes,
    },
    {
        path:"/auth",
        route : AuthRoutes,
    },
];


modulesRoutes.forEach(({path,route}) => {
    router.use(path,route)
})

// ----
// modulesRoutes.forEach((route1) => {
//   router.use(route1.path, route1.route);
// });


// ------------
export default router