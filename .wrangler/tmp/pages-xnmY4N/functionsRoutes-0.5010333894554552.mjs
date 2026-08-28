import { onRequest as __api___route___ts_onRequest } from "/home/johannes/Projects/massage/functions/api/[[route]].ts"
import { onRequestGet as __robots_txt_ts_onRequestGet } from "/home/johannes/Projects/massage/functions/robots.txt.ts"
import { onRequestGet as __sitemap_xml_ts_onRequestGet } from "/home/johannes/Projects/massage/functions/sitemap.xml.ts"

export const routes = [
    {
      routePath: "/api/:route*",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api___route___ts_onRequest],
    },
  {
      routePath: "/robots.txt",
      mountPath: "/",
      method: "GET",
      middlewares: [],
      modules: [__robots_txt_ts_onRequestGet],
    },
  {
      routePath: "/sitemap.xml",
      mountPath: "/",
      method: "GET",
      middlewares: [],
      modules: [__sitemap_xml_ts_onRequestGet],
    },
  ]