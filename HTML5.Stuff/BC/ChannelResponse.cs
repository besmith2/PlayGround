using HTML5.Stuff.BC.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HTML5.Stuff.BC
{
    public class ChannelResponse: IChannelResonse
    {
        public ChannelResponse(string response, IChannelRequest request)
        {
            _Response = response;
            _Request = request;
        }

        private string _Response;
        public string Response
        {
            get
            {
                return _Response;
            }
        }

        private IChannelRequest _Request;
        public IChannelRequest Request
        {
            get { return _Request; }
        }
    }
}