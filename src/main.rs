use actix::*;
use actix_web::{web, App, HttpServer, HttpRequest, HttpResponse, Error};
use actix_web_actors::ws;
use std::sync::{Arc, Mutex};

struct WsSession {
    id: usize,
    server: Arc<Mutex<Server>>,
}

struct Server {
    sessions: Vec<Addr<WsSession>>,
    document: String, // Store the current state of the document
}

impl Server {
    fn new() -> Self {
        Server {
            sessions: Vec::new(),
            document: String::new(),
        }
    }

    fn broadcast(&self, message: &str) {
        for session in &self.sessions {
            session.do_send(TextMessage(message.to_string()));
        }
    }
}

impl Actor for WsSession {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        let mut server = self.server.lock().unwrap();
        self.id = server.sessions.len();
        server.sessions.push(ctx.address());

        // Send the current state of the document to the new client
        ctx.text(server.document.clone());
    }

    fn stopped(&mut self, ctx: &mut Self::Context) {
        self.server.lock().unwrap().sessions.retain(|addr| addr != &ctx.address());
    }
}

struct TextMessage(String);

impl Message for TextMessage {
    type Result = ();
}

impl Handler<TextMessage> for WsSession {
    type Result = ();

    fn handle(&mut self, msg: TextMessage, ctx: &mut Self::Context) {
        ctx.text(msg.0);
    }
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for WsSession {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        match msg {
            Ok(ws::Message::Text(text)) => {
                let mut server = self.server.lock().unwrap();
                server.document = text.to_string(); // Update the document state
                server.broadcast(&text);
            }
            _ => (),
        }
    }
}

async fn ws_index(
    r: HttpRequest,
    stream: web::Payload,
    data: web::Data<Arc<Mutex<Server>>>
) -> Result<HttpResponse, Error> {
    ws::start(WsSession {
        id: 0,
        server: data.get_ref().clone(),
    }, &r, stream)
}

async fn ping() -> HttpResponse {
    HttpResponse::Ok().body("pong")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let server = Arc::new(Mutex::new(Server::new()));

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(server.clone()))
            .route("/ws/", web::get().to(ws_index))
            .route("/", web::get().to(ping))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}