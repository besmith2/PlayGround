﻿//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Net;
//using System.Net.Http;
//using System.Net.WebSockets;
//using System.Text;
//using System.Threading;
//using System.Threading.Tasks;
//using System.Web;
//using System.Web.Http;
//using System.Web.WebSockets;

//namespace HTML5.Stuff.Controllers
//{
//    public class websocket : ApiController
//    {
//        public HttpResponseMessage Get()
//        {
//            if (HttpContext.Current.IsWebSocketRequest)
//            {
//                AspNetWebSocketOptions options = new AspNetWebSocketOptions(){RequireSameOrigin = true};
//                HttpContext.Current.AcceptWebSocketRequest(ProcessWSChat, options);
//            }
//            return new HttpResponseMessage(HttpStatusCode.SwitchingProtocols);
//        }
//        private async Task ProcessWSChat(AspNetWebSocketContext context)
//        {
//            WebSocket socket = context.WebSocket;
//            while (true)
//            {
//                ArraySegment<byte> buffer = new ArraySegment<byte>(new byte[1024]);
//                WebSocketReceiveResult result = await socket.ReceiveAsync(
//                    buffer, CancellationToken.None);
//                if (socket.State == WebSocketState.Open)
//                {
//                    string userMessage = Encoding.UTF8.GetString(
//                        buffer.Array, 0, result.Count);
//                    userMessage = "You sent: " + userMessage + " at " +
//                        DateTime.Now.ToLongTimeString();
//                    buffer = new ArraySegment<byte>(
//                        Encoding.UTF8.GetBytes(userMessage));
//                    await socket.SendAsync(
//                        buffer, WebSocketMessageType.Text, true, CancellationToken.None);
//                }
//                else
//                {
//                    break;
//                }
//            }
//        }
//    }
//}
