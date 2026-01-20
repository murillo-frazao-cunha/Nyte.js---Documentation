import {Metadata, RouteConfig} from "nyte/react";
import Home from "../components/docs";

export const config: RouteConfig = {
    pattern: '/docs/[[value]]/[[value2]]',
    component: Home,
    generateMetadata: (): Metadata => ({
        title: 'Nyte.js | Docs'
    })
};
export default config
