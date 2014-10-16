using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HTML5.Stuff.BC.Interfaces
{
    public interface IChannelResonse
    {
        string Response { get; }
        IChannelRequest Request { get; }
    }
}