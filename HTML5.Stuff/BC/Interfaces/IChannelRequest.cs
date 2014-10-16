using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HTML5.Stuff.BC.Interfaces
{
    public interface IChannelRequest
    {
        string Action { get; set; }
        string Message { get; set; }
    }
}