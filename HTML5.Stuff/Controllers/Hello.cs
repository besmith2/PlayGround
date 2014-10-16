//using XSockets.Core.XSocket;
//using XSockets.Core.XSocket.Helpers;
//using HTML5.Stuff.BC.Interfaces;
//using HTML5.Stuff.BC;
//using XSockets.Core.Common.Socket.Event.Arguments;

//namespace HTML5.Stuff.Controllers
//{
//    public class XSocket : XSocketController
//    {
//        public string Site { get; set; }

//        public XSocket()
//        {
//            this.OnClose += XSocket_OnClose;
//            this.OnOpen += XSocket_OnOpen;
//            this.OnReopen += XSocket_OnReopen;
//        }
//        public override void OnMessage(XSockets.Core.Common.Socket.Event.Interface.IBinaryArgs binaryArgs)
//        {
//            this.SendToAllAndQueue(binaryArgs);
//        }
//        void XSocket_OnReopen(object sender, OnClientConnectArgs e)
//        {
//            //throw new System.NotImplementedException();
//        }

//        void XSocket_OnOpen(object sender, OnClientConnectArgs e)
//        {
//            //throw new System.NotImplementedException();
//        }

//        void XSocket_OnClose(object sender, OnClientDisconnectArgs e)
//        {
//            this.OfflineSubscribe(300000, "Channel");

//        }


//        public void Channel(IChannelRequest msg)
//        {
//            ChannelResponse resp = new ChannelResponse("Howdy",msg);

//            this.Send(resp, "ShowMeTheMoney");

//        }
//    }
//}


