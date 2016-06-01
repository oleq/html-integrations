﻿using System;
using System.Web.UI;
using com.wiris.plugin.factory;
using System.Collections.Generic;
using com.wiris.plugin.api;
using com.wiris.system.service;

namespace plugin_web
{
    public partial class showimage : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string digest = Request.Params["formula"];
            string mml = Request.Params["mml"];
            if (digest==null && mml==null) {
                throw new Exception("Missing parameters 'formula' or 'mml'.");
            }
            // Backwards compatibility
            // showimage.php?formula.png --> showimage.php?formula
            // because formula is md5 string, remove all extensions.
            if (digest != null && digest.LastIndexOf(".") >= 0) {
                digest = digest.Substring(0, digest.LastIndexOf("."));
            }
            Dictionary<string, string> param = PluginBuilderFactory.getProperties(Request);
            // Adding - if necessary - CORS headers
            PluginBuilder pb = PluginBuilderFactory.newPluginBuilder(Request);
            HttpResponse res = new HttpResponse(this.Response);
            String origin = this.Request.Headers.Get("origin");
            pb.addCorsHeaders(res, origin);

            if (pb.getConfiguration().getProperty("wirispluginperformance", "false") == "true") {
                Response.ContentType = "application/json";
                Response.AddHeader("Cache-Control", "max-age=3600");
                int secondsToCache = 3600;
                if (digest == null) {
                    pb.newRender().showImage(digest,mml,param);
                    digest = pb.newRender().computeDigest(mml, param);
                }
                string r = pb.newRender().showImageJson(digest, "en");
                Response.Write(r);
            }
            else if (pb.getConfiguration().getProperty("wirisimageformat", "png").LastIndexOf("svg") >= 0) {
                byte [] bs = pb.newRender().showImage(digest,mml,param);
                Response.ContentType = "image/svg+xml";
                Response.OutputStream.Write(bs,0,bs.Length);
            } else {
                byte [] bs = pb.newRender().showImage(digest,mml,param);
                Response.ContentType = "image/png";
                Response.OutputStream.Write(bs,0,bs.Length);
            }
        }

        override protected void OnInit(EventArgs e)
        {
            this.Load += new System.EventHandler(this.Page_Load);
            base.OnInit(e);
        }

    }
}
