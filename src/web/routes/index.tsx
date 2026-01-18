import {Metadata, RouteConfig} from "nyte/react";
import Home from "../components/index";

export const config: RouteConfig = {
    pattern: '/[[value]]/[[value2]]',
    component: Home,
    generateMetadata: (): Metadata => ({
        title: 'Nyte.js | Docs'
    })
};
export default config
