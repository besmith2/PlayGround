﻿using System.Web;
using System.Web.Mvc;

namespace HTML5.Stuff
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
